import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Trash2, Zap, ArrowRight, AlertCircle } from 'lucide-react'
import API_BASE from '../api'

const AVAILABLE_STEPS = [
  { id: 'clean', label: 'Clean Text',  description: 'Remove extra whitespace and fix grammar' },
  { id: 'summarize', label: 'Summarize',  description: 'Condense to key points' },
  { id: 'keypoints', label: 'Extract Key Points',  description: 'Bullet-point format' },
  { id: 'tag', label: 'Auto-Categorize', description: 'Classify into categories' },
]

export default function Builder() {
  const [workflows, setWorkflows] = useState([])
  const [newWorkflow, setNewWorkflow] = useState({ name: '', steps: [] })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchWorkflows() }, [])

  async function fetchWorkflows() {
    try {
      const res = await axios.get(`${API_BASE}/api/workflows`)
      setWorkflows(res.data)
    } catch (err) {
      setError('Failed to load workflows')
    }
  }

  function toggleStep(stepId) {
    setError('')
    setNewWorkflow(prev => ({
      ...prev,
      steps: prev.steps.includes(stepId)
        ? prev.steps.filter(s => s !== stepId)
        : [...prev.steps, stepId],
    }))
  }

  async function handleCreateWorkflow(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newWorkflow.name.trim()) return setError('Workflow name is required')
    if (newWorkflow.steps.length < 2) return setError('Select at least 2 steps')

    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE}/api/workflows`, newWorkflow)
      setWorkflows([res.data, ...workflows])
      setNewWorkflow({ name: '', steps: [] })
      setSuccess('Workflow created successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create workflow')
    }
    setLoading(false)
  }

  async function handleDeleteWorkflow(id) {
    if (!confirm('Delete this workflow?')) return
    try {
      await axios.delete(`${API_BASE}/api/workflows/${id}`)
      setWorkflows(workflows.filter(w => w._id !== id))
      setSuccess('Workflow deleted')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to delete workflow')
    }
  }

  return (
    <div className="page">
      <div className="page-bg-dots" />
      <div className="page-glow-tl" />
      <div className="page-glow-br" />

      <div className="page-content">
        <div className="page-header">
          <p className="page-label">Workflow Design</p>
          <h1 className="page-title">Build Your Pipeline</h1>
          <p className="page-subtitle">Chain multiple AI transformations to automate your text processing</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'flex-start' }}>
          {/* Form */}
          <form onSubmit={handleCreateWorkflow} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Name */}
            <div className="card p-8">
              <label style={{ display: 'block', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Workflow Name</label>
              <input
                className="input"
                type="text"
                value={newWorkflow.name}
                onChange={e => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                placeholder="e.g., Content Polisher"
              />
            </div>

            {/* Steps */}
            <div className="card p-8">
              <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 20 }}>Select Processing Steps</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {AVAILABLE_STEPS.map(step => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    className={`step-btn ${newWorkflow.steps.includes(step.id) ? 'step-btn-active' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-text-primary)' }}>{step.label}</p>
                        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>{step.description}</p>
                      </div>
                      <span style={{ fontSize: 18 }}>{step.icon}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pipeline Preview */}
            {newWorkflow.steps.length > 0 && (
              <div className="card p-6">
                <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 16 }}>Processing Pipeline</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
                  <span className="pipeline-node pipeline-node-muted">Input</span>
                  {newWorkflow.steps.map(step => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <ArrowRight size={14} color="var(--color-cyan)" />
                      <span className="pipeline-node pipeline-node-active">
                        {AVAILABLE_STEPS.find(s => s.id === step)?.label}
                      </span>
                    </div>
                  ))}
                  <ArrowRight size={14} color="var(--color-cyan)" />
                  <span className="pipeline-node pipeline-node-muted">Output</span>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success">✓ {success}</div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary">
              <Zap size={18} />
              {loading ? 'Creating…' : 'Deploy Workflow'}
            </button>
          </form>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card p-6">
              <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 16 }}>Active Workflows</p>
              {workflows.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>No workflows yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 520, overflowY: 'auto' }}>
                  {workflows.map(wf => (
                    <div key={wf._id} style={{ background: 'rgba(0,8,18,0.55)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 14, transition: 'border-color .2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-border-hover)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 style={{ fontWeight: 700, fontSize: 13 }}>{wf.name}</h3>
                        <button
                          onClick={() => handleDeleteWorkflow(wf._id)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', padding: 2, transition: 'color .2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-error)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {wf.steps.map(step => (
                          <span key={step} className="badge badge-cyan">{AVAILABLE_STEPS.find(s => s.id === step)?.label.split(' ')[0]}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid var(--color-border)', borderRadius: 10, padding: 20 }}>
              <p style={{ color: 'var(--color-cyan)', fontSize: 12, lineHeight: 1.7 }}>
                <span style={{ fontWeight: 700, display: 'block', marginBottom: 6 }}>💡 Pro Tips:</span>
                Order matters — each output feeds into the next step. Start with cleaning, then transform.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile stacking */}
        <style>{`
          @media (max-width: 900px) {
            .builder-layout { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  )
}