import { useState } from 'react';
import { motion } from 'framer-motion';
import { calculateDebt } from '../utils/calculations';
import toast from 'react-hot-toast';

export default function PaymentModal({ loan, onClose, onPaid }) {
  const [amount, setAmount] = useState(loan.dailyQuota?.toFixed(2) || '0');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState('efectivo');

  const maxAmount = calculateDebt(loan); // solo valida que no supere el saldo pendiente

  const handleSubmit = (e) => {
    e.preventDefault();
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast.error('Monto inválido');
      return;
    }
    if (paymentAmount > maxAmount) {
      toast.error(`El saldo pendiente es Bs. ${maxAmount.toFixed(2)}. No puedes pagar más.`);
      return;
    }
    onPaid(loan.id, { amount: paymentAmount, date, method });
    onClose();
  };

  const inputClass = "form-input w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/50 transition-all text-base";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="glass rounded-3xl p-6 w-full max-w-xs border border-white/10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-white mb-3">Registrar pago</h3>
        <p className="text-sm text-gray-400 mb-2">{loan.clientName}</p>
        <p className="text-xs text-gray-500 mb-3">
          Cuota sugerida: <span className="text-cyan-300 font-bold">Bs. {loan.dailyQuota?.toFixed(2)}</span> | Saldo: Bs. {maxAmount.toFixed(2)}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Monto (Bs.)</label>
            <input type="number" step="0.01" className={inputClass} value={amount} onChange={e => setAmount(e.target.value)} required autoFocus />
          </div>
          <div>
            <label className="text-sm text-gray-300">Fecha</label>
            <input type="date" className={inputClass} value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-gray-300">Método de pago</label>
            <div className="flex gap-2 mt-1">
              <button type="button" onClick={() => setMethod('efectivo')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${method === 'efectivo' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' : 'bg-white/5 text-gray-400'}`}>Efectivo</button>
              <button type="button" onClick={() => setMethod('qr')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${method === 'qr' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' : 'bg-white/5 text-gray-400'}`}>QR</button>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 glass rounded-xl text-white font-semibold hover:bg-white/10 transition-all text-sm">Cancelar</button>
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold shadow-lg shadow-cyan-500/25 transition-all text-sm">Guardar</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}