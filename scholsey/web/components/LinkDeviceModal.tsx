'use client';

import { useState } from 'react';

interface LinkDeviceModalProps {
  onClose: () => void;
  onLink: (name: string, deviceId: string) => void;
}

export default function LinkDeviceModal({ onClose, onLink }: LinkDeviceModalProps) {
  const [name, setName] = useState('');
  const [deviceId, setDeviceId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && deviceId) {
      onLink(name, deviceId);
    }
  };

  const generateDeviceId = () => {
    // Generate a random device ID for testing
    const id = 'dev_' + Math.random().toString(36).substring(2, 15);
    setDeviceId(id);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="card-gradient max-w-md w-full mx-4 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Link New Device</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Device Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My iPhone"
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Device ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="Enter or generate device ID"
                className="flex-1 px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="button"
                onClick={generateDeviceId}
                className="px-4 py-3 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-colors"
              >
                Generate
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              This should be a unique identifier from your phone. For testing, you can generate one.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-300">
              📱 <strong>Mobile App Required:</strong> Install our companion app on your phone to automatically send location and battery updates.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 button-primary"
            >
              Link Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
