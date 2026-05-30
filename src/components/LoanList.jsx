import { motion } from 'framer-motion';
import { calculateDebt } from '../utils/calculations';
import { deleteLoan } from '../utils/storage';
import { User, Phone, Edit, Trash2, DollarSign } from 'lucide-react';
import SendButton from './SendButton';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function LoanList({ loans, tab, onEdit, onAddPayment, onUpdate }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (loans.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-5xl mb-4">{tab === 'activos' ? '💸' : '📭'}</p>
        <p className="text-lg">{tab === 'activos' ? 'No hay préstamos activos' : 'No hay préstamos pagados'}</p>
      </div>
    );
  }

  const handleDelete = (id) => {
    deleteLoan(id);
    onUpdate();
    setConfirmDelete(null);
    toast.success('Préstamo eliminado');
  };

  return (
    <ul className="space-y-4">
      {loans.map(loan => {
        const debt = calculateDebt(loan);
        const totalPaid = (loan.payments || []).reduce((sum, p) => sum + p.amount, 0);
        return (
          <motion.li
            key={loan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 space-y-3 shadow-lg hover:border-cyan-400/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <User size={20} className="text-cyan-400" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">{loan.clientName}</p>
                {loan.phone && (
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Phone size={14} />
                    <span>{loan.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-500">Capital: <span className="text-white font-medium">Bs. {loan.amount}</span></p>
                <p className="text-xs text-gray-500">Interés diario: {loan.dailyInterest}%</p>
              </div>
              <div className="text-right">
                {tab === 'activos' ? (
                  <>
                    <p className="text-xs text-gray-500">Deuda actual</p>
                    <p className="text-2xl font-bold text-cyan-300 tabular">Bs. {debt.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Pagado: Bs. {totalPaid.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      Días: {Math.floor((new Date() - new Date(loan.startDate)) / (1000 * 60 * 60 * 24))}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-gray-500">Monto total</p>
                    <p className="text-2xl font-bold text-emerald-300 tabular">Bs. {loan.amount}</p>
                    <p className="text-xs text-gray-500">Pagado: Bs. {totalPaid.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      Pagado el {new Date(loan.paidAt).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
            </div>

            {loan.payments?.length > 0 && (
              <details className="text-xs text-gray-400 mt-2">
                <summary className="cursor-pointer font-medium text-gray-300">Historial de pagos ({loan.payments.length})</summary>
                <ul className="mt-2 pl-4 list-disc space-y-1">
                  {loan.payments.map((p, i) => (
                    <li key={i}>{p.date}: Bs. {p.amount.toFixed(2)}</li>
                  ))}
                </ul>
              </details>
            )}

            {tab === 'activos' && (
              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => onAddPayment(loan)} className="flex items-center gap-1 px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 rounded-xl text-cyan-300 text-sm font-medium transition-all">
                  <DollarSign size={16} /> Pago
                </button>
                <button onClick={() => onEdit(loan)} className="p-2.5 glass rounded-xl hover:bg-white/5">
                  <Edit size={16} className="text-yellow-400" />
                </button>
                <SendButton loan={loan} />
                <button onClick={() => setConfirmDelete(loan.id)} className="p-2.5 glass rounded-xl hover:bg-white/5">
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            )}

            {confirmDelete === loan.id && (
              <div className="flex gap-3 mt-2">
                <button onClick={() => setConfirmDelete(null)} className="text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                <button onClick={() => handleDelete(loan.id)} className="text-sm text-red-400 font-bold hover:text-red-300 transition-colors">Eliminar</button>
              </div>
            )}
          </motion.li>
        );
      })}
    </ul>
  );
}