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
          if (verifyPin(newPin)) {
            unlockApp();
            setLocked(false);
          } else {
            setError(true);
            setPinState('');
          }
        } else if (!hasPin) {
          if (!confirm) {
            setConfirm(newPin);
            setPinState('');
          } else {
            if (newPin === confirm) {
              setPin(newPin);
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
    <div className="min-h-screen bg-[var(--clr-bg)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Orbes ambientales */}
      <div className="absolute top-[-100px] left-[-60px] w-72 h-72 orb-cyan ambient-orb opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-120px] right-[-80px] w-96 h-96 orb-indigo ambient-orb opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xs z-10"
      >
        <h1 className="text-3xl font-extrabold text-center gradient-text mb-2">
          Pocket Lender
        </h1>
        <p className="text-center text-gray-400 mb-8">{title}</p>
        {subtitle && <p className="text-center text-gray-300 mb-4">{subtitle}</p>}

        {/* Círculos de PIN */}
        <div className="flex justify-center gap-4 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={error ? { x: [0, -8, 8, -8, 8, 0] } : {}}
              className={`w-5 h-5 rounded-full border-2 transition-colors ${
                pin.length > i
                  ? error ? 'border-red-400 bg-red-400' : 'border-cyan-400 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                  : 'border-gray-600'
              }`}
            />
          ))}
        </div>

        {error && <p className="text-center text-red-400 mb-4 text-sm">PIN incorrecto</p>}

        {/* Teclado */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <motion.button
              key={num}
              whileTap={{ scale: 0.85 }}
              onClick={() => handleNumber(num.toString())}
              className="key-btn glass bg-slate-800/40 hover:bg-slate-800/60 text-white text-2xl font-semibold rounded-2xl py-5 active:bg-cyan-900/30 transition-all"
            >
              {num}
            </motion.button>
          ))}
          <div />
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => handleNumber('0')}
            className="key-btn glass bg-slate-800/40 hover:bg-slate-800/60 text-white text-2xl font-semibold rounded-2xl py-5"
          >
            0
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleDelete}
            className="key-btn glass bg-slate-800/40 hover:bg-slate-800/60 text-white text-2xl font-semibold rounded-2xl py-5"
          >
            ⌫
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}