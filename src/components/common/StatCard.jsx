import React from 'react'

export default function StatCard({ title, value, delta, children }) {
  return (
    <div className="bg-slate border border-slate-400 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-700 dark:text-slate-400">{title}</div>
          <div className="text-2xl font-semibold mt-1">{value}</div>
        </div>
        {delta && (
          <div className="text-sm text-green-400 bg-white-900 border-1 border-green-400 rounded-full px-2 py-1 rounded">{delta}</div>
        )}
      </div>
      {children && <div className="mt-3 text-sm text-slate-400">{children}</div>}
    </div>
  )
}
