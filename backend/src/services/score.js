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
        max_tokens: 300
      },
      {
        headers: { Authorization: `Bearer ${key}` }
      }
    );
    return response.data;
  } catch (err) {
    console.error('LLM error:', err.message);
    return null;
  }
}

function scoreRfp({ text }) {
  const keywords = ['deadline', 'budget', 'scope', 'timeline', 'requirements'];
  let score = 0;
  const lower = text.toLowerCase();
  const matched = [];

  for (const kw of keywords) {
    if (lower.includes(kw)) {
      score += 20;
      matched.push(kw);
    }
  }

  if (score > 100) score = 100;

  return { score, matchedKeywords: matched };
}

module.exports = { callLLM, scoreRfp };
