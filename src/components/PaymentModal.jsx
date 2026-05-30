import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PaymentModal({ loan, onClose, onPaid }) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      alert('Monto inválido');
      return;
    }
    onPaid(loan.id, amount, date);
    onClose();
  };

  const inputClasses = "w-full bg-slate-800/70 border border-slate-700/50 focus:border-cyan-400 rounded-xl p-3 text-white placeholder-gray-500 outline-none";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-slate-800 rounded-2xl p-6 w-full max-w-xs border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-white mb-3">Registrar pago</h3>
        <p className="text-sm text-gray-400 mb-4">{loan.clientName}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Monto (Bs.)</label>
            <input type="number" step="0.01" className={inputClasses} value={amount} onChange={e => setAmount(e.target.value)} required autoFocus />
          </div>
          <div>
            <label className="text-sm text-gray-300">Fecha</label>
            <input type="date" className={inputClasses} value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm">Cancelar</button>
            <button type="submit" className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-sm">Guardar</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}