const mongoose = require('mongoose');

const runSchema = new mongoose.Schema({
  workflowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow' },
  workflowName: String,
  input: String,
  steps: [String],
  outputs: [String],
}, { timestamps: true });

module.exports = mongoose.model('Run', runSchema);