'use client';

import { useEffect, useRef, useState } from 'react';
import type { Map, TileLayer, Marker } from 'leaflet';

interface Device {
  id: string;
  name: string;
  batteryLevel: number | null;
  isCharging: boolean;
  locationUpdates: Array<{
    latitude: number;
    longitude: number;
    accuracy: number | null;
    timestamp: string;
  }>;
}

interface DeviceMapProps {
  devices: Device[];
  selectedDevice?: Device | null;
}

export default function DeviceMap({ devices, selectedDevice }: DeviceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef<Map | null>(null);

  const devicesWithLocation = devices.filter(
    d => d.locationUpdates && d.locationUpdates.length > 0
  );

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Only remove if they still exist
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    // Safely access window.L with proper typing
    const L = (window as any).L as typeof import('leaflet');
    
    if (!L) {
      console.error('Leaflet library failed to load');
      return;
    }
    
    // Clear existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    mapRef.current.innerHTML = '';
    const mapDiv = document.createElement('div');
    mapDiv.style.height = '100%';
    mapDiv.style.width = '100%';
    mapRef.current.appendChild(mapDiv);

    if (devicesWithLocation.length === 0) {
      // Show default world view
      const map = L.map(mapDiv).setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);
      mapInstanceRef.current = map;
      return;
    }

    // Calculate bounds
    const bounds = L.latLngBounds(
      devicesWithLocation.map(d => [
        d.locationUpdates[0].latitude,
        d.locationUpdates[0].longitude,
      ])
    );

    const map = L.map(mapDiv).fitBounds(bounds, { padding: [50, 50] });
    mapInstanceRef.current = map;
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add markers for each device
    devicesWithLocation.forEach(device => {
      const location = device.locationUpdates[0];
      const isSelected = selectedDevice?.id === device.id;
      
      const batteryIcon = device.batteryLevel !== null 
        ? `${device.batteryLevel}% ${device.isCharging ? '⚡' : '🔋'}`
        : 'N/A';

      const icon = L.divIcon({
        html: `
          <div style="
            background: ${isSelected ? '#8b5cf6' : '#4c1d95'};
            border: 2px solid ${isSelected ? '#a78bfa' : '#7c3aed'};
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">
            📱
          </div>
        `,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([location.latitude, location.longitude], { icon })
        .addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif;">
          <strong style="font-size: 16px;">${device.name}</strong><br>
          <div style="margin-top: 8px;">
            Battery: ${batteryIcon}<br>
            Location: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}<br>
            ${location.accuracy ? `Accuracy: ${location.accuracy.toFixed(0)}m<br>` : ''}
            Updated: ${new Date(location.timestamp).toLocaleString()}
          </div>
        </div>
      `);

      if (isSelected) {
        marker.openPopup();
      }
    });

  }, [mapLoaded, devicesWithLocation, selectedDevice]);

  return (
    <div className="card-gradient h-full rounded-lg overflow-hidden">
      <div className="h-full" ref={mapRef}>
        {!mapLoaded && (
          <div className="h-full flex items-center justify-center text-gray-400">
            Loading map...
          </div>
        )}
        {mapLoaded && devicesWithLocation.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-xl text-white font-semibold">No Location Data</p>
              <p className="text-gray-400 mt-2">Devices will appear here once they send location updates</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
