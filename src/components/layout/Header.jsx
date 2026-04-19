import React from 'react'
import { useNavigate } from 'react-router-dom'
import ActivityPanel from '../common/ActivityPanel'
import { useTheme } from '../../context/ThemeContext'
import { Bell, Moon, Sun } from "lucide-react";
import { readNotifications } from '../../utils/notifications'

export default function Header({ toggleSidebar }){
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)
  const [unread, setUnread] = React.useState(0)

  const { theme, toggleTheme } = useTheme();

  const updateUnread = () => {
    try{
      const arr = readNotifications()
      setUnread(arr.filter(i=>!i.read).length)
    }catch{ setUnread(0) }
  }

  React.useEffect(()=>{
    updateUnread()
    window.addEventListener('storage', updateUnread)
    return () => window.removeEventListener('storage', updateUnread)
  }, [open])

  const handleNavigate = (orderId) => {
    setOpen(false)
    if (orderId) navigate(`/orders/${orderId}`)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="w-full mx-auto h-full flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="rounded bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 md:hidden dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="h-10 w-10 bg-indigo-600 text-white rounded-md flex items-center justify-center font-bold">OM</div>
          <div className="hidden sm:block">
            <div className="text-sm text-slate-400 dark:text-slate-300">Welcome back</div>
            <div className="text-lg font-medium text-slate-700 dark:text-white">Order Management</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <input placeholder="Search orders..." className="rounded border border-slate-300 bg-white px-3 py-2 text-slate-700 placeholder-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500" />
          </div>
          <button className="hidden sm:inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded">New Order</button>
          <div className="block">
            <div className="relative inline-block">
              <button
                onClick={()=>setOpen(v=>!v)}
                onKeyDown={(e)=>{ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(v=>!v) } }}
                aria-haspopup="true"
                aria-expanded={open}
                aria-controls="activity-panel"
                className={`relative rounded-xl border p-2 transition ${
                  open
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-slate-600 dark:bg-slate-700 dark:text-indigo-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">{unread}</span>}
              </button>
              <ActivityPanel open={open} onClose={()=>setOpen(false)} onNavigate={handleNavigate} />
            </div>
          </div>

          {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition"
      >
        {theme === "light" ? (
          <Moon size={18} />
        ) : (
          <Sun size={18} className="text-yellow-400" />
        )}
      </button>
          <div className="h-9 w-9 rounded-full bg-slate-600 flex items-center justify-center text-sm">AK</div>
        </div>
      </div>
    </header>
  )
}
