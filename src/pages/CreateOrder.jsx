import React from 'react'
import { useNavigate } from 'react-router-dom'
import OrderForm from '../components/orders/OrderForm'
import { orders as sampleOrders } from '../data/orders'

export default function CreateOrder(){
  const navigate = useNavigate()

  const handleSubmit = (data) => {
    const id = data.id && String(data.id).trim() ? data.id : `ORD${Date.now()}`
    const order = {
      id,
      title: data.title,
      date: data.date || new Date().toISOString().slice(0,10),
      customer: { name: data.customerName || '', email: data.customerEmail || '', phone: data.customerPhone || '' },
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      total: data.total || '',
      assignedTo: data.assignedTo || ''
    }

    try{
      const raw = localStorage.getItem('orders')
      const arr = raw ? JSON.parse(raw) : sampleOrders
      arr.unshift(order)
      localStorage.setItem('orders', JSON.stringify(arr))
    }catch(e){
      console.error(e)
    }

    sessionStorage.setItem('orderCreated', `Order ${id} created successfully`)
    navigate('/orders')
  }

  return (
    <main className='p-6'>
      <h2>Create Order</h2>
      <OrderForm onSubmit={handleSubmit} />
    </main>
  )
}
