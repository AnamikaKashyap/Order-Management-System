import React from 'react'

export default function Card({ children, className = '' }){
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow p-4 transition-transform transform hover:-translate-y-0.5 hover:shadow-lg overflow-hidden ${className}`}>
      {children}
    </div>
  )
}
