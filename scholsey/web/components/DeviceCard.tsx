'use client';

interface Device {
  id: string;
  name: string;
  deviceId: string;
  batteryLevel: number | null;
  isCharging: boolean;
  lastSeen: string | null;
  locationUpdates: Array<{
    latitude: number;
    longitude: number;
    accuracy: number | null;
    timestamp: string;
  }>;
}

interface DeviceCardProps {
  device: Device;
  isSelected: boolean;
  onSelect: () => void;
  onUnlink: () => void;
}

export default function DeviceCard({ device, isSelected, onSelect, onUnlink }: DeviceCardProps) {
  const getBatteryColor = (level: number | null) => {
    if (level === null) return 'text-gray-400';
    if (level > 60) return 'text-green-400';
    if (level > 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBatteryIcon = (level: number | null) => {
    if (level === null) return '🔋';
    if (level > 75) return '🔋';
    if (level > 50) return '🔋';
    if (level > 25) return '🪫';
    return '🪫';
  };

  const getLastSeenText = (lastSeen: string | null) => {
    if (!lastSeen) return 'Never';
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const hasLocation = device.locationUpdates && device.locationUpdates.length > 0;

  return (
    <div
      onClick={onSelect}
      className={`card-gradient p-6 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50' : 'hover:shadow-lg'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">📱</div>
          <div>
            <h3 className="text-xl font-semibold text-white">{device.name}</h3>
            <p className="text-sm text-gray-400">ID: {device.deviceId.slice(0, 8)}...</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnlink();
          }}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          Unlink
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Battery Status */}
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{getBatteryIcon(device.batteryLevel)}</span>
            <span className={`text-lg font-semibold ${getBatteryColor(device.batteryLevel)}`}>
              {device.batteryLevel !== null ? `${device.batteryLevel}%` : 'N/A'}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            {device.isCharging ? '⚡ Charging' : 'Battery'}
          </div>
        </div>

        {/* Location Status */}
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📍</span>
            <span className="text-lg font-semibold text-white">
              {hasLocation ? 'Active' : 'N/A'}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            {hasLocation ? 'Location tracked' : 'No location'}
          </div>
        </div>
      </div>

      {/* Last Seen */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Last seen:</span>
          <span className="text-white font-medium">{getLastSeenText(device.lastSeen)}</span>
        </div>
      </div>

      {hasLocation && (
        <div className="mt-2 text-xs text-gray-500">
          Lat: {device.locationUpdates[0].latitude.toFixed(6)}, 
          Lng: {device.locationUpdates[0].longitude.toFixed(6)}
        </div>
      )}
    </div>
  );
}
