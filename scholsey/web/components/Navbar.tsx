import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-slate-900 border-b border-blue-500/30 shadow-2xl shadow-blue-500/20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group smooth-transition">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:shadow-blue-500/80 smooth-transition">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-gradient group-hover:from-blue-300 group-hover:to-blue-100 smooth-transition">Scholsey</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/login" className="nav-link text-gray-300 hover:text-blue-300 text-sm font-medium smooth-transition">
              Login
            </Link>
            <Link href="/register" className="button-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
