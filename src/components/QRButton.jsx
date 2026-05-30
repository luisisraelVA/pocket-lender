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
    <button onClick={shareQR} className="bg-blue-600 px-3 py-1 rounded text-sm">
      QR
    </button>
  )
}