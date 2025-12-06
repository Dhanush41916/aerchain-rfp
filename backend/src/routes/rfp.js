const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { extractTextFromFile } = require('../services/extract');
const { scoreRfp } = require('../services/score');

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../../uploads/') });

const rfps = [];

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const text = await extractTextFromFile(file.path, file.mimetype);
    const { score, metadata } = await scoreRfp({ text });

    const rfp = {
      id: Date.now().toString(),
      title: metadata.title || file.originalname,
      extractedText: text,
      score,
      metadata,
      createdAt: new Date().toISOString()
    };

    rfps.unshift(rfp);
    fs.unlink(file.path, () => {});

    res.json({ rfp });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

router.get('/', (req, res) => {
  res.json({ list: rfps });
});

module.exports = router;
