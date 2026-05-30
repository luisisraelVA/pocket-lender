import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import LockScreen from './components/LockScreen';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import LoanForm from './components/LoanForm';
import EditLoan from './components/EditLoan';
import Historial from './components/Historial';
import ExportImport from './components/ExportImport';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const { locked } = useAuth();

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
        }}
      />
      {locked ? (
        <LockScreen />
      ) : (
        <AnimatePresence mode="wait">
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/nuevo" element={<LoanForm />} />
              <Route path="/editar/:id" element={<EditLoan />} />
              <Route path="/historial" element={<Historial />} />
              <Route path="/datos" element={<ExportImport />} />
            </Route>
          </Routes>
        </AnimatePresence>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}