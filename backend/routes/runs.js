const express = require('express');
const router = express.Router();
const Run = require('../models/Run');
const Workflow = require('../models/Workflow');
const axios = require('axios');

const STEP_PROMPTS = {
  clean: 'Clean this text by removing extra whitespace and fixing basic grammar. Return only the cleaned text:',
  summarize: 'Summarize this text in approximately 5 lines. Return only the summary:',
  keypoints: 'Extract the key points from this text as bullet points. Return only the bullet points:',
  tag: 'Classify this text into exactly one of these categories: Technology, Finance, Health, Education, Other. Return only the category name:'
};

async function callGemini(prompt, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await new Promise(res => setTimeout(res, delay));

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      return response.data.candidates[0].content.parts[0].text;

    } catch (err) {
      console.error("Gemini error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });

      if (err.response?.status === 429 && i < retries - 1) {
        delay *= 2;
        continue;
      }
      throw err;
    }
  }
}

// Execute a workflow
router.post('/execute', async (req, res) => {
  try {
    const { workflowId, input } = req.body;
    if (!workflowId || !input) {
      return res.status(400).json({ error: 'workflowId and input are required' });
    }

    const workflow = await Workflow.findById(workflowId);
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });

    let currentText = input;
    const outputs = [];

    for (const step of workflow.steps) {
      const prompt = `${STEP_PROMPTS[step]}\n\n${currentText}`;
      const result = await callGemini(prompt);
      outputs.push(result);
      currentText = result;
    }

    const run = await Run.create({
      workflowId: workflow._id,
      workflowName: workflow.name,
      input,
      steps: workflow.steps,
      outputs
    });

    res.json({ run });
  } catch (err) {
    console.error('Workflow execution error:', err.message);
    res.status(500).json({ error: 'Execution failed', details: err.message });
  }
});

// Get last 5 runs
router.get('/', async (req, res) => {
  try {
    const runs = await Run.find().sort({ createdAt: -1 }).limit(5);
    res.json(runs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch runs' });
  }
});

module.exports = router;