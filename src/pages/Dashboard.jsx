import React, { useState } from 'react'
import { orders } from '../data/orders'
import StatCard from '../components/common/StatCard'
import OrderCard from '../components/orders/OrderCard'
import Skeleton from '../components/common/Skeleton'

export default function Dashboard() {
  const [loading, setLoading] = useState(false)

  const total = orders.length
  const pending = orders.filter((o) => o.status === 'pending').length
  const inProgress = orders.filter((o) => o.status === 'in-progress').length
  const completed = orders.filter((o) => o.status === 'completed').length
  const cancelled = orders.filter((o) => o.status === 'cancelled').length
  const highPriority = orders.filter((o) => o.priority === 'high').length

  const recent = orders.slice(0, 4)

  const simulateLoad = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 900)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="flex items-center gap-2">
          <button onClick={simulateLoad} className="px-2 py-1 rounded bg-slate-700">Simulate loading</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {loading ? (
          Array.from({length:5}).map((_,i)=>(<Skeleton key={i} className="h-20" />))
        ) : (
          <>
            <StatCard title="Total Orders" value={total} delta="+3%">All orders in system</StatCard>
            <StatCard title="Pending" value={pending}>Awaiting processing</StatCard>
            <StatCard title="In Progress" value={inProgress}>Currently being handled</StatCard>
            <StatCard title="Completed" value={completed}>Successfully delivered</StatCard>
            <StatCard title="Cancelled" value={cancelled}>Orders cancelled</StatCard>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Orders Overview</h3>
              <div className="text-sm text-slate-400">Last 7 days</div>
            </div>
            {loading ? (
              <Skeleton className="mt-4 h-48" />
            ) : (
              <div className="mt-4 h-48 rounded bg-gradient-to-r from-slate-700 to-slate-800 flex items-center justify-center text-slate-500">Chart placeholder</div>
            )}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Recent Orders</h3>
            <div className="space-y-3">
              {recent.map((o) => (
                <OrderCard key={o.id} order={o} />
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-medium">Priority</h4>
            <div className="mt-2 text-3xl font-semibold">{highPriority}</div>
            <div className="text-sm text-slate-400 mt-1">High priority orders</div>
          </div>

          {/* <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
             <h4 className="font-medium">Status Summary</h4>
            <ul className="mt-3 text-sm text-slate-300 space-y-1">
              <li>Total: {total}</li>
              <li>Pending: {pending}</li>
              <li>In Progress: {inProgress}</li>
              <li>Completed: {completed}</li>
              <li>Cancelled: {cancelled}</li>
            </ul>
          </div> */}
        </aside>
      </div>
    </div>
  )
}