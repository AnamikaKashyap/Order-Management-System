import React from 'react'
import {
  ArrowRight,
  BellRing,
  Check,
  CheckCheck,
  CircleAlert,
  CircleX,
  Info,
  Package2,
  X
} from 'lucide-react'
import { notifications as sample } from '../../data/notifications'
import { orders as sampleOrders } from '../../data/orders'
import { readNotifications, writeNotifications } from '../../utils/notifications'

function fmtDate(iso) {
  const d = new Date(iso)
  return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}

function groupByRange(items) {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfToday.getDate() - 1)
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfToday.getDate() - 7)

  const groups = { Today: [], Yesterday: [], 'This Week': [], Older: [] }

  items.forEach((it) => {
    const d = new Date(it.createdAt)
    if (d >= startOfToday) groups.Today.push(it)
    else if (d >= startOfYesterday) groups.Yesterday.push(it)
    else if (d >= startOfWeek) groups['This Week'].push(it)
    else groups.Older.push(it)
  })

  return groups
}

function statusLabel(value) {
  if (!value) return ''

  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function loadOrders() {
  try {
    const raw = localStorage.getItem('orders')
    return raw ? JSON.parse(raw) : sampleOrders
  } catch {
    return sampleOrders
  }
}

function Icon({ type }) {
  const baseClass = 'flex h-10 w-10 items-center justify-center rounded-2xl border shadow-sm'

  if (type === 'success') {
    return <span className={`${baseClass} border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300`}><Check className="h-4 w-4" /></span>
  }

  if (type === 'error') {
    return <span className={`${baseClass} border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300`}><CircleX className="h-4 w-4" /></span>
  }

  if (type === 'warning') {
    return <span className={`${baseClass} border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300`}><CircleAlert className="h-4 w-4" /></span>
  }

  return <span className={`${baseClass} border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300`}><Info className="h-4 w-4" /></span>
}

export default function ActivityPanel({ open, onClose, onNavigate }) {
  const [items, setItems] = React.useState(() => {
    const stored = readNotifications()
    return stored.length ? stored : sample
  })

  const loadItems = React.useCallback(() => {
    const stored = readNotifications()
    setItems(stored.length ? stored : sample)
  }, [])

  React.useEffect(() => {
    loadItems()
    window.addEventListener('storage', loadItems)
    return () => window.removeEventListener('storage', loadItems)
  }, [loadItems, open])

  const saveAndSet = (newItems) => {
    setItems(newItems)
    writeNotifications(newItems)
  }

  const orderLookup = React.useMemo(() => {
    return loadOrders().reduce((acc, order) => {
      acc[String(order.id)] = order
      return acc
    }, {})
  }, [])

  const unreadCount = items.filter((item) => !item.read).length
  const groups = groupByRange(items.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))

  const markRead = (id) => saveAndSet(items.map((item) => (item.id === id ? { ...item, read: true } : item)))
  const markAllRead = () => saveAndSet(items.map((item) => ({ ...item, read: true })))

  const panelRef = React.useRef(null)

  React.useEffect(() => {
    if (!open) return

    const onKey = (e) => {
      if (e.key === 'Escape') onClose && onClose()
    }

    const onClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose && onClose()
    }

    document.addEventListener('keydown', onKey)
    const t = setTimeout(() => document.addEventListener('click', onClickOutside), 0)
    const focusT = setTimeout(() => {
      const el = panelRef.current && panelRef.current.querySelector('[data-notif]')
      el && el.focus()
    }, 50)

    return () => {
      clearTimeout(t)
      clearTimeout(focusT)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClickOutside)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={panelRef}
      className="fixed inset-x-3 top-20 z-50 rounded-3xl border border-slate-200/80 bg-white/95 p-3 shadow-2xl backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/95 sm:absolute sm:right-0 sm:left-auto sm:top-full sm:mt-3 sm:w-[28rem]"
      role="dialog"
      aria-label="Activity panel"
    >
      <div className="mb-3 rounded-2xl border border-slate-200/70 bg-gradient-to-r from-slate-50 via-white to-blue-50 p-4 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900">
                <BellRing className="h-5 w-5" />
              </span>
              <div>
                <div className="text-base font-semibold text-slate-900 dark:text-slate-100">Activity</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {unreadCount > 0 ? `${unreadCount} unread updates` : 'Everything is up to date'}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close activity panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        </div>
      </div>

      <div className="max-h-[min(70vh,34rem)] space-y-4 overflow-y-auto pr-1">
        {Object.entries(groups).map(([label, list]) => (
          list.length === 0 ? null : (
            <div key={label}>
              <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{label}</div>
              <div className="space-y-3">
                {list.map((n) => {
                  const order = n.orderId ? orderLookup[String(n.orderId)] : null
                  const title = order?.title || n.title || 'Order update'
                  const customerName = order?.customer?.name
                  const fromStatus = statusLabel(n.meta?.from)
                  const toStatus = statusLabel(n.meta?.to)
                  const hasStatusChange = Boolean(fromStatus && toStatus)
                  const summary = hasStatusChange ? 'Status updated' : n.title || 'Order update'
                  const detail = customerName ? `${title} • ${customerName}` : title

                  return (
                    <div
                      key={n.id}
                      tabIndex={0}
                      data-notif
                      onClick={() => {
                        if (n.orderId && onNavigate) onNavigate(n.orderId)
                      }}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && n.orderId && onNavigate) {
                          e.preventDefault()
                          onNavigate(n.orderId)
                        }
                      }}
                      className={`group rounded-3xl border p-4 transition ${
                        n.read
                          ? 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700 dark:hover:bg-slate-900'
                          : 'border-blue-200 bg-gradient-to-r from-blue-50 via-white to-slate-50 shadow-sm hover:border-blue-300 dark:border-blue-500/30 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40'
                      } ${n.orderId ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0"><Icon type={n.type} /></div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {summary}
                                </div>
                                {!n.read && <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.7)]" />}
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <Package2 className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{detail}</span>
                              </div>
                            </div>

                            <div className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                              {fmtDate(n.createdAt)}
                            </div>
                          </div>

                          {hasStatusChange ? (
                            <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
                              <span className="truncate">{fromStatus}</span>
                              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                              <span className="truncate">{toStatus}</span>
                            </div>
                          ) : (
                            <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{n.message}</div>
                          )}

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {!n.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markRead(n.id)
                                }}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                              >
                                <Check className="h-3.5 w-3.5" />
                                Mark as read
                              </button>
                            )}

                            {n.orderId && (
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                Tap to open order
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        ))}

        {items.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center dark:border-slate-700 dark:bg-slate-900/70">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-300">
              <BellRing className="h-5 w-5" />
            </div>
            <div className="mt-4 text-sm font-medium text-slate-900 dark:text-slate-100">No activity yet</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">New order updates and status changes will appear here.</div>
          </div>
        )}
      </div>
    </div>
  )
}
