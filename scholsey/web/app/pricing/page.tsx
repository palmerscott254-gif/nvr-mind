import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Pricing() {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      features: [
        'Up to 2 devices',
        'Basic anti-theft protection',
        '5GB secure storage',
        'Email support'
      ]
    },
    {
      name: 'Pro',
      price: '$9.99/mo',
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
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600">Choose the plan that works best for you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-md p-8 ${
                  plan.popular ? 'ring-2 ring-blue-600 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mt-4 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-blue-600 mb-6">{plan.price}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-3 px-6 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
