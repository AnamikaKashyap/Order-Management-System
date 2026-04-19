import React from 'react'
import { AlertCircle, CheckCircle2, Clock3, LoaderCircle } from 'lucide-react'

const mapStyle = {
  pending:
    'bg-amber-50 text-amber-700 ring-1 ring-amber-200/75 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20',
  'in-progress':
    'bg-blue-50 text-blue-700 ring-1 ring-blue-200/75 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20',
  completed:
    'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/75 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
  cancelled:
    'bg-rose-50 text-rose-700 ring-1 ring-rose-200/75 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20'
}

const mapIcon = {
  pending: Clock3,
  'in-progress': LoaderCircle,
  completed: CheckCircle2,
  cancelled: AlertCircle
}

export default function StatusBadge({ status }) {
  const value = status || 'pending'
  const style = mapStyle[value] || 'bg-slate-50 text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10'
  const Icon = mapIcon[value] || Clock3

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${style}`}
    >
      <Icon className={`h-3.5 w-3.5 ${value === 'in-progress' ? 'animate-spin' : ''}`} />
      <span className="capitalize">{value.replace('-', ' ')}</span>
    </span>
  )
}
