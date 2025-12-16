'use client';

import { useState, useEffect } from 'react';
import { Battery, MapPin, Navigation, Wifi, Clock, Map } from 'lucide-react';

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
    heading: number | null;
    ipAddress: string | null;
    city: string | null;
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
  const loc = hasLocation ? device.locationUpdates[0] : null;

  const [place, setPlace] = useState<{ city?: string; county?: string } | null>(null);

  useEffect(() => {
    async function reverseGeocode() {
      if (!loc) return;
      try {
        // Use OpenStreetMap Nominatim for reverse geocoding
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.latitude}&lon=${loc.longitude}&zoom=10&addressdetails=1`;
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        const data = await res.json();
        const city = data?.address?.city || data?.address?.town || data?.address?.village || data?.address?.hamlet;
        const county = data?.address?.county;
        setPlace({ city, county });
      } catch (e) {
        // Fail silently
      }
    }
    reverseGeocode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc?.latitude, loc?.longitude]);

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
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-gray-400">Last seen:</span>
          <span className="text-white font-medium">{getLastSeenText(device.lastSeen)}</span>
        </div>
      </div>

      {hasLocation && (
        <div className="mt-3 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1 text-gray-400">
              <MapPin className="w-3 h-3" />
              <span>Lat: {device.locationUpdates[0].latitude.toFixed(6)}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <MapPin className="w-3 h-3" />
              <span>Lng: {device.locationUpdates[0].longitude.toFixed(6)}</span>
            </div>
          </div>
          
          {(place?.city || device.locationUpdates[0].city) && (
            <div className="flex items-center gap-1 text-blue-400">
              <MapPin className="w-3 h-3" />
              <span>{place?.city || device.locationUpdates[0].city}</span>
            </div>
          )}
          {place?.county && (
            <div className="flex items-center gap-1 text-indigo-300">
              <Map className="w-3 h-3" />
              <span>{place.county} County</span>
            </div>
          )}
          
          {device.locationUpdates[0].ipAddress && (
            <div className="flex items-center gap-1 text-purple-400">
              <Wifi className="w-3 h-3" />
              <span>IP: {device.locationUpdates[0].ipAddress}</span>
            </div>
          )}
          
          {device.locationUpdates[0].heading !== null && (
            <div className="flex items-center gap-1 text-green-400">
              <Navigation className="w-3 h-3" />
              <span>Direction: {Math.round(device.locationUpdates[0].heading)}°</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Updated: {new Date(device.locationUpdates[0].timestamp).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
