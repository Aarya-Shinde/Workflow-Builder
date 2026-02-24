import { useState, useEffect } from 'react'
import axios from 'axios'

const STEP_LABELS = {
  clean: 'Clean Text',
  summarize: 'Summarize',
  keypoints: 'Extract Key Points',
  tag: 'Tag Category'
}

export default function History() {
  const [runs, setRuns] = useState([])
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    axios.get('/api/runs').then(res => setRuns(res.data))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Run History</h1>
      {runs.length === 0 && <p className="text-gray-400">No runs yet.</p>}
      <div className="space-y-4">
        {runs.map((run, i) => (
          <div key={run._id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-800">{run.workflowName}</p>
                <p className="text-sm text-gray-400">{new Date(run.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="text-blue-600 text-sm hover:underline"
              >
                {expanded === i ? 'Hide' : 'View Details'}
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Steps:</span> {run.steps.map(s => STEP_LABELS[s]).join(' → ')}
            </p>

            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
              <span className="font-medium">Input:</span> {run.input.slice(0, 100)}{run.input.length > 100 ? '...' : ''}
            </div>

            {expanded === i && (
              <div className="mt-4 space-y-3">
                {run.steps.map((step, j) => (
                  <div key={j} className="border-l-4 border-blue-400 pl-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Step {j + 1}: {STEP_LABELS[step]}
                    </p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{run.outputs[j]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}