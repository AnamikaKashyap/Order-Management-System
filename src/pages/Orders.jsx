import React from 'react' 
import { orders as sampleOrders } from '../data/orders'
import OrderCard from '../components/orders/OrderCard'
import Modal from '../components/common/Modal'
import EditOrderForm from '../components/orders/EditOrderForm'
import Skeleton from '../components/common/Skeleton'
import { addNotification } from '../utils/notifications'

const unique = (arr, key) => Array.from(new Set(arr.map((i) => i[key]))).filter(Boolean)

export default function Orders() {
  const [query, setQuery] = React.useState('')
  const [searchInput, setSearchInput] = React.useState('')
  const [datePreset, setDatePreset] = React.useState('all')
  const [items, setItems] = React.useState(() => {
    try {
      const raw = localStorage.getItem('orders')
      return raw ? JSON.parse(raw) : sampleOrders
    } catch {
      return sampleOrders
    }
  })
  const [toast, setToast] = React.useState(null)
  const [status, setStatus] = React.useState('all')
  const [priority, setPriority] = React.useState('all')
  const [view, setView] = React.useState('board')
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

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
            const day = now.getDay() 
            const offset = (day + 6) % 7 
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
  const markCompleted = (id) => {
    const order = items.find((o) => o.id === id)
    if (!order || order.status === 'completed') return

    setItems((s) => s.map((o) => (o.id === id ? { ...o, status: 'completed' } : o)))
    addNotification({
      type: 'status',
      title: 'Order status changed',
      message: `${order.id}: ${order.status} → completed`,
      orderId: order.id,
      meta: { from: order.status, to: 'completed' }
    })
  }

  const handleDrop = (e, newStatus) => {
    e.preventDefault()
    const orderId = e.dataTransfer.getData('orderId')
    if (!orderId) return

    const order = items.find((o) => o.id === orderId)
    if (!order || order.status === newStatus) return

    setItems((s) => s.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
    addNotification({
      type: 'status',
      title: 'Order status changed',
      message: `${order.id}: ${order.status} → ${newStatus}`,
      orderId: order.id,
      meta: { from: order.status, to: newStatus }
    })
  }
  
  React.useEffect(()=>{
    try{ localStorage.setItem('orders', JSON.stringify(items)) }catch{ /* ignore storage write errors */ }
  },[items])

  React.useEffect(()=>{
    const m = sessionStorage.getItem('orderCreated')
    if (m){
      setToast(m)
      sessionStorage.removeItem('orderCreated')
      setTimeout(()=>setToast(null), 3500)
    }
  },[])
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
    <main className="overflow-x-hidden font-sans p-4 text-slate-900 transition-colors duration-300 dark:text-slate-100 sm:p-5 lg:p-6">
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="mx-auto max-w-[90rem] space-y-5">
        
        {/* Header & Controls Area */}
        <div className="space-y-4 overflow-hidden rounded-3xl border border-slate-900/80 bg-white p-4 shadow-md dark:border-white/5 dark:bg-[#121214] dark:shadow-none lg:p-5">
          
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            
            {/* Search & Filters */}
            <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.7fr))]">
              
              <div className="relative min-w-0">
                <label className="text-[11px] font-bold text-slate-900 dark:text-slate-400 mb-1.5 uppercase tracking-wider block">
                  Search Orders
                </label>
                <div className="relative">
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by id, title..."
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-200 dark:bg-white/5 border border-slate-500 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                  />
                  {searchInput && (
                    <button 
                      onClick={() => clearFilter('search')} 
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="contents">
                <div className="flex min-w-0 flex-col">
                  <label className="text-[11px] font-bold text-slate-900 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)} 
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-500 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all cursor-pointer capitalize"
                  >
                    {statuses.map((s) => <option value={s} key={s} className="bg-white dark:bg-[#18181b]">{s}</option>)}
                  </select>
                </div>

                <div className="flex min-w-0 flex-col">
                  <label className="text-[11px] font-bold text-slate-900 dark:text-slate-900 mb-1.5 uppercase tracking-wider">Priority</label>
                  <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value)} 
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-500 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all cursor-pointer capitalize"
                  >
                    {priorities.map((p) => <option value={p} key={p} className="bg-white dark:bg-[#18181b]">{p}</option>)}
                  </select>
                </div>

                <div className="flex min-w-0 flex-col">
                  <label className="text-[11px] font-bold text-slate-900 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Date</label>
                  <select 
                    value={datePreset} 
                    onChange={(e) => setDatePreset(e.target.value)} 
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-500 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all cursor-pointer"
                  >
                    {Object.entries(DATE_PRESET_LABELS).map(([k,v]) => <option value={k} key={k} className="bg-white dark:bg-[#18181b]">{v}</option>)}
                  </select>
                </div>
              </div>

            </div>

            {/* View Toggles */}
            <div className="flex w-full items-center self-end rounded-xl border border-slate-200/50 bg-slate-100 p-1 dark:border-white/5 dark:bg-[#09090b] xl:w-auto">
                {['board', 'grid', 'list'].map((v) => (
                  <button 
                    key={v}
                    onClick={() => setView(v)} 
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold capitalize transition-all duration-200 xl:flex-none xl:px-4 ${view === v ? 'border border-slate-900/50 bg-white text-indigo-600 shadow-sm dark:border-white/5 dark:bg-[#1c1c1f] dark:text-indigo-400' : 'text-slate-900 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                  >
                    {v}
                  </button>
                ))}
            </div>

          </div>

          {/* Active Filter Chips */}
          {(status !== 'all' || priority !== 'all' || datePreset !== 'all' || query) && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 dark:border-white/5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Active:</span>
              {status !== 'all' && (
                <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  Status: <span className="capitalize">{status}</span> 
                  <button onClick={() => clearFilter('status')} className="hover:bg-indigo-200 dark:hover:bg-indigo-500/30 rounded-full p-0.5 transition-colors"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              )}
              {priority !== 'all' && (
                <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  Priority: <span className="capitalize">{priority}</span>
                  <button onClick={() => clearFilter('priority')} className="hover:bg-indigo-200 dark:hover:bg-indigo-500/30 rounded-full p-0.5 transition-colors"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              )}
              {datePreset !== 'all' && (
                <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  {DATE_PRESET_LABELS[datePreset]}
                  <button onClick={() => clearFilter('date')} className="hover:bg-indigo-200 dark:hover:bg-indigo-500/30 rounded-full p-0.5 transition-colors"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              )}
              {query && (
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  Search: "{query}"
                  <button onClick={() => clearFilter('search')} className="hover:bg-slate-200 dark:hover:bg-white/20 rounded-full p-0.5 transition-colors"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              )}
            </div>
          )}
        </div>

        <Modal open={editOpen} onClose={() => setEditOpen(false)} title={editingOrder ? `Edit ${editingOrder.title || editingOrder.id}` : 'Edit Order'}>
          {editingOrder && <EditOrderForm initial={editingOrder} onSubmit={applyEdit} onCancel={() => setEditOpen(false)} />}
        </Modal>

        {/* Main Content Area */}
        <div className="pb-8">
          {error ? (
            <div className="flex flex-col items-center justify-center py-20 bg-rose-50 dark:bg-rose-950/20 rounded-3xl border border-rose-200 dark:border-rose-900/50 shadow-sm">
              <svg className="w-16 h-16 text-rose-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-xl font-extrabold text-rose-900 dark:text-rose-400">Failed to load orders</h3>
              <p className="mt-2 text-sm font-medium text-rose-700 dark:text-rose-500">There was an error fetching your data. Please try again.</p>
              <button onClick={() => { setError(false); window.location.reload(); }} className="mt-6 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg shadow-rose-600/20 transition-all active:scale-95">
                Retry Connection
              </button>
            </div>
          ) : loading ? (
            view === 'board' ? (
              <div className="flex gap-4 items-start overflow-x-auto pb-4 hide-scrollbar">
                {['Pending', 'In-Progress', 'Completed', 'Cancelled'].map((title) => (
                  <div key={title} className="w-[300px] shrink-0 rounded-3xl border border-slate-200 bg-white/50 p-4 dark:border-white/5 dark:bg-[#121214]/50">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-sm">{title}</div>
                      <Skeleton className="h-5 w-8 rounded-full" />
                    </div>
                    <div className="space-y-4">
                      {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl w-full" />)}
                    </div>
                  </div>
                ))}
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({length: 6}).map((_,i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from({length: 5}).map((_,i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
              </div>
            )
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#121214] rounded-3xl border border-slate-300/80 dark:border-white/5 border-dashed shadow-sm text-center px-4">
              <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl mb-5">
                <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">No orders found</h3>
              <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-md">{buildNoResultsMessage()}</p>
              {(status !== 'all' || priority !== 'all' || query || datePreset !== 'all') && (
                <button 
                  onClick={() => { setStatus('all'); setPriority('all'); setQuery(''); setSearchInput(''); setDatePreset('all') }} 
                  className="mt-6 px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold rounded-xl transition-all shadow-sm"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                <div className="grid gap-4 xl:grid-cols-4">
                  {columns.map((col) => (
                    <div 
                      key={col.key} 
                      className="flex min-h-[340px] min-w-0 flex-col rounded-3xl border border-slate-600/80 bg-slate-100/50 p-4 shadow-sm transition-colors dark:border-white/5 dark:bg-[#121214]"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, col.key)}
                    >
                      <div className="flex items-center justify-between mb-4 px-2">
                        <div className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-sm">{col.title}</div>
                        <div className="bg-white border border-black dark:bg-white/10 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                          {grouped[col.key]?.length || 0}
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        {(grouped[col.key] || []).map((o) => (
                          <div 
                            key={o.id} 
                            draggable 
                            onDragStart={(e) => { e.dataTransfer.setData('orderId', o.id); e.dataTransfer.effectAllowed = 'move' }}
                            className="cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform duration-200"
                          >
                            <OrderCard order={o} onDelete={() => removeOrder(o.id)} onMarkComplete={() => markCompleted(o.id)} onEdit={handleEdit} />
                          </div>
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
                <OrderCard key={o.id} order={o} onDelete={() => removeOrder(o.id)} onMarkComplete={() => markCompleted(o.id)} onEdit={handleEdit} />
              ))}
            </div>
          )}
        </div>
        
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-3 animate-bounce">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {toast}
          </div>
        )}
      </div>
    </main>
  )
}
