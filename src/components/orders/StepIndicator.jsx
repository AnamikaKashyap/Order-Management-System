import React from 'react'

const STEPS = ['Order Placed','Processing','Shipped','Delivered']

export default function StepIndicator({ status }){
  // map status to step index
  const map = {
    'pending': 0,
    'in-progress': 1,
    'completed': 3,
    'cancelled': 3
  }
  const idx = map[status] ?? 0

  return (
    <div className="space-y-2">
      {STEPS.map((s,i)=>{
        const completed = i < idx
        const current = i === idx
        return (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full flex items-center justify-center ${completed ? 'bg-green-400' : current ? 'bg-blue-400' : 'bg-slate-700'}`}>
              {completed ? '✔' : current ? '➡' : ''}
            </div>
            <div className={`${completed ? 'text-green-300' : current ? 'text-white font-semibold' : 'text-slate-400'}`}>{s}</div>
          </div>
        )
      })}
    </div>
  )
}
