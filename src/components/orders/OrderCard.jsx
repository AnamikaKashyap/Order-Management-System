import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Eye, Pencil, Trash2 } from 'lucide-react'
import Card from '../common/Card'
import StatusBadge from '../common/StatusBadge'

const priorityStyles = {
  high: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300',
  medium: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300',
  low: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
}

export default function OrderCard({ order, onDelete, onMarkComplete, onEdit, onView }) {
  const navigate = useNavigate()
  if (!order) return null

  const customerName = order.customer?.name || order.customer || '-'
  const priorityKey = order.priority || 'low'
  const priorityLabel = priorityKey.charAt(0).toUpperCase() + priorityKey.slice(1)
  const actionButtonClass =
    'inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-900 hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-100 dark:hover:text-slate-900'

  const handleCardClick = () => {
    navigate(`/orders/${order.id}`)
  }

  const stopClick = (event, action) => {
    event.stopPropagation()
    if (typeof action === 'function') action()
  }

  return (
    <Card
      className="group relative cursor-pointer rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-300 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/90 dark:hover:border-slate-700"
      onClick={handleCardClick}
    >
      <div className="absolute right-4 top-3">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[priorityKey] || priorityStyles.low}`}
        >
          {priorityLabel}
        </span>
      </div>

      <div className="space-y-2 pr-15">
        <Link
          to={`/orders/${order.id}`}
          onClick={(event) => event.stopPropagation()}
          className="block truncate pr-1 text-lg font-semibold leading-snug text-slate-900 transition hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400"
          title={order.title || `Order #${order.id}`}
        >
          {order.title || `Order #${order.id}`}
        </Link>

        <div className="break-all text-sm font-medium text-slate-500 dark:text-slate-400">
          {order.id}
        </div>

        <div className="break-words text-sm text-slate-600 dark:text-slate-300">
          {customerName}
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-400">
          {order.date || '-'}
        </div>

        <div className="overflow-hidden pt-1">
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="mt-0 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 opacity-100 transition sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 dark:border-slate-800">
        <button
          onClick={(event) => stopClick(event, () => (onView ? onView(order) : handleCardClick()))}
          className={actionButtonClass}
          aria-label="View order"
          title="View"
        >
          <Eye className="h-4 w-4" />
        </button>

        <button
          onClick={(event) => stopClick(event, () => (onEdit ? onEdit(order) : null))}
          className={actionButtonClass}
          aria-label="Edit order"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          onClick={(event) => stopClick(event, () => typeof onDelete === 'function' && onDelete())}
          className={`${actionButtonClass} hover:bg-rose-600 dark:hover:bg-rose-500`}
          aria-label="Delete order"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        {order.status !== 'completed' && (
          <button
            onClick={(event) => stopClick(event, () => typeof onMarkComplete === 'function' && onMarkComplete())}
            className={`${actionButtonClass} hover:bg-emerald-600 dark:hover:bg-emerald-500`}
            aria-label="Mark order completed"
            title="Mark completed"
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </Card>
  )
}
