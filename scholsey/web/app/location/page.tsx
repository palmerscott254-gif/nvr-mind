'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Smartphone, Battery, Clock } from 'lucide-react';
import { devicesApi } from '@/lib/api';
import DeviceMap from '@/components/DeviceMap';
import { useAuth } from '@/lib/useAuth';

interface Device {
  id: string;
  name: string;
  deviceId: string;
  batteryLevel: number | null;
  isCharging: boolean;
  isLocked: boolean;
  isWiped: boolean;
  alarmActive: boolean;
  securityStatus: string;
  lastSeen: string | null;
  lastLatitude?: number | null;
  lastLongitude?: number | null;
  lastCity?: string | null;
  lastIpAddress?: string | null;
  locationUpdates: Array<{
    latitude: number;
    longitude: number;
    accuracy: number | null;
    altitude?: number | null;
    speed?: number | null;
    heading: number | null;
    ipAddress: string | null;
    city: string | null;
    timestamp: string;
    batteryLevel?: number | null;
    isCharging?: boolean;
  }>;
}

export default function LocationPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch devices
  useEffect(() => {
    const fetchDevices = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await devicesApi.getDevices();
        setDevices(response.data);
        if (response.data.length > 0) {
          setSelectedDeviceId(response.data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch devices:', err);
        setError('Failed to load devices');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Loading devices...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/devices')}
            className="button-primary"
          >
            Go to Devices
          </button>
        </div>
      </div>
    );
  }

  const selectedDevice = devices.find(d => d.id === selectedDeviceId);
  // Prefer cached last known fields; fall back to most recent update
  const location: (Device['locationUpdates'][number] & { batteryLevel?: number | null; isCharging?: boolean }) | undefined = selectedDevice?.locationUpdates?.[0] ?? (selectedDevice && selectedDevice.lastLatitude && selectedDevice.lastLongitude ? {
    latitude: selectedDevice.lastLatitude,
    longitude: selectedDevice.lastLongitude,
    accuracy: null as number | null,
    altitude: null as number | null,
    speed: null as number | null,
    heading: null as number | null,
    ipAddress: selectedDevice.lastIpAddress || null,
    city: selectedDevice.lastCity || null,
    timestamp: selectedDevice.lastSeen || new Date().toISOString(),
    batteryLevel: selectedDevice.batteryLevel ?? null,
    isCharging: selectedDevice.isCharging ?? false,
  } : undefined);

  return (
    <div className="min-h-screen pb-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
          Live Location
        </h1>
        <p className="text-gray-400">Track your devices in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Device List */}
        <div className="lg:col-span-1">
          <div className="card-gradient backdrop-blur-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-400" />
              Your Devices
            </h2>

            {devices.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No devices linked yet</p>
                <button
                  onClick={() => router.push('/devices')}
                  className="button-primary w-full"
                >
                  Link Device
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {devices.map(device => (
                  <button
                    key={device.id}
                    onClick={() => setSelectedDeviceId(device.id)}
                    className={`w-full text-left p-3 rounded-lg smooth-transition ${
                      selectedDeviceId === device.id
                        ? 'bg-blue-500/30 border border-blue-400/50'
                        : 'bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-medium text-white">{device.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {device.locationUpdates?.[0]?.city || 'No location data'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Location Details & Map */}
        <div className="lg:col-span-3 space-y-6">
          {selectedDevice && location ? (
            <>
              {/* Location Details */}
              <div className="card-gradient backdrop-blur-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  {selectedDevice.name}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">City</div>
                    <div className="font-semibold text-white">
                      {location.city || 'Unknown'}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Coordinates</div>
                    <div className="font-semibold text-white text-sm">
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Accuracy</div>
                    <div className="font-semibold text-white">
                      {location.accuracy ? `±${location.accuracy.toFixed(0)}m` : 'N/A'}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">IP Address</div>
                    <div className="font-semibold text-white text-sm">
                      {location.ipAddress || 'Unknown'}
                    </div>
                  </div>

                  {location.batteryLevel !== undefined && (
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <Battery className="w-4 h-4" />
                        Battery
                      </div>
                      <div className="font-semibold text-white">
                        {location.batteryLevel}%
                        {location.isCharging && ' 🔌'}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Last Seen
                    </div>
                    <div className="font-semibold text-white text-sm">
                      {new Date(location.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="card-gradient backdrop-blur-lg p-6 h-96">
                <DeviceMap devices={devices} selectedDevice={selectedDevice} />
              </div>
            </>
          ) : (
            <div className="card-gradient backdrop-blur-lg p-12 text-center">
              <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                {selectedDevice
                  ? 'No location data available. Enable location on your device.'
                  : 'Select a device to view its location'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
