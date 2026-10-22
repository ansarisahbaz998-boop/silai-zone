import React, { useState } from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Phone, 
  Ruler, 
  Layers, 
  Calendar, 
  Menu, 
  X, 
  ShieldCheck, 
  Scissors,
  Sparkles,
  Lock,
  Unlock
} from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenMeasurementSlip: () => void;
  onScrollToSection: (sectionId: string) => void;
  isAdmin: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onOpenMeasurementSlip,
  onScrollToSection,
  isAdmin,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    onScrollToSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-rose-100 shadow-xs transition-all">
      {/* Top micro-bar with contact & location badge */}
      <div className="bg-gradient-to-r from-rose-950 via-pink-950 to-rose-900 text-amber-200 px-4 py-1.5 text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <i className="fa-solid fa-location-dot text-amber-400"></i>
              <span>Imli Talab, Kathgola, Kulti (Near Kulti Station)</span>
            </span>
            <span className="hidden md:inline-block text-rose-300">•</span>
            <span className="hidden md:inline-block text-rose-200">
              Timings: 09:30 AM – 09:00 PM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:9339075854"
              className="flex items-center gap-1.5 font-bold hover:text-white transition active:scale-95"
            >
              <Phone className="w-3 h-3 text-amber-300" />
              <span>Call: 9339075854</span>
            </a>

            <span className="text-rose-400">|</span>

            <a
              href="https://wa.me/919339075854"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-1"
            >
              <i className="fa-brands fa-whatsapp"></i>
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Insignia Icon */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-900 to-pink-950 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-transform border border-amber-400/40">
            <Scissors className="w-6 h-6 transform -rotate-45" />
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-brand text-2xl sm:text-3xl font-extrabold tracking-wider bg-gradient-to-r from-rose-950 via-pink-900 to-amber-900 bg-clip-text text-transparent">
                SILAI ZONE
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-500 mb-1"></span>
            </div>
            <p className="font-serif italic text-xs font-semibold text-rose-800 -mt-1 tracking-wide">
              "Sasta Mein Shandaar Silai"
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-700">
          <button
            onClick={() => handleNavClick('creations')}
            className="hover:text-rose-900 transition flex items-center gap-1"
          >
            <span>Hamare Designs</span>
          </button>

          <button
            onClick={onOpenMeasurementSlip}
            className="px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 transition flex items-center gap-1.5"
          >
            <Ruler className="w-3.5 h-3.5 text-amber-700" />
            <span>Digital Naap Slip</span>
          </button>

          <button
            onClick={() => handleNavClick('booking')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-900 via-pink-900 to-rose-950 hover:from-rose-800 hover:to-pink-900 text-amber-200 font-bold transition shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>Book Stitching</span>
          </button>
        </nav>

        {/* Right Action Utilities (PWA Install + Admin Trigger + Mobile Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Install Button in Header */}
          <PWAInstallButton variant="compact" />

          {/* Admin Portal Button */}
          {isAdmin ? (
            <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-300 rounded-xl p-1">
              <button
                onClick={onOpenAdmin}
                className="px-2.5 py-1 text-xs font-bold text-emerald-900 hover:text-emerald-950 flex items-center gap-1.5 transition"
                title="Open Admin Control Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Admin (Irfan Ansari)</span>
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1 rounded-lg hover:bg-emerald-100 text-emerald-800 transition"
                  title="Lock / Sign Out Admin Session"
                >
                  <Unlock className="w-3.5 h-3.5 text-emerald-700" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
              title="Admin Portal (Owner Login Only)"
            >
              <Lock className="w-3.5 h-3.5 text-rose-900" />
              <span className="hidden sm:inline">Admin Portal</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-rose-100 px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNavClick('creations')}
            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-rose-50 text-gray-800 font-semibold text-sm flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-rose-800" />
            <span>Our Recent Creations (Designs)</span>
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenMeasurementSlip();
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-amber-50 text-amber-950 font-semibold text-sm flex items-center gap-2"
          >
            <Ruler className="w-4 h-4 text-amber-700" />
            <span>Digital Naap Parchi (Measurement Slip)</span>
          </button>

          <button
            onClick={() => handleNavClick('booking')}
            className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-rose-900 to-pink-900 text-amber-200 font-bold text-sm shadow-md"
          >
            Book Stitching Now
          </button>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Call us directly:</span>
            <a href="tel:9339075854" className="font-bold text-rose-900 text-sm">
              9339075854
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
