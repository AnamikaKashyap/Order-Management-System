import React from 'react'
import Card from '../common/Card'
import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'

export default function OrderCard({ order, onDelete, onMarkComplete, onEdit, onView }) {
  if (!order) return null

  const customerName = order.customer?.name || order.customer || '—'

  return (
    <Card className="order-card group hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <Link to={`/orders/${order.id}`} className="text-lg font-semibold hover:underline break-words">
              {order.title || `Order #${order.id}`}
            </Link>
            <div className="text-sm text-slate-300 ml-2 shrink-0">{order.date}</div>
          </div>

          <div className="text-sm text-slate-400 mt-1">{customerName}</div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className={`w-2 h-2 rounded-full ${order.priority === 'high' ? 'bg-red-500' : order.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-500'}`} />
              <span className={order.priority === 'high' ? 'font-semibold text-white' : 'text-slate-300'}>{order.priority}</span>
            </div>
          </div>

          <div className="mt-3 opacity-0 group-hover:opacity-100 transition flex justify-end gap-2">
            <div className="relative">
              <button onClick={() => onView ? onView(order) : null} className="peer px-2 py-1 rounded bg-slate-700 text-sm">👁️</button>
              <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded opacity-0 peer-hover:opacity-100 transition">View</div>
            </div>

            <div className="relative">
              <button onClick={() => onEdit ? onEdit(order) : null} className="peer px-2 py-1 rounded bg-slate-700 text-sm">✏️</button>
              <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded opacity-0 peer-hover:opacity-100 transition">Edit</div>
            </div>

            <div className="relative">
              <button onClick={() => typeof onDelete === 'function' && onDelete()} className="peer px-2 py-1 rounded bg-rose-600 text-sm">🗑️</button>
              <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded opacity-0 peer-hover:opacity-100 transition">Delete</div>
            </div>

            {order.status !== 'completed' && (
                <div className="relative">
                <button onClick={() => typeof onMarkComplete === 'function' && onMarkComplete()} className="peer px-2 py-1 rounded bg-emerald-600 text-sm">✅</button>
                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded opacity-0 peer-hover:opacity-100 transition">Mark Completed</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
