import React from 'react'

export default function Badge({ children, className = '' }){
  return (
    <span className={`inline-block bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-sm ${className}`}>
      {children}
    </span>
  )
}
