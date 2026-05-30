import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import LoanForm from './components/LoanForm'
import Historial from './components/Historial'
import ExportImport from './components/ExportImport'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/nuevo" element={<LoanForm />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/datos" element={<ExportImport />} />
      </Route>
    </Routes>
  )
}