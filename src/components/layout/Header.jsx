import React from 'react'
import { useNavigate } from 'react-router-dom'
import ActivityPanel from '../common/ActivityPanel'
import { useTheme } from '../../context/ThemeContext'
import { Bell, Moon, Sun } from "lucide-react";
import { readNotifications } from '../../utils/notifications'

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)
  const [unread, setUnread] = React.useState(0)

  const { theme, toggleTheme } = useTheme();

  const updateUnread = () => {
    try {
      const arr = readNotifications()
      setUnread(arr.filter(i => !i.read).length)
    } catch { setUnread(0) }
  }

  React.useEffect(() => {
    updateUnread()
    window.addEventListener('storage', updateUnread)
    return () => window.removeEventListener('storage', updateUnread)
  }, [open])

  const handleNavigate = (orderId) => {
    setOpen(false)
    if (orderId) navigate(`/orders/${orderId}`)
  }

  const renderForm = () => {
    setOpen(false)
    navigate('create')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-gray-200 bg-white text-slate-900 transition-colors dark:border-gray-800 dark:bg-[#121214] dark:text-white">
      <div className="w-full mx-auto h-full flex items-center justify-between px-4 md:px-6">

        {/* Left Side: Sidebar Toggle & Branding */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="rounded border border-gray-200 p-1.5 hover:bg-slate-50 transition-colors md:hidden dark:border-gray-800 dark:hover:bg-white/5"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="h-9 w-9 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold dark:bg-white dark:text-black">
            OM
          </div>

          <div className="hidden sm:block">
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50">Welcome to</div>
            <div className="text-sm font-bold tracking-tight">Order Management System</div>
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-3">

          <button
            className="hidden sm:inline-flex items-center cursor-pointer px-5 py-2 rounded-xl text-sm font-bold text-white transition-all duration-500 active:scale-95 shadow-lg
    bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-[length:200%_auto]
    hover:bg-right hover:shadow-indigo-500/40 hover:-translate-y-0.5
    dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 dark:hover:shadow-purple-500/30"
            onClick={renderForm}
          >
            New Order
          </button>

          {/* Notifications */}
          <div className="relative inline-block">
            <button
              onClick={() => setOpen(v => !v)}
              className={`relative rounded-md border p-2 cursor-pointer transition-all ${open
                  ? 'bg-slate-100 border-slate-300 dark:bg-white/10 dark:border-gray-600'
                  : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5'
                }`}
            >
              <Bell className="h-4 w-4 cursor-pointer" strokeWidth={2} />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white dark:border-[#121214]">
                  {unread}
                </span>
              )}
            </button>
            <ActivityPanel open={open} onClose={() => setOpen(false)} onNavigate={handleNavigate} />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md border cursor-pointer border-gray-200 hover:bg-gray-50 transition-all dark:border-gray-800 dark:hover:bg-white/5"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Profile Avatar */}
          <div className="h-8 w-8 rounded-full border border-gray-200 bg-slate-100 flex items-center justify-center text-xs cursor-pointer font-bold dark:border-gray-800 dark:bg-white/10">
            AK
          </div>
        </div>
      </div>
    </header>
  )
}