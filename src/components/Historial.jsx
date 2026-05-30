import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLoans } from '../utils/storage';
import SearchBar from './SearchBar';

export default function Historial() {
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoans(getLoans().filter(l => l.status === 'pagado').sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt)));
  }, []);

  const filtered = loans.filter(loan =>
    loan.clientName.toLowerCase().includes(search.toLowerCase()) ||
    (loan.phone && loan.phone.includes(search))
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Historial de pagos</h1>
      <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar en historial..." />
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-10">Sin resultados</p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence>
            {filtered.map(loan => (
              <motion.li
                key={loan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4"
              >
                <div className="flex justify-between">
                  <span className="font-bold">{loan.clientName}</span>
                  <span className="text-emerald-400">${loan.amount}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Pagado el {new Date(loan.paidAt).toLocaleDateString()}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}