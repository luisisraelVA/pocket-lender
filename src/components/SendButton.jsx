import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

export default function SendButton({ loan }) {
  const enviar = async () => {
    const today = new Date();
    const fechaFormateada = today.toLocaleDateString('es-BO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const montoCuota = loan.dailyQuota.toFixed(2);
    const mensajeTexto = `Hola ${loan.clientName}, hoy ${fechaFormateada} te corresponde pagar Bs. ${montoCuota}. Gracias por tu responsabilidad.`;

    const qrData = `Pago de ${loan.clientName}\nMonto sugerido: Bs. ${montoCuota}\nFecha: ${fechaFormateada}\nGracias por tu pago puntual.`;

    try {
      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, qrData, { width: 400 });

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], `pago-${loan.clientName}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Pago diario',
          text: mensajeTexto,
        });
        toast.success('QR enviado con éxito');
      } else {
        const numero = loan.phone.replace('+', '');
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensajeTexto)}`, '_blank');
        toast('No se pudo adjuntar la imagen. Se abrió WhatsApp con el mensaje.', { icon: '📱' });
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al generar el QR. Intenta de nuevo.');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      onClick={enviar}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
    >
      <Send size={16} />
      Enviar
    </motion.button>
  );
}