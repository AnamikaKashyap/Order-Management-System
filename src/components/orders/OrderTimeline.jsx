import React from 'react'

export default function OrderTimeline({ events = [] }) {
  return (
    <div className="space-y-4">
      {events.map((e, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className={`h-3 w-3 rounded-full ${e.date ? 'bg-green-400' : 'bg-slate-600'}`} />
            {i !== events.length - 1 && <div className="h-full w-px bg-slate-700 mt-1" style={{height: '36px'}} />}
          </div>

          <div>
            <div className="text-sm font-medium">{e.status}</div>
            <div className="text-xs text-slate-400">{e.date || 'Pending'}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
