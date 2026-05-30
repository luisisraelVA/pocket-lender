import { Outlet, NavLink } from 'react-router-dom'
import { Home, PlusCircle, Clock, Download } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/nuevo', icon: PlusCircle, label: 'Nuevo' },
  { to: '/historial', icon: Clock, label: 'Historial' },
  { to: '/datos', icon: Download, label: 'Datos' },
]

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex justify-around py-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${isActive ? 'text-blue-400' : 'text-gray-400'}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}