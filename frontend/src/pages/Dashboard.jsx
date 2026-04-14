import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, BarChart3, Activity, Zap, TrendingUp, ChevronRight } from 'lucide-react'
import API_BASE from '../api'

export default function Dashboard() {
  const [health, setHealth] = useState(null)
  const [stats, setStats] = useState({ runs: 0, workflows: 0 })
  const [recentWorkflows, setRecentWorkflows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchDashboardData() }, [])

  async function fetchDashboardData() {
    setLoading(true)
    try {
      const [healthRes, workflowsRes, runsRes] = await Promise.all([
        axios.get(`${API_BASE}/health`),
        axios.get(`${API_BASE}/api/workflows`),
        axios.get(`${API_BASE}/api/runs`),
      ])
      setHealth(healthRes.data)
      setStats({ workflows: workflowsRes.data.length, runs: runsRes.data.length })
      setRecentWorkflows(workflowsRes.data.slice(0, 3))
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    }
    setLoading(false)
  }

  const statusColor = (s) => s === 'ok' ? 'var(--color-cyan)' : 'var(--color-error)'
  const statusDotClass = (s) => s === 'ok' ? 'status-dot status-dot-ok' : 'status-dot status-dot-error'

  return (
    <div className="page">
      <div className="page-bg-dots" />
      <div className="page-glow-tl" />
      <div className="page-glow-br" />

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

        {/* Hero */}
        <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px' }}>
          <div>
            <p className="page-label">System Authorized</p>
            <h1 className="page-title">Welcome to the <span>Core</span></h1>
            <p className="page-subtitle">Abyssal AI Text Processing Engine — Harness the power of Gemini</p>
          </div>

          <div className="card flex gap-4 p-6" style={{ alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--color-cyan-dim)', border: '1px solid rgba(0,229,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={22} color="var(--color-cyan)" />
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 4 }}>Network Load</p>
              <p style={{ fontSize: 26, fontWeight: 700 }}>14.2%</p>
              <p style={{ fontSize: 12, color: 'var(--color-cyan)' }}>Optimal</p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid-4">
          {/* Health Monitor — spans 2 */}
          <div className="card col-span-2 p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-cyan)' }}>Health Monitor</p>
                <p style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginTop: 4 }}>System Status</p>
              </div>
              <Activity size={18} color="rgba(0,229,255,0.4)" />
            </div>

            {!loading && health ? (
              <div className="space-y-4">
                {[
                  { label: 'Backend', key: 'backend' },
                  { label: 'Database', key: 'mongodb' },
                  { label: 'Gemini AI', key: 'llm' },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center gap-3" style={{ paddingBottom: 14, borderBottom: '1px solid rgba(0,229,255,0.08)' }}>
                    <span className={statusDotClass(health[key])} />
                    <span style={{ fontWeight: 500 }}>{label}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: statusColor(health[key]) }}>
                      {health[key].toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-secondary)' }}>Loading system status…</p>
            )}
          </div>

          {/* Total Runs */}
          <div className="card p-8" style={{ overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 160, height: 160, borderRadius: '50%', background: 'rgba(0,229,255,0.04)' }} />
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Global Activity</p>
            <p style={{ fontSize: 40, fontWeight: 700, marginTop: 24 }}>{stats.runs}</p>
            <p style={{ fontSize: 12, color: 'var(--color-cyan)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingUp size={12} /> Total AI Runs
            </p>
          </div>

          {/* Active Workflows */}
          <div className="card p-8" style={{ overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: -60, left: -60, width: 160, height: 160, borderRadius: '50%', background: 'rgba(0,229,255,0.04)' }} />
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Resource Pool</p>
            <p style={{ fontSize: 40, fontWeight: 700, marginTop: 24 }}>{stats.workflows}</p>
            <p style={{ fontSize: 12, color: 'var(--color-cyan)', marginTop: 8 }}>Active Workflows</p>
          </div>
        </div>

        {/* Create New CTA */}
        <a href="/builder" style={{
          display: 'block',
          background: 'linear-gradient(135deg, var(--color-cyan), #007a8e)',
          borderRadius: 14,
          padding: 2,
          boxShadow: '0 0 24px rgba(0,229,255,0.2)',
          textDecoration: 'none',
        }}>
          <div style={{
            background: 'rgba(0,10,18,0.9)',
            borderRadius: 12,
            padding: '28px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            transition: 'background 0.2s',
          }}>
            <Plus size={28} color="var(--color-cyan)" />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Create New Workflow</span>
          </div>
        </a>

        {/* Recent Workflows */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 style={{ fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 4, height: 28, background: 'linear-gradient(180deg, var(--color-cyan), #006f80)', borderRadius: 99, display: 'block' }} />
              Recent Workflows
            </h2>
            <a href="/history" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', gap: 4 }}>
              View All <ChevronRight size={12} />
            </a>
          </div>

          {recentWorkflows.length > 0 ? (
            <div className="grid-3">
              {recentWorkflows.map(wf => (
                <div key={wf._id} className="card p-6" style={{ cursor: 'pointer' }}>
                  <div className="flex justify-between mb-4">
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-cyan-dim)', border: '1px solid rgba(0,229,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BarChart3 size={18} color="var(--color-cyan)" />
                    </div>
                    <span className="badge badge-cyan">Active</span>
                  </div>
                  <h3 style={{ fontWeight: 700, marginBottom: 6 }}>{wf.name}</h3>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 12 }}>{wf.steps.length} steps</p>
                  <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                    <span className="badge badge-cyan">{wf.steps[0]}</span>
                    {wf.steps.length > 1 && <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>+{wf.steps.length - 1}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8" style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                No workflows yet. <a href="/builder" style={{ color: 'var(--color-cyan)' }}>Create one</a> to get started.
              </p>
            </div>
          )}
        </div>

        {/* Neural Link Integrity */}
        <div className="card" style={{ overflow: 'hidden', height: 220, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,50,60,0.4), rgba(0,20,30,0.6)' }} />
          <div style={{ position: 'absolute', inset: 0, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Neural Link Integrity</h3>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '88%' }} />
            </div>
            <div className="flex justify-between mt-3" style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Optimization Matrix</span>
              <span style={{ color: 'var(--color-cyan)' }}>88% Synced</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}