const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/test-gemini', async (req, res) => {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    console.log('API Key length:', process.env.GEMINI_API_KEY?.length);

    // Test 1: List available models
    console.log('Attempting to list models...');
    const modelsResponse = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );

    const availableModels = modelsResponse.data.models
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name);

    console.log('Available models:', availableModels);

    // Test 2: Try a simple API call with gemini-1.5-flash
    console.log('Testing gemini-1.5-flash...');
    const testResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: 'Say hello' }]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('gemini-1.5-flash works!');

    res.json({
      status: 'success',
      apiKeyValid: true,
      availableModels,
      testResult: testResponse.data.candidates[0].content.parts[0].text
    });

  } catch (err) {
    console.error('Gemini test failed:', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: err.message
    });

    res.status(500).json({
      status: 'error',
      error: err.response?.data?.error?.message || err.message,
      apiKeyValid: false,
      details: {
        status: err.response?.status,
        message: err.response?.data?.error?.message
      }
    });
  }
});

module.exports = router;