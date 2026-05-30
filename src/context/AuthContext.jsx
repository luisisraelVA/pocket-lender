import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isPinSet, isUnlocked, lockApp } from '../utils/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [locked, setLocked] = useState(!isUnlocked());

  const checkLock = useCallback(() => {
    setLocked(!isUnlocked());
  }, []);

  useEffect(() => {
    // Bloquear al cambiar a segundo plano
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lockApp();
        setLocked(true);
      } else {
        checkLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [checkLock]);

  return (
    <AuthContext.Provider value={{ locked, setLocked }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}