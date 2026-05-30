import { getLoans, saveLoans } from '../utils/storage'

export default function ExportImport() {
  const handleExport = () => {
    const data = JSON.stringify(getLoans(), null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'prestamos-backup.json'
    a.click()
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
          alert('Datos importados correctamente.')
          window.location.reload()
        }
      } catch (err) {
        alert('Archivo inválido')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Respaldar datos</h1>
      <button onClick={handleExport} className="w-full bg-blue-600 py-3 rounded font-bold">Exportar préstamos (JSON)</button>
      <label className="w-full bg-slate-800 py-3 rounded text-center block cursor-pointer">
        Importar préstamos
        <input type="file" accept=".json" onChange={handleImport} className="hidden" />
      </label>
    </div>
  )
}