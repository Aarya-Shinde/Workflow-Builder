import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Wrench, CheckSquare, Activity, Menu, X } from 'lucide-react'
import { useState } from 'react'

import Dashboard from './pages/Dashboard'
import Builder from './pages/Builder'
import Run from './pages/Run'
import Health from './pages/Health'

import './App.css'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/builder', label: 'Builder', icon: Wrench },
    { path: '/run', label: 'Run', icon: CheckSquare },
    { path: '/health', label: 'Health', icon: Activity },
  ]

  return (
    <div className="app-root">
      {/* Top Navigation Bar */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon">A</div>
            <h1 className="brand-name">Workflow Builder</h1>
          </div>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link ${isActive(path) ? 'nav-link-active' : ''}`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="mobile-nav">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`nav-link ${isActive(path) ? 'nav-link-active' : ''}`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/run" element={<Run />} />
          <Route path="/health" element={<Health />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <p className="footer-brand">Abyssal Builder</p>
              <p className="footer-sub">AI-powered text processing pipeline</p>
            </div>
            <div>
              <p className="footer-heading">Product</p>
              <div className="footer-links">
                <Link to="/">Dashboard</Link>
                <Link to="/builder">Builder</Link>
                <Link to="/run">Execute</Link>
              </div>
            </div>
            <div>
              <p className="footer-heading">Resources</p>
              <div className="footer-links">
                <a href="#">Documentation</a>
                <a href="#">GitHub</a>
                <a href="#">Support</a>
              </div>
            </div>
            <div>
              <p className="footer-heading">Status</p>
              <Link to="/health" className="footer-link">System Health</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Abyssal Builder. Built with React, Node.js, and Google Gemini AI.</p>
            <p>Status: <span className="status-ok">All Systems Operational</span></p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}