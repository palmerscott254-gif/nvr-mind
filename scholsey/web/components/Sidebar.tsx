'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/devices', label: 'Devices', icon: '📱' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-900 border-r border-blue-500/30 hidden md:flex flex-col overflow-y-auto shadow-2xl shadow-blue-500/20 smooth-transition">
      <nav className="p-6 mt-4 flex-1">
        <div className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg smooth-transition group glow-effect ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-slate-800/60'
                }`}
              >
                <span className={`text-lg smooth-transition ${isActive ? 'scale-110 animate-bounce' : 'group-hover:scale-110'}`}>
                  {link.icon}
                </span>
                <span className="font-medium smooth-transition">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      <div className="p-6 border-t border-blue-500/30">
        <div className="text-xs text-gray-500 text-center smooth-transition">© 2025 Scholsey</div>
      </div>
    </aside>
  )
}
