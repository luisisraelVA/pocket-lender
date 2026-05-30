import { useState } from 'react';
import { motion } from 'framer-motion';
import { addLoan } from '../utils/storage';
import { generateId } from '../utils/calculations';
import toast from 'react-hot-toast';

export default function LoanFormModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    clientName: '',
    phone: '',
    amount: '',
    dailyInterest: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    const dailyInterest = parseFloat(form.dailyInterest);

    if (!form.clientName.trim()) { toast.error('Nombre obligatorio'); return; }
    if (isNaN(amount) || amount <= 0) { toast.error('Monto > 0'); return; }
    if (isNaN(dailyInterest) || dailyInterest < 0 || dailyInterest > 100) { toast.error('Interés 0-100%'); return; }

    const loan = {
      id: generateId(),
      clientName: form.clientName.trim(),
      phone: `+591${form.phone.trim()}`,
      amount,
      dailyInterest,
      startDate: new Date().toISOString().split('T')[0],
      notes: form.notes.trim(),
      status: 'activo',
      payments: [],
      createdAt: new Date().toISOString(),
    };
    addLoan(loan);
    toast.success('Préstamo creado');
    onSaved();
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
        className="glass rounded-3xl p-6 w-full max-w-md border border-white/10 shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-6 gradient-text">Nuevo préstamo</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-300 ml-1">Nombre *</label>
            <input className={inputClass} placeholder="Juan Pérez" value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm text-gray-300 ml-1">Teléfono</label>
            <div className="flex">
              <span className="bg-white/5 border border-white/10 border-r-0 rounded-l-2xl px-4 py-4 text-gray-300">+591</span>
              <input className={`${inputClass} rounded-l-none`} placeholder="4121234567" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-300 ml-1">Monto (Bs.) *</label>
            <input type="number" step="0.01" className={inputClass} placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm text-gray-300 ml-1">Interés diario (%) *</label>
            <input type="number" step="0.01" min="0" max="100" className={inputClass} placeholder="5" value={form.dailyInterest} onChange={e => setForm({...form, dailyInterest: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm text-gray-300 ml-1">Notas</label>
            <textarea className={inputClass} placeholder="Opcional" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows="2" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-4 glass rounded-2xl text-white font-semibold hover:bg-white/10 transition-all">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all">
              Guardar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}