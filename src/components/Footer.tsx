import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Scissors, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Ruler, 
  Calendar, 
  Navigation
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenMeasurementSlip: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenMeasurementSlip,
  onScrollToSection,
}) => {
  return (
    <footer className="bg-gradient-to-b from-[#1E1116] via-[#160B10] to-[#0D0509] text-gray-300 pt-16 pb-12 border-t border-amber-400/20 relative overflow-hidden">
      {/* Decorative top gold border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Boutique Story */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-gray-950 flex items-center justify-center font-bold shadow-lg">
                <Scissors className="w-6 h-6 transform -rotate-45" />
              </div>
              <div>
                <span className="font-brand text-2xl font-black text-white tracking-wider">
                  SILAI ZONE
                </span>
                <p className="font-serif italic text-xs font-semibold text-amber-300">
                  "Sasta Mein Shandaar Silai"
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-sm">
              Kulti's trusted ladies and girls tailoring boutique. Salwar Suit, Astar Blouse, Princess Cut Blouse, Lehenga Choli, Plazo, Pant Pajama, aur Garara ki ultra-fine stitching with guaranteed boutique fitting &amp; finishing.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://wa.me/919339075854"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition shadow-md"
                title="WhatsApp Silai Zone"
              >
                <i className="fa-brands fa-whatsapp text-lg"></i>
              </a>

              <a
                href="tel:9339075854"
                className="w-9 h-9 rounded-xl bg-rose-800 hover:bg-rose-700 text-amber-200 flex items-center justify-center transition shadow-md"
                title="Call 9339075854"
              >
                <Phone className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenMeasurementSlip}
                className="px-3 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Ruler className="w-3.5 h-3.5 text-amber-400" />
                <span>Naap Slip</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-amber-300">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium text-gray-300">
              <li>
                <button
                  onClick={() => onScrollToSection('creations')}
                  className="hover:text-amber-200 transition text-left"
                >
                  Our Recent Creations (Showcase)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('booking')}
                  className="hover:text-amber-200 transition text-left"
                >
                  Online Stitching Booking Form
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMeasurementSlip}
                  className="hover:text-amber-200 transition text-left"
                >
                  Create / Print Digital Naap Slip
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-amber-200 transition text-left text-rose-300 flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Master Dashboard</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Physical Address */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-amber-300">
              Shop Address &amp; Contact
            </h4>
            
            <div className="space-y-2.5 text-xs text-gray-300">
              {/* Phone */}
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[11px]">Direct Call / Inquiry:</span>
                  <a
                    href="tel:9339075854"
                    className="font-bold text-amber-200 hover:text-white text-sm tracking-wide"
                  >
                    9339075854
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[11px]">Boutique Location:</span>
                  <p className="font-semibold text-white">
                    Imli Talab, Kathgola, Kulti, near Kulti Station
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Kathgola Road, Kulti, West Bengal
                  </p>
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[11px]">Operational Hours:</span>
                  <p className="text-gray-200">Monday – Saturday: 09:30 AM to 09:00 PM</p>
                  <p className="text-gray-200">Sunday: 10:00 AM to 06:00 PM</p>
                </div>
              </div>
            </div>

            {/* Direction Button */}
            <div className="pt-1">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Imli+Talab+Kathgola+Kulti+near+Kulti+Station"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-amber-200 border border-white/15 transition"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span>Get Directions on Map</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Silai Zone Boutique. All rights reserved. Sasta Mein Shandaar Silai.</p>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gray-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Kulti
            </span>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="text-gray-400 hover:text-amber-200 transition"
            >
              Masterji Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
