import { useState, useEffect } from 'react'
import axios from 'axios'
import API_BASE from '../api'

const STEP_LABELS = {
  clean: 'Clean Text',
  summarize: 'Summarize',
  keypoints: 'Extract Key Points',
  tag: 'Tag Category'
}

export default function Run() {
  const [workflows, setWorkflows] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${API_BASE}/api/workflows`).then(res => setWorkflows(res.data))
  }, [])

  async function handleRun() {
    if (!selectedId) return setError('Please select a workflow')
    if (!input.trim()) return setError('Please enter some text')
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE}/api/runs/execute`, {
        workflowId: selectedId,
        input
      })
      setResult(res.data.run)
    } catch (err) {
      setError(err.response?.data?.error || 'Execution failed')
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Run Workflow</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Workflow</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
          >
            <option value="">-- Choose a workflow --</option>
            {workflows.map(w => (
              <option key={w._id} value={w._id}>{w.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Input Text</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste your text here..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleRun}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Running...' : 'Run Workflow'}
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-500">Processing pipeline... this may take a moment</p>
        </div>
      )}

      {result && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Pipeline Results</h2>
          <div className="space-y-4">
            {result.steps.map((step, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-gray-700">{STEP_LABELS[step]}</span>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap">{result.outputs[i]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}