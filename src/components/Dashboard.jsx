import { useState, useEffect } from 'react'
import { getLoans } from '../utils/storage'
import { calculateDebt } from '../utils/calculations'
import LoanList from './LoanList'

export default function Dashboard() {
  const [loans, setLoans] = useState([])

  useEffect(() => {
    setLoans(getLoans().filter(l => l.status === 'activo'))
  }, [])

  const totalDebt = loans.reduce((sum, loan) => sum + calculateDebt(loan), 0)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Préstamos activos</h1>
      <div className="bg-slate-800 p-4 rounded-xl">
        <p className="text-gray-400">Deuda total</p>
        <p className="text-3xl font-bold text-blue-400">${totalDebt.toFixed(2)}</p>
      </div>
      <LoanList loans={loans} onUpdate={() => setLoans(getLoans().filter(l => l.status === 'activo'))} />
    </div>
  )
}