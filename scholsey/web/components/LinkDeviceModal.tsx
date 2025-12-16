'use client';

import { useState } from 'react';
import { Smartphone, X, Sparkles } from 'lucide-react';

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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="card-gradient max-w-md w-full p-8 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Link New Device</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-slate-700/50 p-2 rounded-lg smooth-transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Device Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My iPhone"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent smooth-transition"
              required
              autoFocus
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
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent smooth-transition"
                required
              />
              <button
                type="button"
                onClick={generateDeviceId}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:from-purple-600/30 hover:to-blue-600/30 hover:border-purple-400 smooth-transition"
              >
                <Sparkles className="w-4 h-4" />
                Generate
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              This should be a unique identifier from your phone. For testing, you can generate one.
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300 flex items-start gap-2">
              <Smartphone className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Real Phone Tracking:</strong> Use the mobile tracker page or app to get your actual device ID.
              </span>
            </p>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-600 hover:text-white border border-slate-600 smooth-transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name || !deviceId}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed border border-transparent smooth-transition font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
            >
              Link Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
