import React from 'react'
import OrderForm from '../components/orders/OrderForm'

export default function CreateOrder(){
  const handleSubmit = (data) => {
    console.log('Create order', data)
    alert('Order created (stub)')
  }

  return (
    <main>
      <h2>Create Order</h2>
      <OrderForm onSubmit={handleSubmit} />
    </main>
  )
}
