import React from 'react'
import { NavLink } from 'react-router-dom'

const NavItem = ({to, children, end = false}) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `no-underline block px-4 py-2.5 rounded border-2 mb-2 transition-all font-bold
        ${
          isActive
            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
            : 'text-black border-transparent hover:border-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900 dark:hover:border-gray-500'
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
      {/* Overlay for mobile - Thoda dark overlay for better focus */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      />

      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 
        bg-white text-black p-6 border-r-2 border-gray-200 z-40 
        transform transition-transform duration-300 ease-in-out
        overflow-y-auto
        dark:bg-[#121214] dark:text-white dark:border-gray-600
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0`}>

<div className='flex flex-col justify-between h-full'>

          <div>


      

        {/* Navigation */}
        <nav className="flex-1">
          <NavItem to="/" end>Dashboard</NavItem>
          <NavItem to="/orders">Orders List</NavItem>
          <NavItem to="/create">Create New Order</NavItem>
        </nav>
          </div>

        {/* Footer/User Info Section */}
        <div className=" p-4 border-t  border-gray-200 rounded dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
          <div className="text-[10px] uppercase font-black opacity-50 mb-1">Logged in as</div>
          <div className="font-bold text-sm truncate dark:text-white">Anamika Kashyap</div>
          <div className="text-[10px] text-green-600 font-bold dark:text-green-400">● Online</div>
        </div>
</div>
      </aside>
    </>
  )
}