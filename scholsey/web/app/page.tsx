import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent animate-fade-in">
                  Scholsey
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
                Your all-in-one security solution.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link 
                href="/devices" 
                className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-semibold rounded-xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/80 hover:scale-105 smooth-transition overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 smooth-transition"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <span className="text-2xl">📱</span>
                  Link New Device
                </span>
              </Link>
              
              <Link 
                href="/location" 
                className="group relative w-full sm:w-auto px-8 py-4 bg-slate-800/80 border-2 border-blue-500/50 text-white text-lg font-semibold rounded-xl shadow-xl hover:bg-slate-700/80 hover:border-blue-400 hover:scale-105 smooth-transition"
              >
                <span className="relative flex items-center justify-center gap-3">
                  <span className="text-2xl">📍</span>
                  View Live Location
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Key Features</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Anti-Theft Protection */}
          <div className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-blue-500/30 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 smooth-transition hover:scale-105 hover:border-blue-400/60">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 smooth-transition"></div>
            <div className="relative space-y-4">
              <div className="text-6xl mb-6 group-hover:scale-110 smooth-transition">🔒</div>
              <h3 className="text-2xl font-bold text-white mb-3">Anti-Theft Protection</h3>
              <p className="text-gray-300 leading-relaxed">
                Advanced tracking and recovery features to protect your devices from theft.
              </p>
            </div>
          </div>

          {/* Secure Vault */}
          <div className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-blue-500/30 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 smooth-transition hover:scale-105 hover:border-blue-400/60">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 smooth-transition"></div>
            <div className="relative space-y-4">
              <div className="text-6xl mb-6 group-hover:scale-110 smooth-transition">🗄️</div>
              <h3 className="text-2xl font-bold text-white mb-3">Secure Vault</h3>
              <p className="text-gray-300 leading-relaxed">
                Encrypted storage for your sensitive files and data with military-grade security.
              </p>
            </div>
          </div>

          {/* AI-Powered Security */}
          <div className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-blue-500/30 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 smooth-transition hover:scale-105 hover:border-blue-400/60">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 smooth-transition"></div>
            <div className="relative space-y-4">
              <div className="text-6xl mb-6 group-hover:scale-110 smooth-transition">🤖</div>
              <h3 className="text-2xl font-bold text-white mb-3">AI-Powered Security</h3>
              <p className="text-gray-300 leading-relaxed">
                Smart threat detection and automated security responses powered by AI.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
