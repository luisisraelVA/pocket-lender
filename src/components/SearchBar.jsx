import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchBar({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyan-400 transition-all"
      />
    </motion.div>
  );
}