import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-700 px-4 py-2 text-xs font-semibold text-white shadow-2xl border border-amber-300/40 animate-pulse">
      <WifiOff className="w-4 h-4 text-amber-200" />
      <span>Offline Mode — Silai Zone designs &amp; naap slips are cached.</span>
    </div>
  );
};
