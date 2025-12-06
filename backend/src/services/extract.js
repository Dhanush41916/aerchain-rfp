const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractTextFromFile(filePath, mimetype) {
  if (mimetype === 'application/pdf' || filePath.endsWith('.pdf')) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return (data.text || '').trim();
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch {
    return '';
  }
}

module.exports = { extractTextFromFile };
