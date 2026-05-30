import { useState } from 'react';
import { motion } from 'framer-motion';
import { setPin, verifyPin, isPinSet, unlockApp } from '../utils/auth';
import { useAuth } from '../context/AuthContext';

export default function LockScreen() {
  const [pin, setPinState] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState(false);
  const { setLocked } = useAuth();
  const hasPin = isPinSet();

  const handleNumber = (num) => {
    setError(false);
    if (pin.length < 4) {
      const newPin = pin + num;
      setPinState(newPin);

      if (newPin.length === 4) {
        if (hasPin && !confirm) {
          // Verificar PIN existente
          if (verifyPin(newPin)) {
            unlockApp();
            setLocked(false);
          } else {
            setError(true);
            setPinState('');
          }
        } else if (!hasPin) {
          // Configuración inicial
          if (!confirm) {
            setConfirm(newPin); // Guarda el primer PIN
            setPinState('');
          } else {
            // Confirmación
            if (newPin === confirm) {
              setPin(newPin); // Se guarda en localStorage (sincrónico, sin promesa)
              unlockApp();
              setLocked(false);
            } else {
              setError(true);
              setPinState('');
              setConfirm(false);
            }
          }
        }
      }
    }
  };

  const handleDelete = () => {
    setPinState(pin.slice(0, -1));
    setError(false);
  };

  const title = hasPin ? 'Ingresa tu PIN' : 'Crea un PIN de 4 dígitos';
  const subtitle = confirm ? 'Confirma tu PIN' : '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-950 to-slate-900 flex flex-col items-center justify-center p-6"
    >
      <h1 className="text-3xl font-bold text-cyan-400 mb-2">Pocket Lender</h1>
      <p className="text-gray-400 mb-8 text-center">{title}</p>
      {subtitle && <p className="text-gray-300 mb-4">{subtitle}</p>}

      <div className="flex gap-3 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
            className={`w-5 h-5 rounded-full border-2 ${
              pin.length > i
                ? error
                  ? 'border-red-400 bg-red-400'
                  : 'border-cyan-400 bg-cyan-400'
                : 'border-gray-500'
            }`}
          />
        ))}
      </div>

      {error && <p className="text-red-400 mb-4">PIN incorrecto, intenta de nuevo</p>}

      <div className="grid grid-cols-3 gap-3 w-64">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <motion.button
            key={num}
            whileTap={{ scale: 0.8 }}
            onClick={() => handleNumber(num.toString())}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xl font-bold rounded-2xl py-4 active:bg-cyan-600 transition-colors"
          >
            {num}
          </motion.button>
        ))}
        <div />
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => handleNumber('0')}
          className="bg-slate-800 hover:bg-slate-700 text-white text-xl font-bold rounded-2xl py-4"
        >
          0
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleDelete}
          className="bg-slate-800 hover:bg-slate-700 text-white text-xl font-bold rounded-2xl py-4"
        >
          ⌫
        </motion.button>
      </div>
    </motion.div>
  );
}