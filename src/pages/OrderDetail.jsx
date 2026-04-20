import React from 'react'
import { useParams } from 'react-router-dom'
import {
  ArrowRight,
  ClipboardList,
  Mail,
  NotebookPen,
  PackageCheck,
  Phone,
  Printer,
  Sparkles,
  UserCircle2
} from 'lucide-react'
import OrderTimeline from '../components/orders/OrderTimeline'
import StepIndicator from '../components/orders/StepIndicator'
import { orders as sampleOrders } from '../data/orders'
import StatusBadge from '../components/common/StatusBadge'
import Modal from '../components/common/Modal'
import EditOrderForm from '../components/orders/EditOrderForm'
import Skeleton from '../components/common/Skeleton'
import { addNotification } from '../utils/notifications'

const priorityMeta = {
  high: {
    dot: 'bg-rose-500',
    badge:
      'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300',
    label: 'High priority'
  },
  medium: {
    dot: 'bg-amber-500',
    badge:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300',
    label: 'Medium priority'
  },
  low: {
    dot: 'bg-emerald-500',
    badge:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300',
    label: 'Low priority'
  }
}

const statusOptions = ['pending', 'in-progress', 'completed', 'cancelled']

const shellCardClass =
  'rounded-[28px] bg-white/92 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.24)] ring-1 ring-slate-200/55 backdrop-blur-sm dark:bg-[#121214]/92 dark:shadow-[0_20px_45px_-30px_rgba(0,0,0,0.6)] dark:ring-white/8'

const formatDate = (value) => {
  if (!value) return 'Not available'

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatStatusLabel = (value) =>
  String(value || 'pending')
    .replace('-', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

export default function OrderDetail() {
  const { id } = useParams()

  const allOrders = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('orders')
      return raw ? JSON.parse(raw) : sampleOrders
    } catch (e) {
      return sampleOrders
    }
  }, [])

  const original = React.useMemo(() => {
    return allOrders.find((o) => String(o.id) === String(id))
  }, [allOrders, id])

  const [order, setOrder] = React.useState(original)
  const [statusOpen, setStatusOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [newStatus, setNewStatus] = React.useState(original?.status || 'pending')
  const [loading, setLoading] = React.useState(true)
  const [noteText, setNoteText] = React.useState('')

  React.useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [id])

  React.useEffect(() => {
    if (!original) return

    setOrder(original)
    setNewStatus(original.status || 'pending')
  }, [original])

  const persistOrder = (updatedOrder) => {
    try {
      const raw = localStorage.getItem('orders')
      const items = raw ? JSON.parse(raw) : sampleOrders
      const newItems = items.map((entry) => (entry.id === updatedOrder.id ? updatedOrder : entry))
      localStorage.setItem('orders', JSON.stringify(newItems))
    } catch (e) { }
  }

  const applyStatus = () => {
    if (!order) return

    if (order.status !== newStatus) {
      addNotification({
        type: 'status',
        title: 'Order status changed',
        message: `${order.id}: ${order.status} -> ${newStatus}`,
        orderId: order.id,
        meta: { from: order.status, to: newStatus }
      })
    }

    const today = new Date().toISOString().slice(0, 10)
    const updated = {
      ...order,
      status: newStatus,
      timeline: [{ status: formatStatusLabel(newStatus), date: today }, ...(order.timeline || [])]
    }

    setOrder(updated)
    setStatusOpen(false)
    persistOrder(updated)
  }

  const applyEdit = (data) => {
    setOrder(data)
    setEditOpen(false)
    persistOrder(data)
  }

  const addNote = () => {
    if (!order || !noteText.trim()) return

    const noteValue = noteText.trim()
    const now = new Date().toLocaleString()
    const evt = { status: `Note added`, date: now, detail: noteValue }
    const updated = {
      ...order,
      timeline: [evt, ...(order.timeline || [])],
      notes: order.notes ? `${order.notes}\n${noteValue}` : noteValue
    }

    setOrder(updated)
    setNoteText('')
    persistOrder(updated)
  }

  const assignees = Array.from(new Set(sampleOrders.map((entry) => entry.assignedTo))).filter(Boolean)

  const changeAssignee = (name) => {
    if (!order) return

    const updated = { ...order, assignedTo: name }
    setOrder(updated)
    persistOrder(updated)
  }

  if (!order && !loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 transition-colors duration-300 dark:bg-[#09090b] dark:text-slate-100 lg:px-6">
        <div className="mx-auto max-w-3xl">
          <div className={`${shellCardClass} p-8 text-center`}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
              <PackageCheck className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Order not found
            </h1>
            <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">
              We could not find any order matching <span className="font-semibold text-slate-900 dark:text-white">{id}</span>.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const currentPriority = priorityMeta[order?.priority] || priorityMeta.low
  const orderValue = order?.total || 'Awaiting invoice'
  const customerInitial = order?.customer?.name?.[0] || 'U'

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 transition-colors duration-300 dark:bg-[#09090b] dark:text-slate-100 lg:px-6">
      <div className="mx-auto max-w-[96rem] space-y-6">
        <section className={`${shellCardClass} relative overflow-hidden p-6 lg:p-8`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.16),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.24),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_32%)]" />
          <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_360px]">
            <div className="space-y-6">
              {loading ? (
                <div className="space-y-5">
                  <Skeleton className="h-5 w-32 rounded-full" />
                  <Skeleton className="h-14 w-3/4 rounded-2xl" />
                  <Skeleton className="h-6 w-56 rounded-full" />
                  <div className="grid gap-3 md:grid-cols-3">
                    <Skeleton className="h-24 rounded-2xl" />
                    <Skeleton className="h-24 rounded-2xl" />
                    <Skeleton className="h-24 rounded-2xl" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/20">
                      <Sparkles className="h-3.5 w-3.5" />
                      Order Overview
                    </span>
                    <StatusBadge status={order?.status} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
                          {order?.id}
                        </p>
                        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white lg:text-5xl">
                          {order?.title || `Order ${order?.id}`}
                        </h1>
                      </div>

                      <button
                        onClick={() => setEditOpen(true)}
                        className="group inline-flex cursor-pointer items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-500 active:scale-95 shadow-lg shadow-indigo-600/20
    bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-[length:200%_auto]
    hover:bg-right hover:-translate-y-0.5 hover:shadow-indigo-500/40
    dark:from-indigo-500 dark:via-purple-500 dark:to-sky-400 dark:shadow-indigo-950/50"
                      >
                        Edit Order
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="max-w-2xl text-sm font-medium leading-7 text-slate-600 dark:text-slate-400">
                      Track order status, internal notes, and ownership from one place with a view designed to match the rest of your dashboard.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${currentPriority.badge}`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${currentPriority.dot}`} />
                      {currentPriority.label}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200/60 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
                      Placed on {formatDate(order?.date)}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-3xl bg-white/75 p-4 shadow-sm ring-1 ring-slate-200/55 backdrop-blur-sm dark:bg-white/5 dark:ring-white/8">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-500">
                        Assigned to
                      </p>
                      <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                        {order?.assignedTo || 'Unassigned'}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-white/75 p-4 shadow-sm ring-1 ring-slate-200/55 backdrop-blur-sm dark:bg-white/5 dark:ring-white/8">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-500">
                        Current stage
                      </p>
                      <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                        {formatStatusLabel(order?.status)}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-white/75 p-4 shadow-sm ring-1 ring-slate-200/55 backdrop-blur-sm dark:bg-white/5 dark:ring-white/8">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-500">
                        Order value
                      </p>
                      <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{orderValue}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-[28px] bg-white/86 p-5 shadow-[0_14px_38px_-28px_rgba(15,23,42,0.24)] ring-1 ring-slate-200/50 backdrop-blur-sm dark:bg-white/5 dark:shadow-none dark:ring-white/8">
                {loading ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-14 w-14 rounded-2xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-full rounded-2xl" />
                    <Skeleton className="h-10 w-full rounded-2xl" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-xl font-bold text-white shadow-lg shadow-indigo-600/20">
                        {customerInitial}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
                          Customer
                        </p>
                        <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                          {order?.customer?.name || 'Unknown customer'}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50/90 px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-slate-200/60 dark:bg-slate-900/60 dark:text-slate-300 dark:ring-white/8">
                        <Mail className="h-4 w-4 text-indigo-500" />
                        <span className="truncate">{order?.customer?.email || 'No email provided'}</span>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50/90 px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-slate-200/60 dark:bg-slate-900/60 dark:text-slate-300 dark:ring-white/8">
                        <Phone className="h-4 w-4 text-indigo-500" />
                        <span>{order?.customer?.phone || 'No phone provided'}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-[28px] bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-600 p-5 text-white shadow-xl shadow-indigo-600/20 ring-1 ring-white/15 dark:shadow-indigo-950/40 dark:ring-white/10">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-32 rounded-full bg-white/20" />
                    <Skeleton className="h-10 w-3/4 rounded-2xl bg-white/20" />
                    <Skeleton className="h-10 w-full rounded-2xl bg-white/20" />
                    <Skeleton className="h-10 w-full rounded-2xl bg-white/20" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-indigo-100">
                      <ClipboardList className="h-4 w-4" />
                      Quick Actions
                    </div>
                    <h3 className="mt-3 text-2xl font-black tracking-tight">Keep this order moving</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-indigo-100/90">
                      Update status, print the order, or hand it off to the right team member in one tap.
                    </p>
                    <div className="mt-5 grid gap-3">
                      <button
                        onClick={() => setStatusOpen(true)}
                        className="inline-flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
                      >
                        Change Status
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        className="inline-flex items-center justify-between rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                      >
                        Print Summary
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_360px]">
          <div className="space-y-6">
            <div className={`${shellCardClass} p-6`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
                    Status Progress
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Fulfilment journey
                  </h2>
                </div>
                {!loading && (
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/20">
                    {formatStatusLabel(order?.status)}
                  </span>
                )}
              </div>
              <div className="mt-6">
                {loading ? <Skeleton className="h-40 w-full rounded-3xl" /> : <StepIndicator status={order?.status} />}
              </div>
            </div>

            <div className={`${shellCardClass} p-6`}>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <NotebookPen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
                    Internal Notes
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Team context
                  </h2>
                </div>
              </div>

              {loading ? (
                <div className="mt-6 space-y-4">
                  <Skeleton className="h-20 w-full rounded-3xl" />
                  <Skeleton className="h-28 w-full rounded-3xl" />
                </div>
              ) : (
                <>
                  <div className="mt-6 rounded-3xl bg-slate-50/90 p-5 text-sm font-medium leading-7 text-slate-700 ring-1 ring-slate-200/60 dark:bg-slate-900/60 dark:text-slate-300 dark:ring-white/8">
                    <div className="whitespace-pre-wrap">{order?.notes || 'No notes added yet.'}</div>
                  </div>

                  <div className="mt-5 rounded-3xl bg-white/80 p-4 ring-1 ring-slate-200/55 dark:bg-slate-950/40 dark:ring-white/8">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="min-h-[120px] w-full resize-none rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none ring-1 ring-slate-200/60 transition placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-100 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:ring-white/8 dark:focus:ring-indigo-500/10"
                      placeholder="Add an internal note for your team..."
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={addNote}
                        className="group inline-flex cursor-pointer items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-500 active:scale-95 shadow-lg
    bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-[length:200%_auto]
    hover:bg-right hover:-translate-y-0.5 hover:shadow-indigo-500/20
    dark:from-indigo-600 dark:via-purple-600 dark:to-indigo-600 dark:shadow-indigo-500/10"
                      >
                        Save Note
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className={`${shellCardClass} p-6`}>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                  <PackageCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
                    Timeline
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Activity log
                  </h2>
                </div>
              </div>
              <div className="mt-6">
                {loading ? <Skeleton className="h-64 w-full rounded-3xl" /> : <OrderTimeline events={order?.timeline || []} />}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className={`${shellCardClass} p-6`}>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <UserCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
                    Ownership
                  </p>
                  <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    Team assignment
                  </h3>
                </div>
              </div>

              {loading ? (
                <div className="mt-6 space-y-3">
                  <Skeleton className="h-5 w-28 rounded-full" />
                  <Skeleton className="h-12 w-full rounded-2xl" />
                </div>
              ) : (
                <>
                  <div className="mt-6 rounded-3xl bg-slate-50/90 p-4 ring-1 ring-slate-200/60 dark:bg-slate-900/60 dark:ring-white/8">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-500">
                      Current owner
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                      {order?.assignedTo || 'Unassigned'}
                    </p>
                  </div>
                  <div className="mt-4">
                    <select
                      value={order?.assignedTo || ''}
                      onChange={(e) => changeAssignee(e.target.value)}
                      className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-1 ring-slate-200/60 transition focus:ring-4 focus:ring-indigo-100 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/8 dark:focus:ring-indigo-500/10"
                    >
                      <option value="">Unassigned</option>
                      {assignees.map((assignee) => (
                        <option key={assignee} value={assignee}>
                          {assignee}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className={`${shellCardClass} p-6`}>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
                Snapshot
              </p>
              {loading ? (
                <div className="mt-6 grid gap-3">
                  <Skeleton className="h-20 rounded-3xl" />
                  <Skeleton className="h-20 rounded-3xl" />
                  <Skeleton className="h-20 rounded-3xl" />
                </div>
              ) : (
                <div className="mt-6 grid gap-3">
                  <div className="rounded-3xl bg-slate-50/90 p-4 ring-1 ring-slate-200/60 dark:bg-slate-900/60 dark:ring-white/8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500">
                      Order ID
                    </p>
                    <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">{order?.id}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50/90 p-4 ring-1 ring-slate-200/60 dark:bg-slate-900/60 dark:ring-white/8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500">
                      Created
                    </p>
                    <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">{formatDate(order?.date)}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50/90 p-4 ring-1 ring-slate-200/60 dark:bg-slate-900/60 dark:ring-white/8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500">
                      Status
                    </p>
                    <div className="mt-3">
                      <StatusBadge status={order?.status} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </section>
      </div>

      <Modal open={statusOpen} onClose={() => setStatusOpen(false)} title="Change Status">
        <div className="space-y-4">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-1 ring-slate-200/60 transition focus:ring-4 focus:ring-indigo-100 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/8 dark:focus:ring-indigo-500/10"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {formatStatusLabel(status)}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setStatusOpen(false)}
              className="rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-white/8"
            >
              Cancel
            </button>
            <button
              onClick={applyStatus}
              className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-500"
            >
              Apply
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Order">
        {order && <EditOrderForm initial={order} onSubmit={applyEdit} onCancel={() => setEditOpen(false)} />}
      </Modal>
    </main>
  )
}
