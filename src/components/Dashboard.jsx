import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLoans } from '../utils/storage';
import { calculateDebt } from '../utils/calculations';
import LoanList from './LoanList';
import SearchBar from './SearchBar';
import WeeklySummary from './WeeklySummary';

export default function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState('');

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

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
      >
        Pocket Lender
      </motion.h1>

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
          ${totalDebt.toFixed(2)}
        </motion.p>
      </motion.div>

      <WeeklySummary loans={filtered} />

      <LoanList loans={filtered} onUpdate={refreshLoans} />
    </div>
  );
}