import { motion } from 'framer-motion';
import { calculateDebt } from '../utils/calculations';
import { deleteLoan } from '../utils/storage';
import { User, Phone, Edit, Trash2, DollarSign, Send } from 'lucide-react';
import QRButton from './QRButton';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function LoanList({ loans, tab, onEdit, onAddPayment, onUpdate }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (loans.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <p className="text-5xl mb-4">{tab === 'activos' ? '💸' : '📭'}</p>
        <p className="text-gray-400 text-lg">
          {tab === 'activos' ? 'No hay préstamos activos' : 'No hay préstamos pagados'}
        </p>
      </motion.div>
    );
  }

  const handleDelete = (id) => {
    deleteLoan(id);
    onUpdate();
    setConfirmDelete(null);
    toast.success('Préstamo eliminado');
  };

  const enviarRecordatorio = (loan) => {
    const debt = calculateDebt(loan).toFixed(2);
    const mensaje = `Recordatorio de pago\nHola ${loan.clientName}, tu deuda actual es Bs. ${debt}\nGracias por estar al día.`;
    window.open(`https://wa.me/${loan.phone.replace('+', '')}?text=${encodeURIComponent(mensaje)}`, '_blank');
    toast.success(`Recordatorio para ${loan.clientName} abierto en WhatsApp`);
  };

  return (
    <ul className="space-y-4">
      {loans.map(loan => {
        const debt = calculateDebt(loan);
        const totalPaid = (loan.payments || []).reduce((sum, p) => sum + p.amount, 0);
        return (
          <motion.li
            key={loan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              <User size={16} className="text-cyan-400" />
              <span className="font-bold text-white">{loan.clientName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Phone size={14} />
              <span>{loan.phone}</span>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500">
                  Capital: <span className="text-white">Bs. {loan.amount}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Interés diario: {loan.dailyInterest}%
                </p>
              </div>
              <div className="text-right">
                {tab === 'activos' ? (
                  <>
                    <p className="text-xs text-gray-500">Deuda actual</p>
                    <p className="text-lg font-bold text-cyan-300">Bs. {debt.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Pagado: Bs. {totalPaid.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      Días: {Math.floor((new Date() - new Date(loan.startDate)) / (1000 * 60 * 60 * 24))}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-gray-500">Monto total</p>
                    <p className="text-lg font-bold text-emerald-400">Bs. {loan.amount}</p>
                    <p className="text-xs text-gray-500">
                      Pagado: Bs. {totalPaid.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Pagado el {new Date(loan.paidAt).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
            </div>

            {loan.payments?.length > 0 && (
              <details className="text-xs text-gray-400">
                <summary className="cursor-pointer">Historial de pagos ({loan.payments.length})</summary>
                <ul className="mt-1 pl-4 list-disc">
                  {loan.payments.map((p, i) => (
                    <li key={i}>
                      {p.date}: Bs. {p.amount.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {tab === 'activos' && (
              <div className="flex gap-2 pt-2 flex-wrap">
                <button
                  onClick={() => onAddPayment(loan)}
                  className="flex items-center gap-1 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-xs text-white"
                >
                  <DollarSign size={14} /> Pago
                </button>
                <button
                  onClick={() => onEdit(loan)}
                  className="p-1.5 bg-slate-700/50 rounded-lg hover:bg-slate-600"
                >
                  <Edit size={14} className="text-yellow-400" />
                </button>
                <QRButton loan={loan} />
                <button
                  onClick={() => enviarRecordatorio(loan)}
                  className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs text-white"
                >
                  <Send size={14} /> Recordar
                </button>
                <button
                  onClick={() => setConfirmDelete(loan.id)}
                  className="p-1.5 bg-slate-700/50 rounded-lg hover:bg-slate-600"
                >
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            )}

            {confirmDelete === loan.id && (
              <div className="flex gap-2 mt-2">
                <button onClick={() => setConfirmDelete(null)} className="text-xs text-gray-400">Cancelar</button>
                <button onClick={() => handleDelete(loan.id)} className="text-xs text-red-400 font-bold">Eliminar</button>
              </div>
            )}
          </motion.li>
        );
      })}
    </ul>
  );
}