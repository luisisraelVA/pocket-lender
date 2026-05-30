import { useState } from 'react';
import { motion } from 'framer-motion';
import { updateLoan } from '../utils/storage';
import toast from 'react-hot-toast';

export default function EditLoanModal({ loan, onClose, onSaved }) {
  const [form, setForm] = useState({
    clientName: loan.clientName,
    phone: loan.phone.replace('+591', ''),
    capital: loan.capital.toString(),
    interestRate: loan.interestRate.toString(),
    days: loan.days.toString(),
    startDate: loan.startDate,
    dailyQuota: loan.dailyQuota?.toString() || '',
    notes: loan.notes || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const capital = parseFloat(form.capital);
    const interestRate = parseFloat(form.interestRate);
    const days = parseInt(form.days);
    if (!form.clientName.trim()) { toast.error('Nombre obligatorio'); return; }
    if (isNaN(capital) || capital <= 0) { toast.error('Capital > 0'); return; }
    if (isNaN(interestRate) || interestRate < 0 || interestRate > 100) { toast.error('Interés 0-100%'); return; }
    if (isNaN(days) || days <= 0) { toast.error('Días > 0'); return; }

    const interestAmount = capital * interestRate / 100;
    const disbursedAmount = capital - interestAmount;
    const dailyQuota = parseFloat(form.dailyQuota) || capital / days;
    const dueDate = new Date(form.startDate);
    dueDate.setDate(dueDate.getDate() + days);

    updateLoan(loan.id, {
      clientName: form.clientName.trim(),
      phone: `+591${form.phone.trim()}`,
      capital,
      interestRate,
      interestAmount,
      disbursedAmount,
      dailyQuota,
      days,
      startDate: form.startDate,
      dueDate: dueDate.toISOString().split('T')[0],
      notes: form.notes.trim(),
    });
    toast.success('Actualizado');
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
        className="glass rounded-3xl p-6 w-full max-w-md border border-white/10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-6 gradient-text">Editar préstamo</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-300 ml-1">Nombre *</label>
            <input className={inputClass} value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm text-gray-300 ml-1">Teléfono</label>
            <div className="flex">
              <span className="bg-white/5 border border-white/10 border-r-0 rounded-l-2xl px-4 py-4 text-gray-300">+591</span>
              <input className={`${inputClass} rounded-l-none`} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 ml-1">Capital (Bs.)</label>
              <input type="number" step="0.01" className={inputClass} value={form.capital} onChange={e => setForm({...form, capital: e.target.value})} required />
            </div>
            <div>
              <label className="text-sm text-gray-300 ml-1">Interés (%)</label>
              <input type="number" step="0.01" className={inputClass} value={form.interestRate} onChange={e => setForm({...form, interestRate: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 ml-1">Días plazo</label>
              <input type="number" className={inputClass} value={form.days} onChange={e => setForm({...form, days: e.target.value})} required />
            </div>
            <div>
              <label className="text-sm text-gray-300 ml-1">Fecha inicio</label>
              <input type="date" className={inputClass} value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-300 ml-1">Cuota diaria sugerida</label>
            <input
              type="number"
              step="0.01"
              className={inputClass}
              placeholder={form.capital && form.days ? (parseFloat(form.capital) / parseInt(form.days)).toFixed(2) : 'Calculada automáticamente'}
              value={form.dailyQuota}
              onChange={e => setForm({...form, dailyQuota: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 ml-1">Notas</label>
            <textarea className={inputClass} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows="2" />
          </div>
          {form.capital && form.interestRate && form.days && (
            <div className="bg-white/5 rounded-2xl p-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-400">Nueva cuota diaria:</span><span className="text-cyan-300 font-bold">Bs. {form.dailyQuota ? parseFloat(form.dailyQuota).toFixed(2) : (parseFloat(form.capital)/parseInt(form.days)).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Vencimiento:</span><span className="text-cyan-300">{(() => { const d = new Date(form.startDate); d.setDate(d.getDate() + parseInt(form.days)); return d.toLocaleDateString(); })()}</span></div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-4 glass rounded-2xl text-white font-semibold hover:bg-white/10 transition-all">Cancelar</button>
            <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl text-white font-bold shadow-lg shadow-yellow-500/25 transition-all">Guardar</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}