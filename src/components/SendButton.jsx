import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SendButton({ loan }) {
  const enviar = async () => {
    const mensaje = `Hola ${loan.clientName}, gracias por tu responsabilidad. Aquí tienes mi QR para el pago.`;

    try {
      // 1. Cargar la imagen del QR
      const response = await fetch('/mi-qr.png');
      if (!response.ok) throw new Error('Imagen no encontrada');
      const blob = await response.blob();
      const file = new File([blob], 'qr-cobro.png', { type: 'image/png' });

      // 2. Intentar compartir imagen + texto con la Web Share API
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'QR de cobro',
          text: mensaje,
        });
        toast.success('QR compartido con éxito');
      } else {
        // 3. Fallback: no se pueden compartir archivos → abrir WhatsApp con texto
        const numero = loan.phone.replace('+', '');
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
        toast('No se pudo adjuntar la imagen. Envíala manualmente desde tu galería.', { icon: '📎' });
      }
    } catch (error) {
      // 4. Error al cargar la imagen
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