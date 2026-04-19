import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const NavItem = ({to, children, end = false}) => {
  
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
  `no-underline block px-3 py-2 rounded-md mb-1 transition-colors
  ${
    isActive
      ? 'bg-gray-200 text-gray-900 font-semibold dark:bg-white/10 dark:text-white'
      : 'text-slate-900 font-semibold hover:bg-gray-100 dark:text-white/90 dark:hover:bg-white/5'
  }`
}

    >
      {children}
    </NavLink>
  )
}

export default function Sidebar({ isOpen, onClose }){
  return (
    <>
      {/* Overlay for mobile */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      />

      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 
dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 
border-2 border-slate-500 text-white p-6 z-40 
transform transition-transform 
overflow-y-auto
${isOpen ? 'translate-x-0' : '-translate-x-full'} 
md:translate-x-0`}>

        <div className="mb-6">
          <div className="text-xl font-bold text-black dark:text-white">OMS</div>
          <div className="text-sm text-slate-400">Manage orders efficiently</div>
        </div>

        <nav className="flex-1">
<NavItem to="/">Dashboard</NavItem>
<NavItem to="/orders">Orders</NavItem>
<NavItem to="/create">Create Order</NavItem>

        </nav>

        <div className="mt-6 text-sm text-slate-400">
          <div>Logged in as</div>
          <div className="font-medium dark:text-white">Anamika Kashyap</div>
        </div>
      </aside>
    </>
  )
}
