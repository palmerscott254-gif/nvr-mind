'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { devicesApi } from '@/lib/api';
import DeviceCard from '@/components/DeviceCard';
import LinkDeviceModal from '@/components/LinkDeviceModal';
import DeviceMap from '@/components/DeviceMap';
import SecurityControls from '@/components/SecurityControls';
import { io, Socket } from 'socket.io-client';

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

export default function Devices() {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchDevices();
    
    // Setup WebSocket connection
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        socket.emit('subscribe-device-updates', { userId });
      }

      socket.on('device-updated', (device: Device) => {
        setDevices(prev => 
          prev.map(d => d.id === device.id ? device : d)
        );
        if (selectedDevice?.id === device.id) {
          setSelectedDevice(device);
        }
      });

      socket.on('location-updated', (data: any) => {
        fetchDevices(); // Refresh devices to get latest location
      });
    }
  }, [socket, selectedDevice]);

  const fetchDevices = async () => {
    try {
      const response = await devicesApi.getDevices();
      setDevices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
      setLoading(false);
    }
  };

  const handleLinkDevice = async (name: string, deviceId: string) => {
    try {
      await devicesApi.linkDevice({ name, deviceId });
      fetchDevices();
      setShowLinkModal(false);
      alert('Device linked successfully! 🎉');
    } catch (error: any) {
      console.error('Failed to link device:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      const statusCode = error.response?.status;
      
      if (statusCode === 401) {
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
      } else if (statusCode === 409) {
        alert('This device ID is already linked to your account.');
      } else {
        alert(`Failed to link device: ${errorMsg}`);
      }
    }
  };

  const handleUnlinkDevice = async (id: string) => {
    if (!confirm('Are you sure you want to unlink this device?')) return;
    
    try {
      await devicesApi.unlinkDevice(id);
      fetchDevices();
      if (selectedDevice?.id === id) {
        setSelectedDevice(null);
      }
    } catch (error) {
      console.error('Failed to unlink device:', error);
      alert('Failed to unlink device. Please try again.');
    }
  };

  const handleSendCommand = async (deviceId: string, commandType: string) => {
    try {
      await devicesApi.sendCommand({ deviceId, commandType });
      alert(`Command "${commandType}" sent successfully!`);
      fetchDevices(); // Refresh to show updated status
    } catch (error) {
      console.error('Failed to send command:', error);
      alert('Failed to send command. Please try again.');
    }
  };

  const handleMarkStatus = async (deviceId: string, status: 'stolen' | 'safe') => {
    try {
      if (status === 'stolen') {
        if (!confirm('Are you sure you want to mark this device as STOLEN? This will enable maximum security measures.')) {
          return;
        }
        await devicesApi.markAsStolen(deviceId);
      } else {
        await devicesApi.markAsSafe(deviceId);
      }
      alert(`Device marked as ${status.toUpperCase()}`);
      fetchDevices();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update device status.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">My Devices</h1>
            <p className="text-xl text-gray-300">Track location and battery status of your devices</p>
          </div>
          <button 
            onClick={() => setShowLinkModal(true)}
            className="button-primary"
          >
            + Link New Device
          </button>
        </div>
      </div>

      {devices.length === 0 ? (
        <div className="card-gradient text-center py-12">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-semibold mb-4 text-white">No Devices Yet</h2>
          <p className="text-gray-300 mb-6">
            Start tracking your devices by linking them to your account
          </p>
          <button 
            onClick={() => setShowLinkModal(true)}
            className="button-primary"
          >
            Link Your First Device
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Devices List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Linked Devices ({devices.length})
            </h2>
            {devices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                isSelected={selectedDevice?.id === device.id}
                onSelect={() => setSelectedDevice(device)}
                onUnlink={() => handleUnlinkDevice(device.id)}
              />
            ))}
          </div>

          {/* Security Controls - Middle Column */}
          {selectedDevice && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Security
              </h2>
              <SecurityControls
                device={selectedDevice}
                onSendCommand={handleSendCommand}
                onMarkStatus={handleMarkStatus}
              />
            </div>
          )}

          {/* Map View - Right Column */}
          <div className="lg:sticky lg:top-4 h-[600px]">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Location
            </h2>
            <DeviceMap
              devices={selectedDevice ? [selectedDevice] : devices}
              selectedDevice={selectedDevice}
            />
          </div>
        </div>
      )}

      {showLinkModal && (
        <LinkDeviceModal
          onClose={() => setShowLinkModal(false)}
          onLink={handleLinkDevice}
        />
      )}
    </div>
  );
}
