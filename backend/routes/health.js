const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');

router.get('/', async (req, res) => {
  const health = {
    backend: 'ok',
    mongodb: 'error',
    llm: 'error'
  };

  // Check MongoDB
  if (mongoose.connection.readyState === 1) {
    health.mongodb = 'ok';
  }

  // Check Gemini
  try {
    await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
      {
        model: 'gemini-2.5-flash',
        messages: [{ role: 'user', content: 'hi' }],
        max_tokens: 5
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    health.llm = 'ok';
  } catch (err) {
    health.llm = 'error';
  }

  res.json(health);
});

module.exports = router;