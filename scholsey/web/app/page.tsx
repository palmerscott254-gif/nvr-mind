import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Secure Your Devices with <span className="text-blue-300">Scholsey</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
                Protect your valuable devices with advanced anti-theft technology, secure vault storage, and AI-powered security features.
              </p>
              <div className="flex justify-center gap-6">
                <Link href="/devices" className="flex flex-col items-center group">
                  <div className="bg-blue-600 p-6 rounded-full mb-3 group-hover:bg-blue-700 transition shadow-lg">
                    <span className="text-4xl">📱</span>
                  </div>
                  <span className="text-white font-semibold">Link New Device</span>
                </Link>
                <Link href="/devices" className="flex flex-col items-center group">
                  <div className="bg-white/10 backdrop-blur-sm border-2 border-white p-6 rounded-full mb-3 group-hover:bg-white/20 transition shadow-lg">
                    <span className="text-4xl">📍</span>
                  </div>
                  <span className="text-white font-semibold">View Live Location</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Choose Scholsey?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-lg hover:bg-white/15 transition">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Anti-Theft Protection</h3>
              <p className="text-gray-200">Advanced tracking and recovery features to protect your devices from theft.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-lg hover:bg-white/15 transition">
              <div className="text-4xl mb-4">🗄️</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Secure Vault</h3>
              <p className="text-gray-200">Encrypted storage for your sensitive files and data with military-grade security.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-lg hover:bg-white/15 transition">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2 text-white">AI-Powered Security</h3>
              <p className="text-gray-200">Smart threat detection and automated security responses powered by AI.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
