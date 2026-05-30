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
    updateLoan(id, {
      ...form,
      amount: parseFloat(form.amount),
      dailyInterest: parseFloat(form.dailyInterest),
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
      <input className={inputClasses} placeholder="Nombre" value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} required />
      <input className={inputClasses} placeholder="Teléfono" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
      <input type="number" className={inputClasses} placeholder="Monto" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
      <input type="number" step="0.01" className={inputClasses} placeholder="Interés diario (%)" value={form.dailyInterest} onChange={e => setForm({...form, dailyInterest: e.target.value})} required />
      <div className="grid grid-cols-2 gap-4">
        <input type="date" className={inputClasses} value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
        <input type="date" className={inputClasses} value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} required />
      </div>
      <textarea className={inputClasses} placeholder="Notas" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows="2" />
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