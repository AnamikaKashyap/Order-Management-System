import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import AppRoutes from './routes/AppRoutes'
import './index.css'
import './App.css'

export default function App(){
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <Header toggleSidebar={() => setSidebarOpen(v => !v)} />

        <div className="pt-16 flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <section className="flex-1 p-6 min-h-screen">
            <div className="maxx-w-[1126px] mx-auto">
              <AppRoutes />
            </div>
          </section>
        </div>
      </div>
    </BrowserRouter>
  )
}
