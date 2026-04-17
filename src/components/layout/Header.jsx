import React from 'react'

export default function Header({ toggleSidebar }){
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-800 border-b border-slate-700 z-40">
      <div className="w-full mx-auto h-full flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded bg-slate-700 hover:bg-slate-600"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5 text-slate-100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="h-10 w-10 bg-indigo-600 text-white rounded-md flex items-center justify-center font-bold">OM</div>
          <div className="hidden sm:block">
            <div className="text-sm text-slate-300">Welcome back</div>
            <div className="font-medium text-lg text-white">Order Management</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <input placeholder="Search orders..." className="border border-slate-700 rounded px-3 py-2 bg-slate-800 text-slate-200 placeholder-slate-500" />
          </div>
          <button className="hidden sm:inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded">New Order</button>
          <div className="h-9 w-9 rounded-full bg-slate-600 flex items-center justify-center text-sm">AK</div>
        </div>
      </div>
    </header>
  )
}
