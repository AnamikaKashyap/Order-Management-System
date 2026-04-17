import React from 'react'
import { orders as sampleOrders } from '../data/orders'
import OrderCard from '../components/orders/OrderCard'
import Modal from '../components/common/Modal'
import EditOrderForm from '../components/orders/EditOrderForm'
import Skeleton from '../components/common/Skeleton'

const unique = (arr, key) => Array.from(new Set(arr.map((i) => i[key]))).filter(Boolean)

export default function Orders() {
  const [query, setQuery] = React.useState('')
  const [searchInput, setSearchInput] = React.useState('')
  const [datePreset, setDatePreset] = React.useState('all')
  const [items, setItems] = React.useState(sampleOrders)
  const [status, setStatus] = React.useState('all')
  const [priority, setPriority] = React.useState('all')
  const [view, setView] = React.useState('board')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)

  const statuses = ['all', ...unique(sampleOrders, 'status')]
  const priorities = ['all', ...unique(sampleOrders, 'priority')]

  const DATE_PRESET_LABELS = {
    all: 'All Dates',
    past_7_days: 'Past 7 Days',
    past_30_days: 'Past 30 Days',
    past_90_days: 'Past 90 Days',
    this_week: 'This Week',
    this_month: 'This Month',
    this_year: 'This Year'
  }

  const filtered = items.filter((o) => {
    const q = query.trim().toLowerCase()
    if (status !== 'all' && o.status !== status) return false
    if (priority !== 'all' && o.priority !== priority) return false
    if (datePreset !== 'all') {
      if (!o.date) return false
      const today = new Date()
      const orderDate = new Date(o.date)

      const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
      const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)

      const getStart = (preset) => {
        const now = new Date()
        const todayStart = startOfDay(now)
        switch (preset) {
          case 'past_7_days':
            return new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000)
          case 'past_30_days':
            return new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000)
          case 'past_90_days':
            return new Date(todayStart.getTime() - 90 * 24 * 60 * 60 * 1000)
          case 'this_week': {
            // week start Monday
            const day = now.getDay() // 0 (Sun) - 6 (Sat)
            const offset = (day + 6) % 7 // days since Monday
            return new Date(todayStart.getTime() - offset * 24 * 60 * 60 * 1000)
          }
          case 'this_month':
            return new Date(now.getFullYear(), now.getMonth(), 1)
          case 'this_year':
            return new Date(now.getFullYear(), 0, 1)
          default:
            return null
        }
      }

      const start = getStart(datePreset)
      const end = endOfDay(today)
      if (!start) return false
      if (orderDate < start || orderDate > end) return false
    }
    if (!q) return true
    return (
      String(o.id).toLowerCase().includes(q) ||
      (o.title && o.title.toLowerCase().includes(q)) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(q))
    )
  })

  // debounce searchInput -> query
  React.useEffect(() => {
    const t = setTimeout(() => setQuery(searchInput), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  const clearFilter = (key) => {
    if (key === 'status') setStatus('all')
    if (key === 'priority') setPriority('all')
    if (key === 'date') setDatePreset('all')
    if (key === 'search') { setSearchInput(''); setQuery('') }
  }

  const removeOrder = (id) => setItems((s) => s.filter((o) => o.id !== id))
  const markCompleted = (id) => setItems((s) => s.map((o) => o.id === id ? { ...o, status: 'completed' } : o))
  const [editingOrder, setEditingOrder] = React.useState(null)
  const [editOpen, setEditOpen] = React.useState(false)

  const handleEdit = (order) => {
    setEditingOrder(order)
    setEditOpen(true)
  }

  const applyEdit = (data) => {
    setItems((s) => s.map((o) => (o.id === data.id ? data : o)))
    setEditOpen(false)
    setEditingOrder(null)
  }

  const simulateLoad = () => {
    setError(false)
    setLoading(true)
    setTimeout(() => setLoading(false), 900)
  }

  const simulateError = () => {
    setLoading(false)
    setError(true)
  }

  const buildNoResultsMessage = () => {
    const parts = []
    if (status !== 'all') parts.push(`Status: ${status}`)
    if (priority !== 'all') parts.push(`Priority: ${priority}`)
    if (query) parts.push(`Search: "${query}"`)
    if (datePreset !== 'all') parts.push(`${DATE_PRESET_LABELS[datePreset] || datePreset}`)
    if (parts.length === 0) return 'No orders available.'
    return `No orders match filters: ${parts.join(' • ')}`
  }

  return (
    <main className="space-y-6 overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-lg">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by id, title or customer"
              className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100"
            />
            {searchInput && (
              <button onClick={() => clearFilter('search')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300">✕</button>
            )}
          </div>

          <div className="hidden sm:flex items-start gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-slate-300 mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-100">
                {statuses.map((s) => (
                  <option value={s} key={s} className="bg-slate-900">{s}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-slate-300 mb-1">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-100">
                {priorities.map((p) => (
                  <option value={p} key={p} className="bg-slate-900">{p}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-slate-300 mb-1">Date</label>
              <select value={datePreset} onChange={(e) => setDatePreset(e.target.value)} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-100">
                {Object.entries(DATE_PRESET_LABELS).map(([k,v]) => (
                  <option value={k} key={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <button onClick={() => setView('grid')} className={`px-2 py-1 rounded ${view === 'grid' ? 'bg-indigo-600' : 'bg-slate-800'}`}>Grid</button>
            <button onClick={() => setView('list')} className={`px-2 py-1 rounded ${view === 'list' ? 'bg-indigo-600' : 'bg-slate-800'}`}>List</button>
            <button onClick={() => setView('board')} className={`px-2 py-1 rounded ${view === 'board' ? 'bg-indigo-600' : 'bg-slate-800'}`}>Board</button>
        </div>
      </div>
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={editingOrder ? `Edit ${editingOrder.title || editingOrder.id}` : 'Edit Order'}>
        {editingOrder && <EditOrderForm initial={editingOrder} onSubmit={applyEdit} onCancel={() => setEditOpen(false)} />}
      </Modal>

      <div className="flex items-center gap-2">
        <button onClick={simulateLoad} className="px-2 py-1 rounded bg-slate-700">Simulate loading</button>
        <button onClick={simulateError} className="px-2 py-1 rounded bg-rose-700">Simulate error</button>
      </div>

      <div>
        {/* Active filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {status !== 'all' && <div className="bg-slate-700 text-slate-100 px-2 py-1 rounded-full text-sm">Status: {status} <button onClick={() => clearFilter('status')} className="ml-2">✕</button></div>}
          {priority !== 'all' && <div className="bg-slate-700 text-slate-100 px-2 py-1 rounded-full text-sm">Priority: {priority} <button onClick={() => clearFilter('priority')} className="ml-2">✕</button></div>}
          {datePreset !== 'all' && <div className="bg-slate-700 text-slate-100 px-2 py-1 rounded-full text-sm">{DATE_PRESET_LABELS[datePreset]} <button onClick={() => clearFilter('date')} className="ml-2">✕</button></div>}
          {query && <div className="bg-slate-700 text-slate-100 px-2 py-1 rounded-full text-sm">Search: "{query}" <button onClick={() => clearFilter('search')} className="ml-2">✕</button></div>}
        </div>
        {error ? (
          <div className="text-center py-10 text-rose-300">
            <div className="text-lg font-semibold">Failed to load orders</div>
            <div className="mt-2">There was an error fetching orders. Try again.</div>
            <div className="mt-4"><button onClick={() => { setError(false); simulateLoad(); }} className="px-3 py-2 rounded bg-indigo-600 text-white">Retry</button></div>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length:6}).map((_,i)=>(<Skeleton key={i} className="h-40" />))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-400">{buildNoResultsMessage()}</div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((o) => (
              <OrderCard key={o.id} order={o} onDelete={() => removeOrder(o.id)} onMarkComplete={() => markCompleted(o.id)} onEdit={handleEdit} />
            ))}
          </div>
        ) : view === 'board' ? (
          (() => {
            const columns = [
              { key: 'pending', title: 'Pending' },
              { key: 'in-progress', title: 'In-Progress' },
              { key: 'completed', title: 'Completed' },
              { key: 'cancelled', title: 'Cancelled' }
            ]

            const grouped = columns.reduce((acc, col) => {
              acc[col.key] = filtered.filter((o) => o.status === col.key)
              return acc
            }, {})

            return (
              <div className="flex gap-4 items-start flex-wrap">
                {columns.map((col) => (
                  <div key={col.key} className="flex-1 min-w-0 bg-slate-900/40 rounded p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-slate-100">{col.title}</div>
                      <div className="text-sm text-slate-300">{grouped[col.key]?.length || 0}</div>
                    </div>
                    <div className="space-y-3">
                      {(grouped[col.key] || []).map((o) => (
                        <OrderCard key={o.id} order={o} onDelete={() => removeOrder(o.id)} onMarkComplete={() => markCompleted(o.id)} onEdit={handleEdit} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          })()
        ) : (
          <div className="space-y-3">
            {filtered.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
