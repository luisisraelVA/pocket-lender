import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateDebt } from '../utils/calculations';
import { markAsPaid } from '../utils/storage';
import QRButton from './QRButton';
import { User, Phone, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function LoanList({ loans, onUpdate }) {
  const navigate = useNavigate();

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
    markAsPaid(loanId);
    onUpdate();
    toast.success('Marcado como pagado', { icon: '✅' });
  };

  return (
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
              drag="x"
              dragConstraints={{ left: -80, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) handleSwipe(loan.id);
              }}
              className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden shadow-md hover:border-cyan-500/30 transition-colors"
            >
              {/* Indicador de "deslizar para pagar" */}
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-emerald-500 to-transparent flex items-center justify-end pr-2 opacity-0 pointer-events-none">
                <Trash2 className="text-white" size={20} />
              </div>

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
                    <p className="text-xs text-gray-500">Deuda: <span className="text-cyan-300 font-bold">${debt.toFixed(2)}</span></p>
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
                  </div>
                </div>
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}