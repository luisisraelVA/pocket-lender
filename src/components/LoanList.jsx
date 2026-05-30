import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateDebt } from '../utils/calculations';
import { markAsPaid, deleteLoan } from '../utils/storage';
import QRButton from './QRButton';
import { User, Phone, Edit, Trash2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function LoanList({ loans, onUpdate }) {
  const navigate = useNavigate();
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'pay'|'delete', id }

  if (loans.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-5xl mb-4">💸</p>
        <p className="text-gray-400 text-lg">No hay préstamos activos</p>
      </motion.div>
    );
  }

  const handleSwipe = (loanId) => {
    setConfirmAction({ type: 'pay', id: loanId });
  };

  const confirmPay = (loanId) => {
    markAsPaid(loanId);
    onUpdate();
    setConfirmAction(null);
    toast.success('Marcado como pagado', { icon: '✅' });
  };

  const confirmDelete = (loanId) => {
    deleteLoan(loanId);
    onUpdate();
    setConfirmAction(null);
    toast.success('Préstamo eliminado', { icon: '🗑️' });
  };

  const cancelAction = () => {
    setConfirmAction(null);
  };

  return (
    <>
      <ul className="space-y-4">
        <AnimatePresence>
          {loans.map(loan => {
            const debt = calculateDebt(loan);
            return (
              <motion.li
                key={loan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden shadow-md hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex-1">
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
                  <div className="flex justify-between items-end mt-2">
                    <div>
                      <p className="text-xs text-gray-500">
                        Deuda: <span className="text-cyan-300 font-bold">Bs. {debt.toFixed(2)}</span>
                      </p>
                      <p className="text-xs text-gray-500">Vence: {loan.dueDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/editar/${loan.id}`)}
                        className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        <Edit size={14} className="text-yellow-400" />
                      </button>
                      <QRButton loan={loan} />
                      <button
                        onClick={() => setConfirmAction({ type: 'pay', id: loan.id })}
                        className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        <CheckCircle size={14} className="text-emerald-400" />
                      </button>
                      <button
                        onClick={() => setConfirmAction({ type: 'delete', id: loan.id })}
                        className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {/* Modal de confirmación */}
      {confirmAction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 m-4 max-w-sm w-full shadow-2xl"
          >
            <p className="text-white text-lg font-semibold mb-2">
              {confirmAction.type === 'pay' ? 'Marcar como pagado' : 'Eliminar préstamo'}
            </p>
            <p className="text-gray-400 text-sm mb-6">
              {confirmAction.type === 'pay'
                ? '¿Estás seguro de que quieres marcar este préstamo como pagado?'
                : '¿Estás seguro de que quieres eliminar este préstamo? Esta acción no se puede deshacer.'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelAction}
                className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  confirmAction.type === 'pay'
                    ? confirmPay(confirmAction.id)
                    : confirmDelete(confirmAction.id)
                }
                className={`px-4 py-2 rounded-xl text-white font-medium ${
                  confirmAction.type === 'pay'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                    : 'bg-gradient-to-r from-red-500 to-pink-600'
                }`}
              >
                {confirmAction.type === 'pay' ? 'Pagar' : 'Eliminar'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}