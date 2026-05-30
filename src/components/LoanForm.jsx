import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addLoan } from '../utils/storage'
import { generateId } from '../utils/calculations'

export default function LoanForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    clientName: '',
    phone: '',
    amount: '',
    dailyInterest: '',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const loan = {
      id: generateId(),
      ...form,
      amount: parseFloat(form.amount),
      dailyInterest: parseFloat(form.dailyInterest),
      status: 'activo',
      createdAt: new Date().toISOString(),
    }
    addLoan(loan)
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Nuevo préstamo</h1>
      <input className="w-full bg-slate-800 p-3 rounded" placeholder="Nombre del cliente" value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} required />
      <input className="w-full bg-slate-800 p-3 rounded" placeholder="Teléfono" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
      <input type="number" className="w-full bg-slate-800 p-3 rounded" placeholder="Monto" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
      <input type="number" step="0.01" className="w-full bg-slate-800 p-3 rounded" placeholder="Interés diario (%)" value={form.dailyInterest} onChange={e => setForm({...form, dailyInterest: e.target.value})} required />
      <input type="date" className="w-full bg-slate-800 p-3 rounded" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
      <input type="date" className="w-full bg-slate-800 p-3 rounded" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} required />
      <textarea className="w-full bg-slate-800 p-3 rounded" placeholder="Notas" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
      <button type="submit" className="w-full bg-blue-600 py-3 rounded font-bold">Guardar</button>
    </form>
  )
}