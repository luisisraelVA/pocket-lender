import { useState, useEffect } from 'react'
import { getLoans } from '../utils/storage'

export default function Historial() {
  const [loans, setLoans] = useState([])

  useEffect(() => {
    setLoans(getLoans().filter(l => l.status === 'pagado').sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt)))
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Historial de pagos</h1>
      {loans.length === 0 ? (
        <p className="text-gray-400">No hay préstamos pagados.</p>
      ) : (
        loans.map(loan => (
          <div key={loan.id} className="bg-slate-800 p-4 rounded-xl">
            <p className="font-semibold">{loan.clientName}</p>
            <p className="text-sm text-gray-400">Monto: ${loan.amount}</p>
            <p className="text-xs text-gray-500">Pagado: {new Date(loan.paidAt).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  )
}