'use client';

import { useState } from 'react';
import { Shield, Lock, Unlock, Volume2, VolumeX, Trash2, MapPin, AlertTriangle } from 'lucide-react';

interface SecurityControlsProps {
  device: {
    id: string;
    name: string;
    deviceId: string;
    isLocked: boolean;
    isWiped: boolean;
    alarmActive: boolean;
    securityStatus: string;
  };
  onSendCommand: (deviceId: string, commandType: string) => void;
  onMarkStatus: (deviceId: string, status: 'stolen' | 'safe') => void;
}

export default function SecurityControls({ device, onSendCommand, onMarkStatus }: SecurityControlsProps) {
  const [confirmWipe, setConfirmWipe] = useState(false);

  const handleLockToggle = () => {
    onSendCommand(device.deviceId, device.isLocked ? 'unlock' : 'lock');
  };

  const handleAlarmToggle = () => {
    onSendCommand(device.deviceId, device.alarmActive ? 'alarm_off' : 'alarm_on');
  };

  const handleWipe = () => {
    if (confirmWipe) {
      onSendCommand(device.deviceId, 'wipe');
      setConfirmWipe(false);
    } else {
      setConfirmWipe(true);
      setTimeout(() => setConfirmWipe(false), 5000);
    }
  };

  const handleLocate = () => {
    onSendCommand(device.deviceId, 'locate');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'suspicious': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'stolen': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="card-gradient p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-400" />
          Security Controls
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(device.securityStatus)}`}>
          {device.securityStatus.toUpperCase()}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Lock/Unlock */}
        <button
          onClick={handleLockToggle}
          className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 smooth-transition ${
            device.isLocked
              ? 'bg-blue-500/20 border-blue-500 text-blue-300'
              : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-blue-400'
          }`}
        >
          {device.isLocked ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
          <span className="text-sm font-semibold">{device.isLocked ? 'Locked' : 'Unlocked'}</span>
        </button>

        {/* Alarm */}
        <button
          onClick={handleAlarmToggle}
          className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 smooth-transition ${
            device.alarmActive
              ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
              : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-red-400'
          }`}
        >
          {device.alarmActive ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          <span className="text-sm font-semibold">{device.alarmActive ? 'Alarm ON' : 'Alarm OFF'}</span>
        </button>

        {/* Locate */}
        <button
          onClick={handleLocate}
          className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 bg-slate-700/50 border-slate-600 text-gray-300 hover:border-purple-400 smooth-transition"
        >
          <MapPin className="w-6 h-6" />
          <span className="text-sm font-semibold">Locate Now</span>
        </button>

        {/* Wipe Data */}
        <button
          onClick={handleWipe}
          disabled={device.isWiped}
          className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 smooth-transition ${
            device.isWiped
              ? 'bg-gray-800/50 border-gray-700 text-gray-600 cursor-not-allowed'
              : confirmWipe
              ? 'bg-red-600/30 border-red-500 text-red-300 animate-pulse'
              : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-red-400'
          }`}
        >
          <Trash2 className="w-6 h-6" />
          <span className="text-xs font-semibold">
            {device.isWiped ? 'Wiped' : confirmWipe ? 'Confirm?' : 'Wipe Data'}
          </span>
        </button>
      </div>

      {/* Status Actions */}
      <div className="pt-4 border-t border-gray-700 space-y-2">
        <p className="text-xs text-gray-400 mb-2">Device Status:</p>
        <div className="flex gap-2">
          <button
            onClick={() => onMarkStatus(device.id, 'stolen')}
            disabled={device.securityStatus === 'stolen'}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/50 rounded-lg text-red-300 hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed smooth-transition"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-semibold">Mark Stolen</span>
          </button>
          <button
            onClick={() => onMarkStatus(device.id, 'safe')}
            disabled={device.securityStatus === 'safe'}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/50 rounded-lg text-green-300 hover:bg-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed smooth-transition"
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-semibold">Mark Safe</span>
          </button>
        </div>
      </div>

      {/* Warning Message */}
      {confirmWipe && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-xs text-red-300">
            ⚠️ <strong>Warning:</strong> This will permanently delete all data on the device. Click again to confirm.
          </p>
        </div>
      )}
    </div>
  );
}
