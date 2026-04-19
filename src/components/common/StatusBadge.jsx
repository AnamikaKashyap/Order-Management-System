import React from 'react'

const mapStyle = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-rose-100 text-rose-800'
}

const mapIcon = {
  pending: '⏳',
  'in-progress': '🔵',
  completed: '✅',
  cancelled: '⛔'
}

export default function StatusBadge({ status }) {
  const s = status || 'pending'
  const cls = mapStyle[s] || 'bg-slate-100 text-slate-800'

  return (
    <span className={`inline-flex flex-nowrap items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${cls}`}>
      <span>{mapIcon[s] || '•'}</span>
      <span className="whitespace-nowrap capitalize">{s.replace('-', ' ')}</span>
    </span>
  )
}
