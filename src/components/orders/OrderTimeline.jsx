import React from 'react'

export default function OrderTimeline({ events = [] }) {
  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const hasDate = Boolean(event.date)

        return (
          <div key={`${event.status}-${index}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`mt-1 h-3.5 w-3.5 rounded-full ring-4 ${
                  hasDate
                    ? 'bg-indigo-500 ring-indigo-100 dark:bg-indigo-400 dark:ring-indigo-500/15'
                    : 'bg-slate-300 ring-slate-100 dark:bg-slate-600 dark:ring-slate-800'
                }`}
              />
              {index !== events.length - 1 && (
                <div className="mt-2 h-full min-h-14 w-px bg-gradient-to-b from-slate-300 to-slate-100 dark:from-slate-700 dark:to-slate-900" />
              )}
            </div>

            <div className="flex-1 rounded-3xl bg-slate-50/80 p-4 shadow-sm ring-1 ring-slate-200/55 dark:bg-slate-900/60 dark:ring-white/8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-bold text-slate-900 dark:text-white">{event.status}</div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-400 dark:ring-white/10">
                  {event.date || 'Pending'}
                </span>
              </div>

              {event.detail && (
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600 dark:text-slate-400">
                  {event.detail}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
