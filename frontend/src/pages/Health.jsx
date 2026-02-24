import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Health() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchHealth() {
    setLoading(true)
    try {
      const res = await axios.get('/health')
      setHealth(res.data)
    } catch {
      setHealth({ backend: 'error', mongodb: 'error', llm: 'error' })
    }
    setLoading(false)
  }

  useEffect(() => { fetchHealth() }, [])

  const indicators = [
    { key: 'backend', label: 'Backend Server' },
    { key: 'mongodb', label: 'MongoDB' },
    { key: 'llm', label: 'Gemini LLM' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Health Dashboard</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {loading ? (
          <p className="text-gray-400">Checking status...</p>
        ) : (
          <div className="space-y-4">
            {indicators.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{label}</span>
                <span className={`flex items-center gap-2 font-semibold ${health[key] === 'ok' ? 'text-green-600' : 'text-red-500'}`}>
                  <span className={`w-3 h-3 rounded-full ${health[key] === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {health[key] === 'ok' ? 'Operational' : 'Error'}
                </span>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={fetchHealth}
          className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          Refresh Status
        </button>
      </div>
    </div>
  )
}