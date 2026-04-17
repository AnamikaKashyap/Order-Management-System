import React from 'react'

export default function Input({value, onChange, placeholder='', type='text', className=''}){
  return (
    <input
      className={`border rounded px-3 py-2 w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
    />
  )
}
