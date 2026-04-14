import { useState, useEffect } from 'react'
import axios from 'axios'
import { Play, AlertCircle, CheckCircle } from 'lucide-react'
import API_BASE from '../api'

const STEP_LABELS = {
  clean: 'Clean Text',
  summarize: 'Summarize',
  keypoints: 'Extract Key Points',
  tag: 'Tag Category',
}

const STEP_ICONS = {
  clean: '✨',
  summarize: '📝',
  keypoints: '🎯',
  tag: '🏷️',
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
    setError('')
    if (!selectedId) return setError('Please select a workflow')
    if (!input.trim()) return setError('Please enter some text')

    setResult(null)
    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE}/api/runs/execute`, { workflowId: selectedId, input })
      setResult(res.data.run)
    } catch (err) {
      setError(err.response?.data?.error || 'Execution failed')
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <div className="page-bg-dots" />
      <div className="page-glow-tl" />
      <div className="page-glow-br" />

      <div className="page-content">
        <div className="page-header">
          <p className="page-label">Execution Engine</p>
          <h1 className="page-title">Run Workflow</h1>
          <p className="page-subtitle">Execute your pipeline and watch the magic happen in real-time</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32, alignItems: 'flex-start' }}>
          {/* Control Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Workflow Select */}
            <div className="card p-8">
              <label style={{ display: 'block', fontWeight: 700, fontSize: 13, marginBottom: 14 }}>Select Workflow</label>
              <select
                className="select"
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
              >
                <option value="">— Choose a workflow —</option>
                {workflows.map(w => (
                  <option key={w._id} value={w._id}>{w.name}</option>
                ))}
              </select>
            </div>

            {/* Input Text */}
            <div className="card p-8">
              <label style={{ display: 'block', fontWeight: 700, fontSize: 13, marginBottom: 14 }}>Input Text</label>
              <textarea
                className="textarea"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Paste your text here…"
              />
            </div>

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleRun}
              disabled={loading}
              className="btn btn-primary"
            >
              <Play size={18} />
              {loading ? 'Processing…' : 'Execute Workflow'}
            </button>
          </div>

          {/* Status Panel */}
          <div>
            {loading && (
              <div className="card p-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, minHeight: 200 }}>
                <div className="spinner-wrap">
                  <div className="spinner-track" />
                  <div className="spinner-fill" />
                </div>
                <p style={{ fontWeight: 700 }}>Processing…</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', textAlign: 'center' }}>Transforming your text through the pipeline</p>
              </div>
            )}

            {result && !loading && (
              <div className="card p-8">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={18} color="var(--color-success)" />
                  <p style={{ fontWeight: 700, color: 'var(--color-success)' }}>Execution Complete</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
                  {[
                    { label: 'Workflow', value: result.workflowName },
                    { label: 'Steps Executed', value: result.steps.length },
                    { label: 'Status', value: 'Success', color: 'var(--color-success)' },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 4 }}>{label}</p>
                      <p style={{ color: color || 'var(--color-text-primary)' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Display */}
        {result && !loading && (
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 4, height: 28, background: 'linear-gradient(180deg, var(--color-cyan), #006f80)', borderRadius: 99, display: 'block' }} />
              Pipeline Results
            </h2>

            {/* Original Input */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-3">
                <span style={{ fontSize: 20 }}>📥</span>
                <p style={{ fontWeight: 700 }}>Original Input</p>
              </div>
              <div style={{ background: 'rgba(0,8,18,0.55)', border: '1px solid rgba(100,116,139,0.3)', borderRadius: 8, padding: 16, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, maxHeight: 128, overflowY: 'auto' }}>
                {result.input}
              </div>
            </div>

            {/* Step Results */}
            {result.steps.map((step, idx) => (
              <div key={idx} className="card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-cyan-dim)', border: '1px solid rgba(0,229,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {STEP_ICONS[step] || '⚙️'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700 }}>{STEP_LABELS[step]}</p>
                    <p style={{ fontSize: 12, color: 'var(--color-cyan)' }}>Step {idx + 1}</p>
                  </div>
                </div>
                <div style={{ background: 'rgba(0,8,18,0.55)', border: '1px solid rgba(100,116,139,0.3)', borderRadius: 8, padding: 16, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, maxHeight: 160, overflowY: 'auto' }}>
                  {result.outputs[idx]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}