import React from 'react'
import { useParams } from 'react-router-dom'
import OrderTimeline from '../components/orders/OrderTimeline'
import StepIndicator from '../components/orders/StepIndicator'
import { orders as sampleOrders } from '../data/orders'
import Badge from '../components/common/Badge'
import Modal from '../components/common/Modal'
import EditOrderForm from '../components/orders/EditOrderForm'
import Skeleton from '../components/common/Skeleton'
import { addNotification } from '../utils/notifications'

export default function OrderDetail(){
  const { id } = useParams()
  // load from localStorage if present so newly created orders are visible
 
  const allOrders = React.useMemo(() => {
  try {
    const raw = localStorage.getItem('orders')
    return raw ? JSON.parse(raw) : sampleOrders
  } catch(e){
    return sampleOrders
  }
}, [])

const original = React.useMemo(() => {
  return allOrders.find(o => String(o.id) === String(id))
}, [allOrders, id])
  const [order, setOrder] = React.useState(original)
  const [statusOpen, setStatusOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [newStatus, setNewStatus] = React.useState(original?.status || 'pending')
  const [loading, setLoading] = React.useState(true)




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


  if (!order && !loading) {
    return (
      <main className="p-6">
        <h2 className="text-2xl font-semibold">Order not found</h2>
        <p className="mt-2 text-sm text-slate-400">No order matches id: {id}</p>
      </main>
    )
  }

  const applyStatus = () => {
    if (order.status !== newStatus) {
      addNotification({
        type: 'status',
        title: 'Order status changed',
        message: `${order.id}: ${order.status} → ${newStatus}`,
        orderId: order.id,
        meta: { from: order.status, to: newStatus }
      })
    }
    const today = new Date().toISOString().slice(0,10)
    const updated = { ...order, status: newStatus, timeline: [{ status: newStatus, date: today }, ...(order.timeline || [])] }
    setOrder(updated)
    setStatusOpen(false)
    
    // Also update it in localStorage so changes persist back to Orders list
    try {
      const raw = localStorage.getItem('orders')
      const items = raw ? JSON.parse(raw) : sampleOrders
      const newItems = items.map(o => o.id === order.id ? updated : o)
      localStorage.setItem('orders', JSON.stringify(newItems))
    } catch(e) {}
  }

  const applyEdit = (data) => {
    setOrder(data)
    setEditOpen(false)
    // Update in localStorage
    try {
      const raw = localStorage.getItem('orders')
      const items = raw ? JSON.parse(raw) : sampleOrders
      const newItems = items.map(o => o.id === data.id ? data : o)
      localStorage.setItem('orders', JSON.stringify(newItems))
    } catch(e) {}
  }

  const [noteText, setNoteText] = React.useState('')
  const addNote = () => {
    if (!noteText.trim()) return
    const now = new Date().toLocaleString()
    const evt = { status: `Note: ${noteText}`, date: now }
    const updated = { ...order, timeline: [evt, ...(order.timeline || [])], notes: (order.notes ? order.notes + '\n' : '') + noteText }
    setOrder(updated)
    setNoteText('')
    // Update in localStorage
    try {
      const raw = localStorage.getItem('orders')
      const items = raw ? JSON.parse(raw) : sampleOrders
      const newItems = items.map(o => o.id === updated.id ? updated : o)
      localStorage.setItem('orders', JSON.stringify(newItems))
    } catch(e) {}
  }

  const assignees = Array.from(new Set(sampleOrders.map(s=>s.assignedTo))).filter(Boolean)
  const changeAssignee = (name) => {
    const updated = { ...order, assignedTo: name }
    setOrder(updated)
    // Update in localStorage
    try {
      const raw = localStorage.getItem('orders')
      const items = raw ? JSON.parse(raw) : sampleOrders
      const newItems = items.map(o => o.id === updated.id ? updated : o)
      localStorage.setItem('orders', JSON.stringify(newItems))
    } catch(e) {}
  }

  return (
    <main className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            {loading ? (
              <div className="flex items-start justify-between">
                <div className="space-y-3 w-1/2">
                   <Skeleton className="h-8 w-3/4" />
                   <Skeleton className="h-4 w-1/2" />
                   <Skeleton className="h-6 w-1/3" />
                </div>
                <div className="space-y-3 w-1/4 flex flex-col items-end">
                   <Skeleton className="h-4 w-3/4" />
                   <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{order.title || `Order ${order.id}`}</h1>
                  <div className="text-sm text-slate-400">Order ID: <span className="font-medium">{order.id}</span></div>
                  <div className="mt-3 flex items-center gap-3">
                    <Badge className="capitalize">{order.status}</Badge>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`w-3 h-3 rounded-full ${order.priority === 'high' ? 'bg-red-500' : order.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-500'}`} />
                      <span className={order.priority === 'high' ? 'font-semibold text-white' : 'text-slate-300'}>{order.priority}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-slate-400">Placed on: <span className="font-medium">{order.date}</span></div>
                  <div className="mt-1 text-sm text-slate-400">Total: <span className="font-medium">{order.total || '—'}</span></div>
                </div>

                <div className="text-sm text-slate-300 text-right">
                  <div>Assigned to</div>
                  <div className="mt-2 font-medium">{order.assignedTo}</div>
                  <div className="mt-4">
                    <button onClick={() => setEditOpen(true)} className="px-3 py-1.5 rounded bg-indigo-600 text-white">Edit</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Status Progress</h3>
            {loading ? <Skeleton className="h-16 w-full" /> : <StepIndicator status={order?.status} />}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-medium">Customer</h4>
            {loading ? (
              <div className="mt-3 flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">{order.customer?.name?.[0] || 'U'}</div>
                <div>
                  <div className="font-medium">{order.customer?.name}</div>
                  <div className="text-sm text-slate-400">{order.customer?.email}</div>
                  <div className="text-sm text-slate-400">{order.customer?.phone}</div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Customer</h3>
            <div className="text-sm text-slate-200 font-medium">{order.customer?.name}</div>
            <div className="text-sm text-slate-400">{order.customer?.email}</div>
            <div className="text-sm text-slate-400">{order.customer?.phone}</div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Notes</h3>
            <div className="text-sm text-slate-300 whitespace-pre-wrap">{order.notes || 'No notes'}</div>
            <div className="mt-3">
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full rounded px-3 py-2 bg-slate-800 border border-slate-700 text-slate-100" rows={3} placeholder="Add internal note..." />
              <div className="flex justify-end mt-2">
                <button onClick={addNote} className="px-3 py-1.5 rounded bg-indigo-600 text-white">Add Note</button>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Timeline</h3>
            <OrderTimeline events={order.timeline || []} />
          </div>
            </>
          )}
        </section>

        <aside className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-medium">Status</h4>
            {loading ? (
              <div className="space-y-2 mt-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3 mt-4" />
              </div>
            ) : (
              <>
                <div className="mt-2 text-lg font-semibold capitalize">{order?.status}</div>
                <div className="mt-4 text-sm text-slate-400">Date: {order?.date}</div>
              </>
            )}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-medium">Actions</h4>
            {loading ? (
              <div className="mt-3 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                <button onClick={() => setStatusOpen(true)} className="px-3 py-2 rounded bg-indigo-600 text-white">Change Status</button>
                <button className="px-3 py-2 rounded bg-slate-700">Print</button>
              </div>
            )}
          </div>
          
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-medium">Assigned</h4>
            {loading ? (
              <div className="mt-2 space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <>
                <div className="mt-2 text-sm">{order?.assignedTo}</div>
                <div className="mt-3">
                  <select value={order?.assignedTo || ''} onChange={e => changeAssignee(e.target.value)} className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option value="">Unassigned</option>
                    {assignees.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      <Modal open={statusOpen} onClose={() => setStatusOpen(false)} title="Change Status">
        <div className="space-y-3">
          <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700">
            <option value="pending">pending</option>
            <option value="in-progress">in-progress</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
          <div className="flex justify-end gap-2">
            <button onClick={() => setStatusOpen(false)} className="px-3 py-2 rounded bg-slate-700">Cancel</button>
            <button onClick={applyStatus} className="px-3 py-2 rounded bg-indigo-600 text-white">Apply</button>
          </div>
        </div>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Order">
        {order && <EditOrderForm initial={order} onSubmit={applyEdit} onCancel={() => setEditOpen(false)} />}
      </Modal>
    </main>
  )
}
