import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLoans, saveLoans, addPayment, markAsPaid } from '../utils/storage';
import { calculateDebt } from '../utils/calculations';
import LoanList from './LoanList';
import SearchBar from './SearchBar';
import LoanFormModal from './LoanFormModal';
import EditLoanModal from './EditLoanModal';
import PaymentModal from './PaymentModal';
import { checkAndNotifyDaily } from '../utils/notifications';
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

  const refreshLoans = () => setLoans(getLoans());

  useEffect(() => {
    refreshLoans();
    checkAndNotifyDaily();
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
    <div className="min-h-screen bg-[var(--clr-bg)] p-4 pb-24 relative overflow-hidden">
      {/* Orbes ambientales */}
      <div className="absolute top-[-60px] left-[-20px] w-64 h-64 orb-cyan ambient-orb opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 orb-indigo ambient-orb opacity-20 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold gradient-text"
        >
          Pocket Lender
        </motion.h1>

        {/* Tarjeta de deuda total */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-accent glow-card rounded-3xl p-6 text-center"
        >
          <p className="text-gray-300 text-sm">Deuda total activa</p>
          <p className="text-4xl font-bold text-cyan-300 tabular mt-2">
            Bs. {totalDebt.toFixed(2)}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="glass rounded-2xl p-1.5 flex gap-1">
          <button
            onClick={() => setActiveTab('activos')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'activos' ? 'bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            Activos ({activeLoans.length})
          </button>
          <button
            onClick={() => setActiveTab('pagados')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'pagados' ? 'bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            Pagados ({paidLoans.length})
          </button>
        </div>

        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />

        <LoanList
          loans={filteredLoans}
          tab={activeTab}
          onEdit={setEditingLoan}
          onAddPayment={setPayingLoan}
          onUpdate={refreshLoans}
        />

        {/* Botones flotantes */}
        <div className="fixed bottom-8 right-6 flex flex-col gap-3 z-20">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowNewLoan(true)}
            className="w-16 h-16 glass-accent rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20"
          >
            <PlusCircle size={30} className="text-cyan-300" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowExport(!showExport)}
            className="w-16 h-16 glass rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Upload size={24} className="text-gray-300" />
          </motion.button>
          {showExport && (
            <div className="absolute bottom-20 right-0 glass rounded-2xl p-2 flex flex-col gap-1 min-w-[160px] shadow-xl">
              <button onClick={handleExport} className="text-left px-4 py-2 hover:bg-white/5 rounded-xl text-white text-sm">
                📤 Exportar JSON
              </button>
              <label className="text-left px-4 py-2 hover:bg-white/5 rounded-xl text-white text-sm cursor-pointer">
                📥 Importar JSON
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
          )}
        </div>

        {/* Modales */}
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
    </div>
  );
}