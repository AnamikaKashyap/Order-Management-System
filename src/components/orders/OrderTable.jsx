import React from 'react'

export default function OrderTable({ orders = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Customer</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Priority</th>
            <th className="px-3 py-2">Assigned</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="odd:bg-slate-800 even:bg-slate-900">
              <td className="px-3 py-2 align-top">{o.id}</td>
              <td className="px-3 py-2 align-top">{o.customer?.name || o.customer}</td>
              <td className="px-3 py-2 align-top">{o.status}</td>
              <td className="px-3 py-2 align-top">{o.priority}</td>
              <td className="px-3 py-2 align-top">{o.assignedTo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
