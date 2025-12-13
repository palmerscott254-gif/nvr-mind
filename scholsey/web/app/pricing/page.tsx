import Link from 'next/link'
import { Check, Zap } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      period: '',
      features: [
        'Up to 2 devices',
        'Basic anti-theft protection',
        '5GB secure storage',
        'Email support'
      ]
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/mo',
      features: [
        'Up to 10 devices',
        'Advanced anti-theft features',
        '100GB secure storage',
        'AI-powered security',
        'Priority support',
        'Backup & recovery'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Unlimited devices',
        'All Pro features',
        'Unlimited storage',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom integrations',
        'SLA guarantee'
      ]
    }
  ]

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400">Choose the plan that works best for you</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`card-gradient relative ${
                plan.popular ? 'ring-2 ring-purple-500 scale-105 shadow-2xl shadow-purple-500/20' : ''
              } smooth-transition hover:scale-105`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    <Zap className="w-4 h-4" />
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mt-4 mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {plan.price}
                </span>
                <span className="text-gray-400 text-lg">{plan.period}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start">
                    <Check className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`block text-center py-3 px-6 rounded-lg font-semibold smooth-transition ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-500 hover:to-blue-400 shadow-lg shadow-purple-500/30'
                    : 'bg-slate-700/50 text-white hover:bg-slate-600/50 border border-slate-600'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
