import React, { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'

function SearchableSelect({ options = [], value, onChange, placeholder = 'Select...' }){
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="relative">
      <div className="flex">
        <input 
          className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors" 
          value={value || ''} 
          onChange={(e)=>onChange(e.target.value)} 
          placeholder={placeholder} 
        />
        <button type="button" onClick={()=>setOpen(v=>!v)} className="ml-2 px-3 rounded bg-slate-700 hover:bg-slate-600 transition-colors">▾</button>
      </div>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-slate-800 border border-slate-700 rounded shadow-lg">
          <div className="p-2 border-b border-slate-700">
            <input value={query} onChange={e=>setQuery(e.target.value)} className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-indigo-500" placeholder="Search..." />
          </div>
          <div className="max-h-40 overflow-auto py-1">
            {filtered.map(opt=> (
              <div key={opt} onClick={()=>{ onChange(opt); setOpen(false); setQuery('') }} className="px-3 py-2 hover:bg-slate-700 cursor-pointer text-slate-200">{opt}</div>
            ))}
            {filtered.length === 0 && <div className="px-3 py-2 text-sm text-slate-400">No matches</div>}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrderForm({ onSubmit, initial = {} }){
  const [data, setData] = useState({
    id: initial.id || `ORD${Math.floor(Date.now() / 1000)}`,
    title: initial.title || '',
    date: initial.date || new Date().toISOString().slice(0,10),
    customerName: initial.customer?.name || '',
    customerEmail: initial.customer?.email || '',
    customerPhone: initial.customer?.phone || '',
    status: initial.status || 'pending',
    priority: initial.priority || 'medium',
    total: initial.total || '',
    assignedTo: initial.assignedTo || ''
  })

  const [errors, setErrors] = useState({})

  const assignees = Array.from(new Set([...(initial.assignedTo ? [initial.assignedTo] : []), 'Rahul Sharma','Neha Gupta','Vikram Patel']))

  const handleChange = (field, value) => {
    setData(d => ({ ...d, [field]: value }))
    if (errors[field]) {
      setErrors(e => ({ ...e, [field]: undefined }))
    }
  }

  const validate = () => {
    const errs = {}
    if (!data.title.trim()) errs.title = 'Order title is required'
    if (!data.date) errs.date = 'Date is required'
    if (!data.customerName.trim()) errs.customerName = 'Customer name is required'
    if (!data.customerEmail.trim()) errs.customerEmail = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail)) errs.customerEmail = 'Invalid email address'
    if (!data.customerPhone.trim()) errs.customerPhone = 'Phone number is required'
    else if (!/^\d{10}$/.test(data.customerPhone)) errs.customerPhone = 'Enter a valid 10-digit phone number'
    if (!data.status) errs.status = 'Select status'
    if (!data.priority) errs.priority = 'Select priority'
    
    if (data.total && isNaN(Number(data.total))) errs.total = 'Total must be a valid number'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit && onSubmit(data)
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-sm space-y-8 mt-4">
      {/* Order Info Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-slate-700 flex items-center justify-between">
          <span>Order Information</span>
          <span className="text-sm font-normal text-slate-400 bg-slate-900 px-3 py-1 rounded border border-slate-700">ID: <span className="font-mono text-indigo-400 font-medium">{data.id}</span></span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Order Title <span className="text-red-400">*</span></label>
            <Input value={data.title} onChange={e=>handleChange('title', e.target.value)} className={`bg-slate-900 border-slate-700 text-slate-100 ${errors.title ? 'border-red-500 focus:border-red-500' : 'focus:border-indigo-500'}`} placeholder="e.g. MacBook Pro 16-inch" />
            {errors.title && <div className="text-red-400 text-xs mt-1.5">{errors.title}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Date <span className="text-red-400">*</span></label>
            <Input type="date" value={data.date} onChange={e=>handleChange('date', e.target.value)} className={`bg-slate-900 border-slate-700 text-slate-100 ${errors.date ? 'border-red-500' : 'focus:border-indigo-500'}`} />
            {errors.date && <div className="text-red-400 text-xs mt-1.5">{errors.date}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Total Amount (₹)</label>
            <Input type="number" value={data.total} onChange={e=>handleChange('total', e.target.value)} className={`bg-slate-900 border-slate-700 text-slate-100 ${errors.total ? 'border-red-500' : 'focus:border-indigo-500'}`} placeholder="0.00" />
            {errors.total && <div className="text-red-400 text-xs mt-1.5">{errors.total}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Status <span className="text-red-400">*</span></label>
            <select value={data.status} onChange={e=>handleChange('status', e.target.value)} className={`w-full px-3 py-2 rounded bg-slate-900 border ${errors.status ? 'border-red-500' : 'border-slate-700'} text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors`}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && <div className="text-red-400 text-xs mt-1.5">{errors.status}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Priority <span className="text-red-400">*</span></label>
            <select value={data.priority} onChange={e=>handleChange('priority', e.target.value)} className={`w-full px-3 py-2 rounded bg-slate-900 border ${errors.priority ? 'border-red-500' : 'border-slate-700'} text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors`}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && <div className="text-red-400 text-xs mt-1.5">{errors.priority}</div>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Assign To</label>
            <SearchableSelect options={assignees} value={data.assignedTo} onChange={(v)=>handleChange('assignedTo', v)} placeholder="Select team member..." />
          </div>
        </div>
      </div>

      {/* Customer Info Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-slate-700">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Customer Name <span className="text-red-400">*</span></label>
            <Input value={data.customerName} onChange={e=>handleChange('customerName', e.target.value)} className={`bg-slate-900 border-slate-700 text-slate-100 ${errors.customerName ? 'border-red-500' : 'focus:border-indigo-500'}`} placeholder="John Doe" />
            {errors.customerName && <div className="text-red-400 text-xs mt-1.5">{errors.customerName}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address <span className="text-red-400">*</span></label>
            <Input type="email" value={data.customerEmail} onChange={e=>handleChange('customerEmail', e.target.value)} className={`bg-slate-900 border-slate-700 text-slate-100 ${errors.customerEmail ? 'border-red-500' : 'focus:border-indigo-500'}`} placeholder="john@example.com" />
            {errors.customerEmail && <div className="text-red-400 text-xs mt-1.5">{errors.customerEmail}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number <span className="text-red-400">*</span></label>
            <Input type="tel" value={data.customerPhone} onChange={e=>handleChange('customerPhone', e.target.value)} className={`bg-slate-900 border-slate-700 text-slate-100 ${errors.customerPhone ? 'border-red-500' : 'focus:border-indigo-500'}`} placeholder="10-digit number" />
            {errors.customerPhone && <div className="text-red-400 text-xs mt-1.5">{errors.customerPhone}</div>}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-700 flex justify-end">
        <Button type="submit" className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors">
          Save Order
        </Button>
      </div>
    </form>
  )
}
