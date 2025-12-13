import Navbar from '@/components/Navbar'

export default function Features() {
  const features = [
    {
      title: 'Device Tracking',
      description: 'Real-time GPS tracking and location history for all your registered devices.',
      icon: '📍'
    },
    {
      title: 'Remote Lock & Wipe',
      description: 'Instantly lock your device or wipe sensitive data remotely if stolen.',
      icon: '🔐'
    },
    {
      title: 'Secure Vault',
      description: 'Encrypted cloud storage for your most important files and documents.',
      icon: '🗄️'
    },
    {
      title: 'AI Threat Detection',
      description: 'Machine learning algorithms detect and prevent security threats automatically.',
      icon: '🤖'
    },
    {
      title: 'Backup & Recovery',
      description: 'Automatic backups ensure your data is always safe and recoverable.',
      icon: '💾'
    },
    {
      title: 'Multi-Device Support',
      description: 'Protect unlimited devices across phones, tablets, and laptops.',
      icon: '📱'
    }
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to keep your devices and data secure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
