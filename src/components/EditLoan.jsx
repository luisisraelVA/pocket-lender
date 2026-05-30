import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLoans, updateLoan } from '../utils/storage';
import toast from 'react-hot-toast';

export default function EditLoan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const loan = getLoans().find(l => l.id === id);
    if (loan) {
      setForm({
        clientName: loan.clientName,
        phone: loan.phone || '',
        amount: loan.amount.toString(),
        dailyInterest: loan.dailyInterest.toString(),
        startDate: loan.startDate,
        dueDate: loan.dueDate,
        notes: loan.notes || '',
      });
    } else {
      toast.error('Préstamo no encontrado');
      navigate('/');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const amount = parseFloat(form.amount);
    const dailyInterest = parseFloat(form.dailyInterest);
    const startDate = new Date(form.startDate);
    const dueDate = new Date(form.dueDate);

    if (!form.clientName.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }
    if (isNaN(dailyInterest) || dailyInterest < 0 || dailyInterest > 100) {
      toast.error('Interés diario entre 0% y 100%');
      return;
    }
    if (!form.dueDate) {
      toast.error('La fecha de vencimiento es obligatoria');
      return;
    }
    if (dueDate <= startDate) {
      toast.error('La fecha de vencimiento debe ser posterior a la de inicio');
      return;
    }

    updateLoan(id, {
      ...form,
      amount,
      dailyInterest,
    });
    toast.success('Préstamo actualizado');
    navigate('/');
  };

  if (!form) return <div className="text-center py-20 text-gray-400">Cargando...</div>;

  const inputClasses = "w-full bg-slate-800/70 border border-slate-700/50 focus:border-cyan-400 rounded-xl p-3 text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-cyan-400/30";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto"
    >
      <h1 className="text-2xl font-bold text-white">Editar préstamo</h1>
      <div>
        <label className="text-sm text-gray-300 block mb-1">Nombre *</label>
        <input className={inputClasses} value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} required />
      </div>
      <div>
        <label className="text-sm text-gray-300 block mb-1">Teléfono</label>
        <input className={inputClasses} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
      </div>
      <div>
        <label className="text-sm text-gray-300 block mb-1">Monto (Bs.) *</label>
        <input type="number" step="0.01" min="0.01" className={inputClasses} value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
      </div>
      <div>
        <label className="text-sm text-gray-300 block mb-1">Interés diario (%) *</label>
        <input type="number" step="0.01" min="0" max="100" className={inputClasses} value={form.dailyInterest} onChange={e => setForm({...form, dailyInterest: e.target.value})} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-300 block mb-1">Inicio</label>
          <input type="date" className={inputClasses} value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
        </div>
        <div>
          <label className="text-sm text-gray-300 block mb-1">Vencimiento *</label>
          <input type="date" className={inputClasses} value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} required />
        </div>
      </div>
      <div>
        <label className="text-sm text-gray-300 block mb-1">Notas</label>
        <textarea className={inputClasses} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows="2" />
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 py-3 rounded-xl font-bold text-white shadow-lg shadow-yellow-500/30"
      >
        Guardar cambios
      </motion.button>
    </motion.form>
  );
}