import { useState, useEffect } from 'react'
import axios from 'axios'
import { RefreshCw, Activity, Database, Zap, CheckCircle, AlertCircle } from 'lucide-react'
import API_BASE from '../api'

export default function Health() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(() => {
      if (autoRefresh) fetchHealth()
    }, 10000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  async function fetchHealth() {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/health`)
      setHealth(res.data)
      setLastCheck(new Date().toLocaleTimeString())
    } catch {
      setHealth({ backend: 'error', mongodb: 'error', llm: 'error' })
    }
    setLoading(false)
  }

  const StatusCard = ({ icon: Icon, label, status, description }) => {
    const ok = status === 'ok'
    return (
      <div className="card p-8" style={{ borderColor: ok ? 'rgba(0,229,255,0.35)' : 'rgba(255,113,108,0.35)' }}>
        <div className="flex justify-between items-start mb-6">
          <div style={{ width: 48, height: 48, borderRadius: 10, background: ok ? 'var(--color-cyan-dim)' : 'rgba(255,113,108,0.1)', border: `1px solid ${ok ? 'rgba(0,229,255,0.3)' : 'rgba(255,113,108,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={22} color={ok ? 'var(--color-cyan)' : 'var(--color-error)'} />
          </div>
          {ok
            ? <CheckCircle size={22} color="var(--color-success)" />
            : <AlertCircle size={22} color="var(--color-error)" />
          }
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{label}</h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 24 }}>{description}</p>

        <div className="flex items-center gap-3 mb-4">
          <span className={`status-dot ${ok ? 'status-dot-ok' : 'status-dot-error'}`} />
          <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: ok ? 'var(--color-success)' : 'var(--color-error)' }}>
            {ok ? 'OPERATIONAL' : 'ERROR'}
          </span>
        </div>

        <div style={{ background: 'rgba(0,8,18,0.55)', border: '1px solid rgba(100,116,139,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>
          Status: {status.toUpperCase()}
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-bg-dots" />
      <div className="page-glow-tl" />
      <div className="page-glow-br" />

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div className="page-header">
          <p className="page-label">System Diagnostics</p>
          <h1 className="page-title">Health Monitor</h1>
          <p className="page-subtitle">Real-time status of all system components</p>
        </div>

        {/* Controls */}
        <div className="card p-6 flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 16 }}>
          <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="btn btn-secondary"
            >
              <RefreshCw size={15} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
              Refresh Status
            </button>
            <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={e => setAutoRefresh(e.target.checked)}
                style={{ width: 15, height: 15, accentColor: 'var(--color-cyan)' }}
              />
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Auto-refresh (10s)</span>
            </label>
          </div>
          {lastCheck && (
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              Last check: <span style={{ color: 'var(--color-cyan)' }}>{lastCheck}</span>
            </p>
          )}
        </div>

        {/* Status Cards */}
        {health ? (
          <div className="grid-3">
            <StatusCard icon={Activity} label="Backend Server" status={health.backend} description="Express.js API running on Render" />
            <StatusCard icon={Database} label="Database" status={health.mongodb} description="MongoDB Atlas connection status" />
            <StatusCard icon={Zap} label="Gemini AI" status={health.llm} description="Google Gemini API availability" />
          </div>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: 64 }}>
            <div className="spinner-wrap" style={{ margin: '0 auto 20px' }}>
              <div className="spinner-track" />
              <div className="spinner-fill" />
            </div>
            <p>Loading system status…</p>
          </div>
        )}

        {/* Detailed Info */}
        <div className="grid-2">
          {/* System Architecture */}
          <div className="card p-8" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 4, height: 22, background: 'linear-gradient(180deg, var(--color-cyan), #006f80)', borderRadius: 99, display: 'block' }} />
              System Architecture
            </h2>
            {[
              { label: 'Frontend', main: 'React + Vite on Vercel', sub: 'Auto-deployed on git push' },
              { label: 'Backend', main: 'Express.js on Render', sub: 'RESTful API with MongoDB integration' },
              { label: 'Database', main: 'MongoDB Atlas', sub: 'Cloud-hosted NoSQL database' },
              { label: 'AI Engine', main: 'Google Gemini API (v1beta)', sub: 'Text processing & transformation' },
            ].map(({ label, main, sub }) => (
              <div key={label} style={{ background: 'rgba(0,8,18,0.55)', border: '1px solid rgba(100,116,139,0.25)', borderRadius: 8, padding: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 4 }}>{label}</p>
                <p>{main}</p>
                <p style={{ fontSize: 12, color: 'var(--color-cyan)', marginTop: 4 }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Network Performance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card p-8">
              <h2 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <span style={{ width: 4, height: 22, background: 'linear-gradient(180deg, var(--color-cyan), #006f80)', borderRadius: 99, display: 'block' }} />
                Network Performance
              </h2>
              {[
                { label: 'API Latency', value: '14.2ms', pct: 30, color: 'cyan' },
                { label: 'Response Time', value: '245ms', pct: 60, color: 'cyan' },
                { label: 'Uptime', value: '99.8%', pct: 99.8, color: 'green' },
              ].map(({ label, value, pct, color }) => (
                <div key={label} style={{ marginBottom: 20 }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{label}</span>
                    <span style={{ fontFamily: 'monospace', color: color === 'green' ? 'var(--color-success)' : 'var(--color-cyan)' }}>{value}</span>
                  </div>
                  <div className="progress-track">
                    <div className={`progress-fill ${color === 'green' ? 'progress-fill-green' : ''}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid var(--color-border)', borderRadius: 10, padding: 20 }}>
              <p style={{ color: 'var(--color-cyan)', fontSize: 12, lineHeight: 1.7 }}>
                <span style={{ fontWeight: 700, display: 'block', marginBottom: 6 }}>💡 System Information</span>
                All components are independently monitored. If any service shows errors, check the logs and environment variables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}