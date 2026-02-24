const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/test-gemini', async (req, res) => {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);

    // List available models
    console.log('Listing available models...');
    const modelsResponse = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );

    const allModels = modelsResponse.data.models.map(m => ({
      name: m.name,
      displayName: m.displayName,
      supportsGenerateContent: m.supportedGenerationMethods?.includes('generateContent') || false
    }));

    const availableModels = allModels.filter(m => m.supportsGenerateContent);

    console.log('All models:', allModels);
    console.log('Available for generateContent:', availableModels);

    // Try first available model
    if (availableModels.length === 0) {
      return res.json({
        status: 'error',
        error: 'No models available for generateContent on your account',
        apiKeyValid: true,
        allModels,
        recommendation: 'Your student free plan may not include access to any text generation models. Try upgrading or check Google AI Studio for available models.'
      });
    }

    const modelToTest = availableModels[0].name.split('/')[1]; // Extract model name
    console.log(`Testing ${modelToTest}...`);

    const testResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelToTest}:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    console.log(`${modelToTest} works!`);

    res.json({
      status: 'success',
      apiKeyValid: true,
      availableModels,
      testedModel: modelToTest,
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