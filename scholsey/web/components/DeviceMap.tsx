'use client';

import { useEffect, useRef, useState } from 'react';

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
    city?: string | null;
  }>;
  lastLatitude?: number | null;
  lastLongitude?: number | null;
  lastCity?: string | null;
}

interface DeviceMapProps {
  devices: Device[];
  selectedDevice?: Device | null;
}

declare global {
  interface Window {
    _googleMapsPromise?: Promise<typeof google>;
  }
}

function loadGoogleMaps(apiKey?: string) {
  if ((window as any).google) {
    return Promise.resolve((window as any).google as typeof google);
  }
  if (window._googleMapsPromise) {
    return window._googleMapsPromise;
  }
  if (!apiKey) {
    return Promise.reject(new Error('Missing Google Maps API key'));
  }
  window._googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve((window as any).google as typeof google);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return window._googleMapsPromise;
}

export default function DeviceMap({ devices, selectedDevice }: DeviceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const devicesWithLocation = devices
    .map(device => {
      const loc = device.locationUpdates?.[0];
      const fallback = device.lastLatitude && device.lastLongitude
        ? { latitude: device.lastLatitude, longitude: device.lastLongitude, accuracy: null, timestamp: new Date().toISOString(), city: device.lastCity || null }
        : null;
      return loc ? { device, location: loc } : fallback ? { device, location: fallback } : null;
    })
    .filter((d): d is { device: Device; location: any } => Boolean(d));

  // Load Google Maps script once
  useEffect(() => {
    loadGoogleMaps(apiKey)
      .then(() => setMapReady(true))
      .catch(err => {
        console.error('Failed to load Google Maps:', err);
        setMapReady(false);
      });
  }, [apiKey]);

  // Render markers when data changes
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const g = (window as any).google as typeof google;
    if (!g) return;

    // Create map if not existing
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new g.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 3,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
    }

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    if (devicesWithLocation.length === 0) {
      mapInstanceRef.current.setCenter({ lat: 0, lng: 0 });
      mapInstanceRef.current.setZoom(2);
      return;
    }

    const bounds = new g.maps.LatLngBounds();
    infoWindowRef.current = new g.maps.InfoWindow();

    devicesWithLocation.forEach(({ device, location }) => {
      const position = { lat: location.latitude, lng: location.longitude } as google.maps.LatLngLiteral;
      const marker = new g.maps.Marker({
        position,
        map: mapInstanceRef.current!,
        title: device.name,
        label: '📱',
      });

      const battery = device.batteryLevel !== null ? `${device.batteryLevel}% ${device.isCharging ? '⚡' : '🔋'}` : 'N/A';
      const html = `
        <div style="font-family: sans-serif; min-width: 200px;">
          <strong style="font-size: 16px;">${device.name}</strong><br/>
          <div style="margin-top: 8px; font-size: 13px; color: #444;">
            Battery: ${battery}<br/>
            Location: ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}<br/>
            ${location.accuracy ? `Accuracy: ${location.accuracy.toFixed(0)}m<br/>` : ''}
            ${location.city ? `City: ${location.city}<br/>` : ''}
            Updated: ${new Date(location.timestamp).toLocaleString()}
          </div>
        </div>
      `;

      marker.addListener('click', () => {
        infoWindowRef.current?.setContent(html);
        infoWindowRef.current?.open({ map: mapInstanceRef.current!, anchor: marker });
      });

      markersRef.current.push(marker);
      bounds.extend(position);

      if (selectedDevice?.id === device.id) {
        infoWindowRef.current.setContent(html);
        infoWindowRef.current.open({ map: mapInstanceRef.current!, anchor: marker });
        mapInstanceRef.current!.setCenter(position);
        mapInstanceRef.current!.setZoom(16);
      }
    });

    if (selectedDevice) {
      // Already centered above
    } else {
      mapInstanceRef.current.fitBounds(bounds, 80);
    }
  }, [mapReady, devicesWithLocation, selectedDevice]);

  return (
    <div className="card-gradient h-full rounded-lg overflow-hidden">
      <div className="h-full relative" ref={mapRef}>
        {!apiKey && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-red-200 z-10">
            Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </div>
        )}
        {!mapReady && apiKey && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 z-10">
            Loading Google Maps...
          </div>
        )}
        {mapReady && devicesWithLocation.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-xl text-white font-semibold">No Location Data</p>
              <p className="text-gray-300 mt-2">Devices will appear once they send location updates.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
