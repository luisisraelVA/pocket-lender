import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SendButton({ loan }) {
  const enviar = async () => {
    // 1. Preguntar el monto que pagará hoy
    const montoSugerido = loan.dailyQuota.toFixed(2);
    const montoStr = window.prompt(
      `¿Cuánto pagará ${loan.clientName} hoy?`,
      montoSugerido
    );

    // Si cancela el prompt, no hace nada
    if (montoStr === null) return;

    const monto = parseFloat(montoStr);
    if (isNaN(monto) || monto <= 0) {
      toast.error('Monto inválido');
      return;
    }

    const today = new Date();
    const fechaFormateada = today.toLocaleDateString('es-BO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const montoFormateado = monto.toFixed(2);
    const mensajeTexto = `Hola ${loan.clientName}, hoy ${fechaFormateada} te corresponde pagar Bs. ${montoFormateado}. Gracias por tu responsabilidad.`;

    try {
      // 2. Cargar tu QR real del banco (mi-qr.png)
      const response = await fetch('/mi-qr.png');
      if (!response.ok) throw new Error('Imagen no encontrada');
      const blob = await response.blob();
      const file = new File([blob], 'qr-cobro.png', { type: 'image/png' });

      // 3. Compartir imagen + texto
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Pago diario',
          text: mensajeTexto,
        });
        toast.success('QR enviado con éxito');
      } else {
        // Fallback: abrir WhatsApp solo con texto
        const numero = loan.phone.replace('+', '');
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensajeTexto)}`, '_blank');
        toast('No se pudo adjuntar la imagen. Se abrió WhatsApp con el mensaje.', { icon: '📱' });
      }
    } catch (error) {
      toast.error('Imagen QR no encontrada. Coloca tu QR en public/mi-qr.png');
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