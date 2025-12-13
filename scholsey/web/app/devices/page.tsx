import Navbar from '@/components/Navbar'

export default function Devices() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Devices</h1>
            <p className="text-xl text-gray-600">Manage and monitor all your protected devices</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-2xl font-semibold mb-4">No Devices Yet</h2>
            <p className="text-gray-600 mb-6">
              Start protecting your devices by registering them in your account
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Add Your First Device
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
