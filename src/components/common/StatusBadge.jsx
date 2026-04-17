import React from 'react'

const mapStyle = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-rose-100 text-rose-800'
}

export default function StatusBadge({ status }){
  const s = status || 'pending'
  const cls = mapStyle[s] || 'bg-slate-100 text-slate-800'
  return (
    <span className={`px-3 py-1 text-xs rounded-full ${cls} font-medium flex items-center gap-2` }>
      {s === 'pending' && <span className="animate-pulse">⏳</span>}
      {s === 'in-progress' && <span>🔵</span>}
      {s === 'completed' && <span>✅</span>}
      {s === 'cancelled' && <span>⛔</span>}
      <span className="capitalize">{s.replace('-', ' ')}</span>
    </span>
  )
}
