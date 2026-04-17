import React from 'react'
import { NavLink } from 'react-router-dom'

const NavItem = ({to, children, end = false}) => (
  <NavLink
    to={to}
    end={end}
    className={({isActive}) => `no-underline block px-3 py-2 rounded-md mb-1 ${isActive ? 'bg-white/10 font-semibold text-white' : 'text-white/90 hover:bg-white/5'}`}
  >
    {children}
  </NavLink>
)

export default function Sidebar({ isOpen, onClose }){
  return (
    <>
      {/* Overlay for mobile */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      />

      <aside className={`fixed top-16 left-0 bottom-0 w-72 bg-gradient-to-b from-slate-800 to-slate-900 text-white p-6 z-40 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:top-0 md:h-screen`}>
        <div className="mb-6">
          <div className="text-xl font-bold">OMS</div>
          <div className="text-sm text-slate-400">Manage orders efficiently</div>
        </div>

        <nav className="flex-1">
          <NavItem to="/" end>Dashboard</NavItem>
          <NavItem to="/orders" end>Orders</NavItem>
          <NavItem to="/orders/create">Create Order</NavItem>
        </nav>

        <div className="mt-6 text-sm text-slate-400">
          <div>Logged in as</div>
          <div className="font-medium text-white">Anamika Kashyap</div>
        </div>
      </aside>
    </>
  )
}
