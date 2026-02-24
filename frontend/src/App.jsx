import { Routes, Route, Link } from 'react-router-dom'
import Builder from './pages/Builder'
import Run from './pages/Run'
import History from './pages/History'
import Health from './pages/Health'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex gap-6">
          <span className="font-bold text-blue-600 text-lg">WorkflowAI</span>
          <Link to="/" className="text-gray-600 hover:text-blue-600">Builder</Link>
          <Link to="/run" className="text-gray-600 hover:text-blue-600">Run</Link>
          <Link to="/history" className="text-gray-600 hover:text-blue-600">History</Link>
          <Link to="/health" className="text-gray-600 hover:text-blue-600">Health</Link>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Builder />} />
          <Route path="/run" element={<Run />} />
          <Route path="/history" element={<History />} />
          <Route path="/health" element={<Health />} />
        </Routes>
      </main>
    </div>
  )
}