import React from 'react'
import Input from '../common/Input'
import Button from '../common/Button'

export default function OrderForm({onSubmit, initial = {customer: ''}}){
  const [customer, setCustomer] = React.useState(initial.customer)

  const submit = (e) => {
    e.preventDefault()
    onSubmit && onSubmit({customer})
  }

  return (
    <form onSubmit={submit} className="order-form space-y-3 max-w-md">
      <Input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Customer name" />
      <div className="flex items-center gap-2">
        <Button type="submit">Create</Button>
        <button type="button" className="px-3 py-1.5 rounded border">Reset</button>
      </div>
    </form>
  )
}
