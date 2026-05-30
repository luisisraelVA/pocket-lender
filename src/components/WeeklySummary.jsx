import { motion } from 'framer-motion';
import { calculateDebt } from '../utils/calculations';

export default function WeeklySummary({ loans }) {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);

  const activeThisWeek = loans.filter(loan => new Date(loan.startDate) >= weekAgo).length;
  const paidThisWeek = loans.filter(loan => loan.status === 'pagado' && new Date(loan.paidAt) >= weekAgo).length;

  // Datos para gráfico: préstamos activos por día (simulado con días desde inicio)
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const todayIndex = (today.getDay() + 6) % 7; // Lunes=0
  const countByDay = Array(7).fill(0);
  loans.forEach(loan => {
    const start = new Date(loan.startDate);
    const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 7) {
      countByDay[(todayIndex - diffDays + 7) % 7]++;
    }
  });

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-slate-800/50 backdrop-blur-md border border-slate-700/40 rounded-2xl p-5 space-y-4"
    >
      <h2 className="text-lg font-semibold text-white">Última semana</h2>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Nuevos activos: <span className="text-cyan-300">{activeThisWeek}</span></span>
        <span className="text-gray-400">Pagados: <span className="text-emerald-400">{paidThisWeek}</span></span>
      </div>

      {/* Gráfico de barras minimalista */}
      <div className="flex items-end justify-between h-20 mt-2">
        {countByDay.map((count, i) => (
          <div key={i} className="flex flex-col items-center gap-1 w-full">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(count / Math.max(...countByDay, 1)) * 80}%` }}
              className="w-4 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-t-sm"
              style={{ minHeight: 2 }}
            />
            <span className="text-xs text-gray-500">{days[i]}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}