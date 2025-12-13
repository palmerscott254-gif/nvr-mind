export default function Devices() {
  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">My Devices</h1>
        <p className="text-xl text-gray-300">Manage and monitor all your protected devices</p>
      </div>

      <div className="card-gradient text-center py-12">
        <div className="text-6xl mb-4">📱</div>
        <h2 className="text-2xl font-semibold mb-4 text-white">No Devices Yet</h2>
        <p className="text-gray-300 mb-6">
          Start protecting your devices by registering them in your account
        </p>
        <button className="button-primary">
          Add Your First Device
        </button>
      </div>
    </div>
  )
}
