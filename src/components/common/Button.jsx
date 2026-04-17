import React from 'react'

export default function Button({ children, onClick, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-500 ${className}`}
    >
      {children}
    </button>
  )
}
