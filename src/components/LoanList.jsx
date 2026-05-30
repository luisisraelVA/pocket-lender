import { calculateDebt } from '../utils/calculations'
import { markAsPaid } from '../utils/storage'
import QRButton from './QRButton'

export default function LoanList({ loans, onUpdate }) {
  if (loans.length === 0) {
    return <p className="text-gray-400 text-center">No hay préstamos activos.</p>
  }

  return (
    <ul className="space-y-3">
      {loans.map(loan => {
        const debt = calculateDebt(loan)
        return (
          <li key={loan.id} className="bg-slate-800 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-semibold">{loan.clientName}</p>
              <p className="text-sm text-gray-400">Deuda: ${debt.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Vence: {loan.dueDate}</p>
            </div>
            <div className="flex gap-2">
              <QRButton loan={loan} />
              <button
                onClick={() => {
                  markAsPaid(loan.id)
                  onUpdate()
                }}
                className="bg-green-600 px-3 py-1 rounded text-sm"
              >
                Pagado
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}