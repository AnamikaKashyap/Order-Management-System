import React from 'react'
import { Check, LoaderCircle, Package, PackageCheck, Truck } from 'lucide-react'

const STEPS = [
  { key: 'placed', label: 'Order Placed', icon: Package },
  { key: 'processing', label: 'Processing', icon: LoaderCircle },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: PackageCheck }
]

export default function StepIndicator({ status }) {
  const map = {
    pending: 0,
    'in-progress': 1,
    completed: 3,
    cancelled: 3
  }

  const currentIndex = map[status] ?? 0
  const isCancelled = status === 'cancelled'

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        {STEPS.map((step, index) => {
          const completed = index < currentIndex || (status === 'completed' && index === currentIndex)
          const current = index === currentIndex && !completed
          const Icon = step.icon

          return (
            <div
              key={step.key}
              className={`rounded-3xl p-4 shadow-sm ring-1 transition-colors ${
                completed
                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/70 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/15'
                  : current
                    ? 'bg-indigo-50 text-indigo-700 ring-indigo-200/70 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/15'
                    : 'bg-slate-50 text-slate-500 ring-slate-200/65 dark:bg-slate-900/60 dark:text-slate-500 dark:ring-white/8'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    completed
                      ? 'bg-emerald-500 text-white'
                      : current
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-400 dark:bg-white/5 dark:text-slate-500'
                  }`}
                >
                  {completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className={`h-5 w-5 ${current && step.key === 'processing' ? 'animate-spin' : ''}`} />
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.22em]">
                  0{index + 1}
                </span>
              </div>
              <p className="mt-4 text-base font-bold">{step.label}</p>
            </div>
          )
        })}
      </div>

      {isCancelled && (
        <div className="rounded-3xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 ring-1 ring-rose-200/70 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/15">
          This order has been cancelled. Review the timeline below for the most recent update.
        </div>
      )}
    </div>
  )
}
