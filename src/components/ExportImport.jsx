import { motion } from 'framer-motion'
import { getLoans, saveLoans } from '../utils/storage'
import toast from 'react-hot-toast'

export default function ExportImport() {
  const handleExport = () => {
    const data = JSON.stringify(getLoans(), null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'prestamos-backup.json'
    a.click()
    toast.success('Datos exportados')
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result)
        if (Array.isArray(imported)) {
          saveLoans(imported)
          toast.success('Datos importados correctamente')
          setTimeout(() => window.location.reload(), 800)
        }
      } catch (err) {
        toast.error('Archivo inválido')
      }
    }
    reader.readAsText(file)
  }

  const buttonClass = "w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-shadow"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-md mx-auto"
    >
      <h1 className="text-2xl font-bold text-white">Respaldar datos</h1>
      <p className="text-gray-400 text-sm">
        Exporta tus préstamos a un archivo JSON o importa un respaldo anterior.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExport}
        className={buttonClass}
      >
        📤 Exportar préstamos (JSON)
      </motion.button>
      <label className={`${buttonClass} text-center block cursor-pointer`}>
        📥 Importar préstamos
        <input type="file" accept=".json" onChange={handleImport} className="hidden" />
      </label>
    </motion.div>
  )
}