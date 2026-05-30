import { Outlet, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, PlusCircle, Clock, Download } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/nuevo', icon: PlusCircle, label: 'Nuevo' },
  { to: '/historial', icon: Clock, label: 'Historial' },
  { to: '/datos', icon: Download, label: 'Datos' },
]

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      <main className="flex-1 p-4 pb-20">
        <Outlet />
      </main>
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="fixed bottom-4 left-4 right-4 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-lg flex justify-around py-3 z-50"
      >
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs transition-all ${
                isActive
                  ? 'text-cyan-400 scale-110 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]'
                  : 'text-gray-400 hover:text-cyan-300'
              }`
            }
          >
            <Icon size={20} />
            <span className="mt-0.5">{label}</span>
          </NavLink>
        ))}
      </motion.nav>
    </div>
  )
}