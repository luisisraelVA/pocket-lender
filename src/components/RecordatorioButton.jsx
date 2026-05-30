import { motion } from 'framer-motion';
import QRCode from 'qrcode';
import { calculateDebt } from '../utils/calculations';
import toast from 'react-hot-toast';

export default function RecordatorioButton({ loan, onComplete }) {
  const enviarRecordatorio = async () => {
    const debt = calculateDebt(loan).toFixed(2);
    const mensaje = `Recordatorio de pago\nHola ${loan.clientName}, tu deuda actual es Bs. ${debt}\nGracias por estar al día.`;
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, mensaje, { width: 400 });

    canvas.toBlob(async (blob) => {
      const file = new File([blob], `recordatorio-${loan.clientName}.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Recordatorio de pago',
          text: mensaje,
        });
        toast.success(`Recordatorio enviado a ${loan.clientName}`);
        if (onComplete) onComplete();
      } else {
        window.open(`https://wa.me/${loan.phone.replace('+', '')}?text=${encodeURIComponent(mensaje)}`, '_blank');
        toast(`Abre WhatsApp para enviar a ${loan.clientName}`, { icon: '📱' });
        if (onComplete) onComplete();
      }
    }, 'image/png');
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