import React from 'react'
import { useParams } from 'react-router-dom'
import OrderTimeline from '../components/orders/OrderTimeline'
import { orders as sampleOrders } from '../data/orders'
import Badge from '../components/common/Badge'
import Modal from '../components/common/Modal'
import EditOrderForm from '../components/orders/EditOrderForm'

export default function OrderDetail(){
  const { id } = useParams()
  const original = sampleOrders.find(o => String(o.id) === String(id))
  const [order, setOrder] = React.useState(original)
  const [statusOpen, setStatusOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [newStatus, setNewStatus] = React.useState(original?.status || 'pending')
  const [loading, setLoading] = React.useState(false)

  const simulateLoad = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 800)
  }

  React.useEffect(() => {
    setOrder(original)
    setNewStatus(original?.status || 'pending')
  }, [original])

  if (!order) {
    return (
      <main className="p-6">
        <h2 className="text-2xl font-semibold">Order not found</h2>
        <p className="mt-2 text-sm text-slate-400">No order matches id: {id}</p>
      </main>
    )
  }

  const applyStatus = () => {
    const today = new Date().toISOString().slice(0,10)
    const updated = { ...order, status: newStatus, timeline: [{ status: newStatus, date: today }, ...(order.timeline || [])] }
    setOrder(updated)
    setStatusOpen(false)
  }

  const applyEdit = (data) => {
    setOrder(data)
    setEditOpen(false)
  }

  return (
    <main className="p-6">
      <div className="flex justify-end mb-4 gap-2">
        <button onClick={simulateLoad} className="px-2 py-1 rounded bg-slate-700">Simulate loading</button>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{order.title || `Order ${order.id}`}</h1>
          <div className="text-sm text-slate-400">Order ID: <span className="font-medium">{order.id}</span></div>
        </div>

        <div className="flex items-center gap-3">
          <Badge>{order.priority}</Badge>
          <div className="text-sm text-slate-300">Assigned: <span className="font-medium">{order.assignedTo}</span></div>
          <button onClick={() => setEditOpen(true)} className="px-3 py-1.5 rounded bg-indigo-600 text-white">Edit</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4"><div className="h-8 w-2/3 bg-slate-700 rounded animate-pulse" /></div>
                <div className="p-4"><div className="h-8 w-1/2 bg-slate-700 rounded animate-pulse" /></div>
              </div>
              <div className="p-4"><div className="h-40 bg-slate-700 rounded animate-pulse" /></div>
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
            <div className="text-sm text-slate-300">{order.notes || 'No notes'}</div>
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
            <div className="mt-2 text-lg font-semibold capitalize">{order.status}</div>
            <div className="mt-4 text-sm text-slate-400">Date: {order.date}</div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-medium">Actions</h4>
            <div className="mt-3 flex flex-col gap-2">
              <button onClick={() => setStatusOpen(true)} className="px-3 py-2 rounded bg-indigo-600 text-white">Change Status</button>
              <button className="px-3 py-2 rounded bg-slate-700">Print</button>
            </div>
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
        <EditOrderForm initial={order} onSubmit={applyEdit} onCancel={() => setEditOpen(false)} />
      </Modal>
    </main>
  )
}
