const express = require('express');
const multer = require('multer');
const path = require('path');
const { extractTextFromPdf } = require('../services/extract');
const { callLLM, scoreRfp } = require('../services/score');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeBase = base.replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${safeBase}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// Health just for RFP module
router.get('/health', (req, res) => {
  res.json({ status: 'ok', route: 'rfp', uploadsPath: '/api/rfp/upload' });
});

// Upload endpoint: POST /api/rfp/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const text = await extractTextFromPdf(filePath);

    const llmResponse = await callLLM(
      `You are an AI assistant that helps score RFP documents. Return a JSON with fields: score (0-100), summary (2-3 sentences), risks (array of strings). RFP text: ${text.slice(
        0,
        4000
      )}`
    );

    let aiScore = null;
    let aiSummary = '';
    let aiRisks = [];

    if (llmResponse && llmResponse.choices && llmResponse.choices[0]) {
      const raw = llmResponse.choices[0].message?.content || '';
      try {
        const parsed = JSON.parse(raw);
        aiScore = parsed.score ?? null;
        aiSummary = parsed.summary ?? '';
        aiRisks = parsed.risks ?? [];
      } catch {
        aiSummary = raw;
      }
    }

    const ruleScore = scoreRfp({ text });

    const finalScore =
      aiScore != null ? Math.round((aiScore + ruleScore) / 2) : ruleScore;

    res.json({
      file: req.file.originalname,
      score: finalScore,
      aiScore,
      ruleScore,
      summary: aiSummary,
      risks: aiRisks,
      textLength: text.length,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process RFP', details: err.message });
  }
});

module.exports = router;
