import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLoans, saveLoans, addPayment, markAsPaid } from '../utils/storage';
import { calculateDebt } from '../utils/calculations';
import LoanList from './LoanList';
import SearchBar from './SearchBar';
import LoanFormModal from './LoanFormModal';
import EditLoanModal from './EditLoanModal';
import PaymentModal from './PaymentModal';
import { showDueNotification } from '../utils/notifications';
import { PlusCircle, Download, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('activos');
  const [showNewLoan, setShowNewLoan] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [payingLoan, setPayingLoan] = useState(null);
  const [showExport, setShowExport] = useState(false);

  const refreshLoans = () => {
    setLoans(getLoans());
  };

  useEffect(() => {
    refreshLoans();
  }, []);

  const activeLoans = loans.filter(l => l.status === 'activo');
  const paidLoans = loans.filter(l => l.status === 'pagado');

  const filteredLoans = (activeTab === 'activos' ? activeLoans : paidLoans).filter(loan =>
    loan.clientName.toLowerCase().includes(search.toLowerCase()) ||
    (loan.phone && loan.phone.includes(search))
  );

  const totalDebt = activeLoans.reduce((sum, loan) => sum + calculateDebt(loan), 0);

  const handleAddPayment = (loanId, amount, date) => {
    addPayment(loanId, { amount: parseFloat(amount), date });
    refreshLoans();
    toast.success(`Pago de Bs. ${amount} registrado`);
    // Marcar automáticamente si la deuda queda en 0
    const updatedLoans = getLoans();
    const loan = updatedLoans.find(l => l.id === loanId);
    if (loan && calculateDebt(loan) <= 0) {
      markAsPaid(loanId);
      refreshLoans();
      toast.success('¡Préstamo completado!', { icon: '✅' });
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(loans, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prestamos-backup.json';
    a.click();
    setShowExport(false);
    toast.success('Datos exportados');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          saveLoans(imported);
          refreshLoans();
          toast.success('Datos importados correctamente');
        }
      } catch (err) {
        toast.error('Archivo inválido');
      }
    };
    reader.readAsText(file);
    setShowExport(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 p-4 space-y-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
      >
        Pocket Lender
      </motion.h1>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800/50 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 shadow-lg glow-card"
      >
        <p className="text-gray-300 text-sm">Deuda total activa</p>
        <p className="text-3xl font-bold text-cyan-300">Bs. {totalDebt.toFixed(2)}</p>
      </motion.div>

      <div className="flex gap-2 bg-slate-800/50 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('activos')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'activos' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Activos ({activeLoans.length})
        </button>
        <button
          onClick={() => setActiveTab('pagados')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'pagados' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Pagados ({paidLoans.length})
        </button>
      </div>

      <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={showDueNotification}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 py-2 rounded-xl font-medium text-white shadow-lg shadow-purple-500/30 text-sm"
      >
        🔔 Recordar vencimientos de hoy
      </motion.button>

      <LoanList
        loans={filteredLoans}
        tab={activeTab}
        onEdit={(loan) => setEditingLoan(loan)}
        onAddPayment={(loan) => setPayingLoan(loan)}
        onUpdate={refreshLoans}
      />

      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowNewLoan(true)}
          className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/30 flex items-center justify-center"
        >
          <PlusCircle size={28} className="text-white" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowExport(!showExport)}
          className="w-14 h-14 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full shadow-lg flex items-center justify-center"
        >
          <Upload size={22} className="text-white" />
        </motion.button>
        {showExport && (
          <div className="absolute bottom-16 right-0 bg-slate-800 rounded-xl p-2 shadow-xl border border-slate-700 flex flex-col gap-1">
            <button onClick={handleExport} className="text-left px-3 py-2 hover:bg-slate-700 rounded-lg text-white text-sm">
              📤 Exportar JSON
            </button>
            <label className="text-left px-3 py-2 hover:bg-slate-700 rounded-lg text-white text-sm cursor-pointer">
              📥 Importar JSON
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showNewLoan && (
          <LoanFormModal
            onClose={() => setShowNewLoan(false)}
            onSaved={() => { setShowNewLoan(false); refreshLoans(); }}
          />
        )}
        {editingLoan && (
          <EditLoanModal
            loan={editingLoan}
            onClose={() => setEditingLoan(null)}
            onSaved={() => { setEditingLoan(null); refreshLoans(); }}
          />
        )}
        {payingLoan && (
          <PaymentModal
            loan={payingLoan}
            onClose={() => setPayingLoan(null)}
            onPaid={handleAddPayment}
          />
        )}
      </AnimatePresence>
    </div>
  );
}