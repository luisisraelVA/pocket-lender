import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { calculateDebt } from '../utils/calculations'

export default function QRButton({ loan }) {
  const shareQR = async () => {
    const debt = calculateDebt(loan).toFixed(2)
    const text = `Préstamo de ${loan.clientName}\nDeuda: $${debt}\nVence: ${loan.dueDate}`
    const canvas = document.createElement('canvas')
    await QRCode.toCanvas(canvas, text, { width: 400 })

    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'prestamo-qr.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Detalle de préstamo',
          text: `Hola ${loan.clientName}, aquí los detalles de tu préstamo.`,
        })
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
      }
    }, 'image/png')
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      animate={{ boxShadow: ['0 0 0px #3b82f6', '0 0 15px #3b82f6', '0 0 0px #3b82f6'] }}
      transition={{ repeat: Infinity, duration: 2 }}
      onClick={shareQR}
      className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-xl font-medium text-sm shadow-lg shadow-blue-500/30"
    >
      QR
    </motion.button>
  )
}