import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getLoans } from '../utils/storage';
import { calculateDebt } from '../utils/calculations';
import LoanList from './LoanList';
import SearchBar from './SearchBar';
import WeeklySummary from './WeeklySummary';
import { showDueNotification } from '../utils/notifications';
import { PlusCircle, Clock, Download } from 'lucide-react';

export default function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const refreshLoans = () => {
    setLoans(getLoans().filter(l => l.status === 'activo'));
  };

  useEffect(() => {
    refreshLoans();
  }, []);

  const filtered = loans.filter(loan =>
    loan.clientName.toLowerCase().includes(search.toLowerCase()) ||
    (loan.phone && loan.phone.includes(search))
  );

  const totalDebt = filtered.reduce((sum, loan) => sum + calculateDebt(loan), 0);

  const quickActions = [
    { label: 'Nuevo préstamo', icon: PlusCircle, path: '/nuevo', color: 'from-cyan-500 to-blue-600' },
    { label: 'Historial', icon: Clock, path: '/historial', color: 'from-emerald-500 to-green-600' },
    { label: 'Datos', icon: Download, path: '/datos', color: 'from-purple-500 to-pink-600' },
  ];

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
      >
        Pocket Lender
      </motion.h1>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-3 gap-3">
        {quickActions.map(({ label, icon: Icon, path, color }) => (
          <motion.button
            key={path}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(path)}
            className={`bg-gradient-to-r ${color} p-3 rounded-xl text-white font-medium text-sm shadow-lg flex flex-col items-center gap-1`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </motion.button>
        ))}
      </div>

      <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800/50 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 shadow-lg glow-card"
      >
        <p className="text-gray-300 text-sm">Deuda total activa</p>
        <motion.p
          key={totalDebt}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold text-cyan-300"
        >
          Bs. {totalDebt.toFixed(2)}
        </motion.p>
      </motion.div>

      <WeeklySummary loans={filtered} />

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={showDueNotification}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 py-3 rounded-xl font-medium text-white shadow-lg shadow-purple-500/30"
      >
        🔔 Recordar vencimientos de hoy
      </motion.button>

      <LoanList loans={filtered} onUpdate={refreshLoans} />
    </div>
  );
}