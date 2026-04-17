import React from 'react'

export default function Modal({ open, onClose, title, children }){
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-slate-800 text-slate-100 rounded-lg shadow-lg w-full max-w-2xl p-6 z-10">
        {title && <div className="text-lg font-semibold mb-4">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  )
}
