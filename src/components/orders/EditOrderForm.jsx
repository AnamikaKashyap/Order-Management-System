import React from 'react'
import Input from '../common/Input'
import Button from '../common/Button'

export default function EditOrderForm({ initial = {}, onSubmit, onCancel }){
  const [title, setTitle] = React.useState(initial.title || '')
  const [name, setName] = React.useState(initial.customer?.name || '')
  const [email, setEmail] = React.useState(initial.customer?.email || '')
  const [phone, setPhone] = React.useState(initial.customer?.phone || '')
  const [status, setStatus] = React.useState(initial.status || 'pending')
  const [priority, setPriority] = React.useState(initial.priority || 'medium')
  const [assignedTo, setAssignedTo] = React.useState(initial.assignedTo || '')
  const [notes, setNotes] = React.useState(initial.notes || '')

  const submit = (e) => {
    e.preventDefault()
    const data = {
      ...initial,
      title,
      customer: { name, email, phone },
      status,
      priority,
      assignedTo,
      notes,
    }
    onSubmit && onSubmit(data)
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="text-sm text-slate-300">Title</label>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Order title" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label className="text-sm text-slate-300">Customer name</label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        </div>
        <div>
          <label className="text-sm text-slate-300">Email</label>
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        </div>
        <div>
          <label className="text-sm text-slate-300">Phone</label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
        </div>
      </div>

      <div className="flex gap-2">
        <div>
          <label className="text-sm text-slate-300">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-2 py-2 rounded bg-slate-800 border border-slate-700">
            <option value="pending">pending</option>
            <option value="in-progress">in-progress</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-300">Priority</label>
          <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full px-2 py-2 rounded bg-slate-800 border border-slate-700">
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm text-slate-300">Assigned To</label>
        <Input value={assignedTo} onChange={e => setAssignedTo(e.target.value)} placeholder="Assignee" />
      </div>

      <div>
        <label className="text-sm text-slate-300">Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full rounded px-3 py-2 bg-slate-800 border border-slate-700 text-slate-100" rows={4} />
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit">Save</Button>
        <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded bg-slate-700">Cancel</button>
      </div>
    </form>
  )
}
