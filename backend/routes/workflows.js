const express = require('express');
const router = express.Router();
const Workflow = require('../models/Workflow');

// Get all workflows
router.get('/', async (req, res) => {
  try {
    const workflows = await Workflow.find().sort({ createdAt: -1 });
    res.json(workflows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

// Create workflow
router.post('/', async (req, res) => {
  try {
    const { name, steps } = req.body;
    if (!name || !steps || steps.length < 2 || steps.length > 4) {
      return res.status(400).json({ error: 'Need a name and 2-4 unique steps' });
    }
    if (new Set(steps).size !== steps.length) {
      return res.status(400).json({ error: 'Steps must be unique' });
    }
    const workflow = await Workflow.create({ name, steps });
    res.status(201).json(workflow);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

// Delete workflow
router.delete('/:id', async (req, res) => {
  try {
    await Workflow.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workflow' });
  }
});

module.exports = router;