import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Orders from '../pages/Orders'
import OrderDetail from '../pages/OrderDetail'
import CreateOrder from '../pages/CreateOrder'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/orders/create" element={<CreateOrder />} />
      <Route path="/orders/:id" element={<OrderDetail />} />
    </Routes>
  )
}
