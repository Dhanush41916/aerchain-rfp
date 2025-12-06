const axios = require('axios');

async function callLLM(prompt) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200
      },
      { headers: { Authorization: `Bearer ${key}` } }
    );
    return response.data;
  } catch (err) {
    return null;
  }
}

async function scoreRfp({ text }) {
  const keywords = ['deadline', 'budget', 'scope', 'timeline', 'requirements', 'submission'];
  const lower = text.toLowerCase();
  
  let score = Math.min(100, Math.floor((lower.length / 1000) * 50));

  let matches = 0;
  keywords.forEach(k => lower.includes(k) && matches++);

  score += matches * 10;
  if (score > 100) score = 100;

  return { score, metadata: { matches, length: lower.length } };
}

module.exports = { scoreRfp };
