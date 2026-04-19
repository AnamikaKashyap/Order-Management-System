import { Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Orders from '../pages/Orders'
import OrderDetail from '../pages/OrderDetail'
import CreateOrder from '../pages/CreateOrder'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      
      {/* 👇 group orders */}
      <Route path="/orders">
        <Route index element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
      </Route>
      <Route path="/create" element={<CreateOrder />} />
    </Routes>
  )
}
