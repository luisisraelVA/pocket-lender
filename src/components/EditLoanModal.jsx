import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { updateLoan } from '../utils/storage';
import toast from 'react-hot-toast';

export default function EditLoanModal({ loan, onClose, onSaved }) {
  const [form, setForm] = useState({ ...loan, phone: loan.phone.replace('+591', '') });

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    const dailyInterest = parseFloat(form.dailyInterest);
    if (!form.clientName.trim()) {
      toast.error('Nombre obligatorio');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      toast.error('Monto > 0');
      return;
    }
    if (isNaN(dailyInterest) || dailyInterest < 0 || dailyInterest > 100) {
      toast.error('Interés 0-100%');
      return;
    }

    updateLoan(loan.id, {
      ...form,
      phone: `+591${form.phone.trim()}`,
      amount,
      dailyInterest,
    });
    toast.success('Actualizado');
    onSaved();
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
        className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-4">Editar préstamo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Nombre *</label>
            <input className={inputClasses} value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm text-gray-300">Teléfono</label>
            <div className="flex">
              <span className="bg-slate-700 px-3 py-3 rounded-l-xl text-gray-300">+591</span>
              <input className={`${inputClasses} rounded-l-none`} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-300">Monto (Bs.) *</label>
            <input type="number" step="0.01" className={inputClasses} value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm text-gray-300">Interés diario (%) *</label>
            <input type="number" step="0.01" min="0" max="100" className={inputClasses} value={form.dailyInterest} onChange={e => setForm({...form, dailyInterest: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm text-gray-300">Fecha inicio</label>
            <input type="date" className={inputClasses} value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
          </div>
          <div>
            <label className="text-sm text-gray-300">Notas</label>
            <textarea className={inputClasses} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows="2" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl">Cancelar</button>
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl font-bold">Guardar</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}