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
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: 'hi' }]
          }
        ]
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    health.llm = 'ok';
  } catch (err) {
    console.error('Gemini API Error:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    health.llm = 'error';
  }

  res.json(health);
});

module.exports = router;