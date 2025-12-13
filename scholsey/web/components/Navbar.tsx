import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-black/30 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-300">Scholsey</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/features" className="inline-flex items-center px-1 pt-1 text-white hover:text-blue-300">
                Features
              </Link>
              <Link href="/pricing" className="inline-flex items-center px-1 pt-1 text-white hover:text-blue-300">
                Pricing
              </Link>
              <Link href="/devices" className="inline-flex items-center px-1 pt-1 text-white hover:text-blue-300">
                Devices
              </Link>
              <Link href="/contact" className="inline-flex items-center px-1 pt-1 text-white hover:text-blue-300">
                Contact
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium">
              Login
            </Link>
            <Link href="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
