import { motion, AnimatePresence } from 'framer-motion'
import { calculateDebt } from '../utils/calculations'
import { markAsPaid } from '../utils/storage'
import QRButton from './QRButton'
import { User, Phone } from 'lucide-react'

export default function LoanList({ loans, onUpdate }) {
  if (loans.length === 0) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-400 text-center py-10"
      >
        No hay préstamos activos 🎉
      </motion.p>
    )
  }

  return (
    <ul className="space-y-4">
      <AnimatePresence>
        {loans.map(loan => {
          const debt = calculateDebt(loan)
          return (
            <motion.li
              key={loan.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: 'spring', stiffness: 150 }}
              className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-4 flex flex-col gap-2 shadow-md hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-cyan-400" />
                    <span className="font-bold text-white">{loan.clientName}</span>
                  </div>
                  {loan.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <Phone size={14} />
                      <span>{loan.phone}</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Deuda</p>
                  <p className="text-lg font-bold text-cyan-300">${debt.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Vence: {loan.dueDate}</span>
                <span>{Math.floor((new Date() - new Date(loan.startDate)) / (1000 * 60 * 60 * 24))} días</span>
              </div>
              <div className="flex gap-2 mt-2">
                <QRButton loan={loan} />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    markAsPaid(loan.id)
                    onUpdate()
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white py-2 rounded-xl font-medium text-sm transition-all shadow-lg shadow-green-500/20"
                >
                  Marcar pagado
                </motion.button>
              </div>
            </motion.li>
          )
        })}
      </AnimatePresence>
    </ul>
  )
}