import { useState } from 'react';
import { motion } from 'framer-motion';
import { addLoan } from '../utils/storage';
import { generateId } from '../utils/calculations';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

export default function LoanFormModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    clientName: '',
    phone: '',
    amount: '',
    dailyInterest: '',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    const dailyInterest = parseFloat(form.dailyInterest);

    if (!form.clientName.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      toast.error('Monto mayor a 0');
      return;
    }
    if (isNaN(dailyInterest) || dailyInterest < 0 || dailyInterest > 100) {
      toast.error('Interés diario entre 0% y 100%');
      return;
    }

    const loan = {
      id: generateId(),
      clientName: form.clientName.trim(),
      phone: `+591${form.phone.trim()}`,
      amount,
      dailyInterest,
      startDate: form.startDate,
      notes: form.notes.trim(),
      status: 'activo',
      payments: [],
      createdAt: new Date().toISOString(),
    };
    addLoan(loan);
    toast.success('Préstamo creado');

    // Preguntar si desea enviar QR ahora
    if (window.confirm('¿Deseas enviar el QR al cliente ahora?')) {
      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, `Préstamo de ${loan.clientName}\nDeuda: Bs. ${loan.amount}\nInterés diario: ${loan.dailyInterest}%`, { width: 400 });
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], `prestamo-${loan.clientName}.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Nuevo préstamo',
          text: `Hola ${loan.clientName}, te he registrado un préstamo.`,
        });
      } else {
        window.open(`https://wa.me/${loan.phone.replace('+', '')}?text=${encodeURIComponent(`Hola ${loan.clientName}, te he registrado un préstamo.`)}`, '_blank');
      }
    }

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
        exit={{ scale: 0.8 }}
        className="bg-slate-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-4">Nuevo préstamo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Nombre *</label>
            <input className={inputClasses} placeholder="Juan Pérez" value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm text-gray-300">Teléfono</label>
            <div className="flex items-center">
              <span className="bg-slate-700 px-3 py-3 rounded-l-xl text-gray-300">+591</span>
              <input className={`${inputClasses} rounded-l-none`} placeholder="4121234567" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-300">Monto (Bs.) *</label>
            <input type="number" step="0.01" min="0.01" className={inputClasses} placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm text-gray-300">Interés diario (%) *</label>
            <input type="number" step="0.01" min="0" max="100" className={inputClasses} placeholder="5" value={form.dailyInterest} onChange={e => setForm({...form, dailyInterest: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm text-gray-300">Fecha de inicio</label>
            <input type="date" className={inputClasses} value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
          </div>
          <div>
            <label className="text-sm text-gray-300">Notas</label>
            <textarea className={inputClasses} placeholder="Opcional" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows="2" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors">Cancelar</button>
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold shadow-lg">Guardar</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}