import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LockScreen from './components/LockScreen';
import Dashboard from './components/Dashboard';

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
      {locked ? <LockScreen /> : <Dashboard />}
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