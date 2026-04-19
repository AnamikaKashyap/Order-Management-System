import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import AppRoutes from './routes/AppRoutes'
import './index.css'
import './App.css'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="min-h-screen transition-colors duration-200">
        <Header
          toggleSidebar={() => setSidebarOpen(v => !v)}
        />
        <div className="pt-16 flex  overflow-hidden">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <section className="flex-1 p-0 h-[calc(100vh-4rem)] overflow-y-auto md:ml-72">
            <div className="mx-auto">
              <AppRoutes />
            </div>
          </section>
        </div>
      </div>
    </BrowserRouter>
  )
}