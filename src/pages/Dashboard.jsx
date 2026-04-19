import React, { useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import { orders } from '../data/orders'
import StatCard from '../components/common/StatCard'
import OrderCard from '../components/orders/OrderCard'
import Skeleton from '../components/common/Skeleton'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const total = orders.length
  const pending = orders.filter((o) => o.status === 'pending').length
  const inProgress = orders.filter((o) => o.status === 'in-progress').length
  const completed = orders.filter((o) => o.status === 'completed').length
  const cancelled = orders.filter((o) => o.status === 'cancelled').length
  const highPriority = orders.filter((o) => o.priority === 'high').length

  const recent = orders.slice(0, 4)

  const chartOptions = {
    tooltip: { 
      trigger: 'axis', 
      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
      textStyle: { color: '#ffffff', fontSize: 13 }, 
      borderWidth: 0,
      padding: [12, 16],
      borderRadius: 12,
      extraCssText: 'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);'
    },
    grid: { left: '1%', right: '1%', bottom: '2%', top: '8%', containLabel: true },
    xAxis: { 
      type: 'category', 
      boundaryGap: false, 
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
      axisLabel: { color: '#94a3b8', padding: [10, 0, 0, 0] },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: { 
      type: 'value', 
      axisLabel: { color: '#94a3b8' }, 
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)', type: 'dashed' } } 
    },
    series: [
      {
        name: 'Orders',
        type: 'line',
        smooth: 0.4,
        symbolSize: 0,
        showSymbol: false,
        lineStyle: { width: 4, color: '#4F46E5' },
        data: [12, 15, 20, 18, 25, 22, 30],
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(79, 70, 229, 0.3)' }, 
              { offset: 1, color: 'rgba(79, 70, 229, 0.01)' }
            ]
          }
        },
      }
    ]
  }

  return (
  <div className="min-h-screen bg-slate-50 dark:bg-black p-4 lg:p-6 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
    
    <style>{`
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>

    <div className="max-w-[90rem] mx-auto ">
      
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm font-semibold">
            Welcome back. Here's what's happening with your store today.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 my-4 pb-2 hide-scrollbar mx-0 px-4 lg:mx-0 lg:px-0">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="min-w-[260px] h-[110px] rounded-2xl shrink-0" />
          ))
        ) : (
          <>
            {[
              { title: "Total Orders", value: total, subtitle: "All time records", delta: "+3%", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", color: "text-indigo-600", bg: "bg-indigo-600/10" },
              { title: "Pending", value: pending, subtitle: "Awaiting processing", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-amber-600", bg: "bg-amber-600/10" },
              { title: "In Progress", value: inProgress, subtitle: "Currently active", icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "text-blue-600", bg: "bg-blue-600/10", progress: total > 0 ? (inProgress / total) * 100 : 0 },
              { title: "Completed", value: completed, subtitle: "Successfully delivered", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-emerald-600", bg: "bg-emerald-600/10", progress: total > 0 ? (completed / total) * 100 : 0 },
              { title: "Cancelled", value: cancelled, subtitle: "Discontinued", icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-rose-600", bg: "bg-rose-600/10" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="relative min-w-[240px] sm:min-w-[280px] shrink-0 snap-start group bg-white dark:bg-[#121214] border border-slate-300/80 dark:border-white/5 p-4 rounded-2xl shadow-md dark:shadow-none hover:shadow-xl hover:border-indigo-200 dark:hover:bg-[#18181b] hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden"
              >
                <svg className={`absolute -right-2 -bottom-2 w-24 h-24 opacity-[0.05] dark:opacity-[0.02] ${stat.color} transition-transform group-hover:scale-110 duration-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={stat.icon} />
                </svg>

                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-0.5">{stat.title}</p>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</h4>
                  </div>
                  
                  {stat.delta ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
                      {stat.delta}
                    </span>
                  ) : (
                    <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                      <svg className={`w-4 h-4 ${stat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="relative z-10 mt-3">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-500">{stat.subtitle}</p>
                  
                  {stat.progress !== undefined && (
                    <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${stat.color.replace('text-', 'bg-')} transition-all duration-1000 ease-out`} 
                        style={{ width: `${stat.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT (Chart & Orders) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#121214] border border-slate-300/80 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-none">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  Revenue & Orders
                </h3>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-semibold">
                  Performance over the last 7 days
                </div>
              </div>
              <div className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full text-[11px] font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10">
                This Week
              </div>
            </div>
            {/* Chart placeholder */}
            <div className="h-[280px] w-full">
               {loading ? <Skeleton className="h-full w-full rounded-2xl" /> : <ReactECharts option={chartOptions} style={{ height: '100%' }} />}
            </div>
          </div>

          <div className="bg-blue-100 dark:bg-[#121214] border border-slate-300/80 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-none">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Activity</h3>
              <button className="text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:underline">
                View all &rarr;
              </button>
            </div>
            <div className="space-y-2">
              {/* Order Cards here will inherit high contrast from the OrderCard component if you apply similar logic there */}
              {recent.map((o) => (
                <div key={o.id} className="hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                  <OrderCard order={o} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT (Aside) */}
        <aside className="space-y-6 sticky top-6 self-start">
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-2xl p-5 shadow-xl">
             {/* Content remains similar but ensures white text is crisp against the stronger gradient */}
             <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse shadow-lg"></div>
                  <h4 className="font-bold tracking-wider text-white/90 uppercase text-[10px]">Action Required</h4>
                </div>
                <div className='flex items-center gap-4 w-full'>
                  <div className="text-6xl font-black tracking-tighter text-white drop-shadow-lg">{highPriority}</div>
                  <div className="text-xs font-bold text-indigo-50 leading-relaxed flex-1">High priority orders require immediate attention.</div>
                </div>
                <button className="mt-5 w-full bg-white text-indigo-700 text-sm font-bold py-3 px-4 rounded-xl shadow-md hover:bg-slate-50 transition-transform active:scale-95">
                  Review Orders
                </button>
             </div>
          </div>

          {/* Mini Insight Card - Restored Text & Improved Light Mode Contrast */}
<div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-5 shadow-sm dark:shadow-none">
  <div className="flex items-center space-x-2.5 mb-3">
    <div className="p-1.5 bg-white dark:bg-indigo-500/20 rounded-md shadow-sm dark:shadow-none">
      <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    </div>
    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
      Weekly Insight
    </h4>
  </div>
  
  <p className="text-slate-700 dark:text-slate-400 leading-relaxed text-xs font-medium">
    Order volume has increased by <span className="text-indigo-600 dark:text-indigo-400 font-bold">+24%</span> compared to the previous period. Keep up the great momentum!
  </p>
</div>
        </aside>
      </div>
    </div>
  </div>
)
}