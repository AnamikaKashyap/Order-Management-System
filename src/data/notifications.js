export const notifications = [
  {
    id: 'N1001',
    type: 'info',
    title: 'New order received',
    message: 'Order ORD021 has been placed by Ravi Kumar',
    orderId: 'ORD021',
    priority: 'medium',
    createdAt: '2026-04-18T09:12:00.000Z',
    read: false
  },
  {
    id: 'N1002',
    type: 'status',
    title: 'Order status changed',
    message: 'ORD014: in-progress → completed',
    orderId: 'ORD014',
    meta: { from: 'in-progress', to: 'completed' },
    createdAt: '2026-04-18T08:30:00.000Z',
    read: false
  },
  {
    id: 'N1003',
    type: 'warning',
    title: 'High priority order pending',
    message: 'ORD011 is high priority and still pending',
    orderId: 'ORD011',
    priority: 'high',
    createdAt: '2026-04-17T16:45:00.000Z',
    read: true
  },
  {
    id: 'N1004',
    type: 'error',
    title: 'Payment failed',
    message: 'Payment failed for ORD009',
    orderId: 'ORD009',
    createdAt: '2026-04-15T11:00:00.000Z',
    read: true
  }
]
