import { MapPin, Lock, Shield, Brain, Database, Smartphone } from 'lucide-react'

export default function Features() {
  const features = [
    {
      title: 'Device Tracking',
      description: 'Real-time GPS tracking and location history for all your registered devices.',
      icon: MapPin,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Remote Lock & Wipe',
      description: 'Instantly lock your device or wipe sensitive data remotely if stolen.',
      icon: Lock,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Secure Vault',
      description: 'Encrypted cloud storage for your most important files and documents.',
      icon: Shield,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'AI Threat Detection',
      description: 'Machine learning algorithms detect and prevent security threats automatically.',
      icon: Brain,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Backup & Recovery',
      description: 'Automatic backups ensure your data is always safe and recoverable.',
      icon: Database,
      color: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Multi-Device Support',
      description: 'Protect unlimited devices across phones, tablets, and laptops.',
      icon: Smartphone,
      color: 'from-violet-500 to-purple-500'
    }
  ]

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to keep your devices and data secure
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="card-gradient group hover:scale-105 smooth-transition cursor-pointer"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
