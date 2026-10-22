import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle, Share2, PlusSquare } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '',
  variant = 'compact'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running inside standalone app mode
  if (isInstalled && !justInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      {variant === 'banner' ? (
        <div className={`bg-gradient-to-r from-pink-900 via-rose-900 to-amber-900 text-white p-3 sm:p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-amber-300/30 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-scissors text-amber-300 text-xl"></i>
            </div>
            <div>
              <p className="font-semibold text-amber-100 text-sm sm:text-base flex items-center gap-2">
                Install "Silai Zone" App on Your Mobile
                <span className="bg-amber-400 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Fast & Free</span>
              </p>
              <p className="text-xs text-rose-200">Book tailoring in 1-tap, save your measurement slips, and browse latest designs offline anytime.</p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-gray-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4" />
            Download / Install App
          </button>
        </div>
      ) : variant === 'full' ? (
        <button
          onClick={handleInstallClick}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-800 to-pink-900 hover:from-rose-700 hover:to-pink-800 text-amber-200 border border-amber-400/40 shadow-md font-medium text-xs sm:text-sm transition-all active:scale-95 ${className}`}
        >
          <Smartphone className="w-4 h-4 text-amber-300" />
          <span>Install Silai Zone App</span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          title="Install Silai Zone App to Home Screen"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-800 font-semibold text-xs transition-all active:scale-95 ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-amber-700 animate-bounce" />
          <span>Install App</span>
        </button>
      )}

      {/* Guide Modal for iOS Safari / Unsupported Browsers / Manual Steps */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-rose-100 relative">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-900 text-amber-300 flex items-center justify-center font-bold text-xl shadow-md">
                SZ
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900">Download Silai Zone App</h3>
                <p className="text-xs text-rose-800 font-medium">Sasta Mein Shandaar Silai • PWA Mobile App</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3.5 text-xs sm:text-sm text-gray-700 bg-amber-50/60 p-4 rounded-xl border border-amber-200/60">
                <p className="font-semibold text-gray-900 flex items-center gap-1.5 text-rose-900">
                  <Smartphone className="w-4 h-4 text-rose-700" />
                  Install on iPhone / iPad (Safari):
                </p>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                  <p>In Safari, tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-1 text-blue-600" /> at bottom bar.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                  <p>Scroll down in the options menu and select <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-gray-700" />.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                  <p>Tap <strong>Add</strong> at top right. Silai Zone icon will now appear on your phone home screen!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs sm:text-sm text-gray-700 bg-amber-50/60 p-4 rounded-xl border border-amber-200/60">
                <p className="font-semibold text-gray-900 flex items-center gap-1.5 text-rose-900">
                  <Smartphone className="w-4 h-4 text-rose-700" />
                  Install on Android / Chrome:
                </p>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                  <p>Tap the <strong>three dots (⋮)</strong> menu at the top right of Chrome.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                  <p>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                  <p>Confirm by clicking <strong>Install</strong>. Done!</p>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> No App Store needed • Works offline
              </span>
              <button
                onClick={() => setShowGuide(false)}
                className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-amber-200 font-semibold rounded-lg text-xs"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
