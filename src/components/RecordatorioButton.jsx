import { motion } from 'framer-motion';
import { calculateDebt } from '../utils/calculations';
import toast from 'react-hot-toast';

export default function RecordatorioButton({ loan }) {
  const enviarRecordatorio = () => {
    const debt = calculateDebt(loan).toFixed(2);
    const mensaje = `Recordatorio de pago\nHola ${loan.clientName}, tu deuda actual es Bs. ${debt}\nGracias por estar al día.`;
    window.open(`https://wa.me/${loan.phone.replace('+', '')}?text=${encodeURIComponent(mensaje)}`, '_blank');
    toast.success(`Recordatorio para ${loan.clientName} abierto en WhatsApp`);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      onClick={enviarRecordatorio}
      className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-xl font-medium text-sm shadow-lg shadow-purple-500/30 flex items-center gap-1"
    >
      📨 Recordar
    </motion.button>
  );
}