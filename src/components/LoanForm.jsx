import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { addLoan } from '../utils/storage';
import { generateId } from '../utils/calculations';
import toast from 'react-hot-toast';

export default function LoanForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    clientName: '',
    phone: '',
    amount: '',
    dailyInterest: '',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    const amount = parseFloat(form.amount);
    const dailyInterest = parseFloat(form.dailyInterest);
    const startDate = new Date(form.startDate);
    const dueDate = new Date(form.dueDate);

    if (!form.clientName.trim()) {
      toast.error('El nombre del cliente es obligatorio');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      toast.error('El monto debe ser un número mayor a 0');
      return;
    }
    if (isNaN(dailyInterest) || dailyInterest < 0 || dailyInterest > 100) {
      toast.error('El interés diario debe estar entre 0% y 100%');
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

    const loan = {
      id: generateId(),
      clientName: form.clientName.trim(),
      phone: form.phone.trim(),
      amount,
      dailyInterest,
      startDate: form.startDate,
      dueDate: form.dueDate,
      notes: form.notes.trim(),
      status: 'activo',
      createdAt: new Date().toISOString(),
    };

    addLoan(loan);
    toast.success('Préstamo registrado con éxito');
    navigate('/');
  };

  const inputClasses = "w-full bg-slate-800/70 border border-slate-700/50 focus:border-cyan-400 rounded-xl p-3 text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-cyan-400/30";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto"
    >
      <h1 className="text-2xl font-bold text-white">Nuevo préstamo</h1>

      <div>
        <label className="text-sm text-gray-300 block mb-1">Nombre del cliente *</label>
        <input
          className={inputClasses}
          placeholder="Ej: Juan Pérez"
          value={form.clientName}
          onChange={e => setForm({ ...form, clientName: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-300 block mb-1">Teléfono</label>
        <input
          className={inputClasses}
          placeholder="0412-1234567"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm text-gray-300 block mb-1">Monto (Bs.) *</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          className={inputClasses}
          placeholder="0.00"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-300 block mb-1">Interés diario (%) *</label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="100"
          className={inputClasses}
          placeholder="Ej: 5"
          value={form.dailyInterest}
          onChange={e => setForm({ ...form, dailyInterest: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-300 block mb-1">Fecha de inicio</label>
          <input
            type="date"
            className={inputClasses}
            value={form.startDate}
            onChange={e => setForm({ ...form, startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-gray-300 block mb-1">Vencimiento *</label>
          <input
            type="date"
            className={inputClasses}
            value={form.dueDate}
            onChange={e => setForm({ ...form, dueDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-300 block mb-1">Notas (opcional)</label>
        <textarea
          className={inputClasses}
          placeholder="Detalles adicionales..."
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
          rows="2"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/30"
      >
        Guardar préstamo
      </motion.button>
    </motion.form>
  );
}