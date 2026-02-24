import { useState, useEffect } from 'react'
import axios from 'axios'

const STEP_OPTIONS = [
  { key: 'clean', label: 'Clean Text' },
  { key: 'summarize', label: 'Summarize' },
  { key: 'keypoints', label: 'Extract Key Points' },
  { key: 'tag', label: 'Tag Category' },
]

export default function Builder() {
  const [name, setName] = useState('')
  const [steps, setSteps] = useState([])
  const [workflows, setWorkflows] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchWorkflows() }, [])

  async function fetchWorkflows() {
    const res = await axios.get('/api/workflows')
    setWorkflows(res.data)
  }

  function toggleStep(key) {
    if (steps.includes(key)) {
      setSteps(steps.filter(s => s !== key))
    } else if (steps.length < 4) {
      setSteps([...steps, key])
    }
  }

  async function handleSave() {
    if (!name.trim()) return setMessage('Please enter a workflow name')
    if (steps.length < 2) return setMessage('Select at least 2 steps')
    setLoading(true)
    try {
      await axios.post('/api/workflows', { name, steps })
      setMessage('Workflow saved!')
      setName('')
      setSteps([])
      fetchWorkflows()
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to save')
    }
    setLoading(false)
  }

  async function handleDelete(id) {
    await axios.delete(`/api/workflows/${id}`)
    fetchWorkflows()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Workflow Builder</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Workflow Name</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. News Analyzer"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Steps (2–4, order matters)</label>
          <div className="grid grid-cols-2 gap-3">
            {STEP_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => toggleStep(opt.key)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  steps.includes(opt.key)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                {steps.includes(opt.key) && (
                  <span className="ml-2 text-xs bg-blue-500 text-white rounded-full px-2 py-0.5">
                    {steps.indexOf(opt.key) + 1}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {steps.length > 0 && (
          <div className="mb-4 flex gap-2 flex-wrap">
            {steps.map((s, i) => (
              <span key={s} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {i + 1}. {STEP_OPTIONS.find(o => o.key === s)?.label}
              </span>
            ))}
          </div>
        )}

        {message && <p className="text-sm mb-3 text-blue-600">{message}</p>}

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Workflow'}
        </button>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Saved Workflows</h2>
      {workflows.length === 0 && <p className="text-gray-400">No workflows yet.</p>}
      <div className="space-y-3">
        {workflows.map(w => (
          <div key={w._id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{w.name}</p>
              <p className="text-sm text-gray-500">{w.steps.join(' → ')}</p>
            </div>
            <button
              onClick={() => handleDelete(w._id)}
              className="text-red-400 hover:text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}