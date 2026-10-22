import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Scissors, 
  Sparkles, 
  Phone, 
  Ruler, 
  Calendar, 
  MapPin 
} from 'lucide-react';

interface HeroProps {
  onBookNow: () => void;
  onOpenMeasurementSlip: () => void;
  onExploreCreations: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onBookNow,
  onOpenMeasurementSlip,
  onExploreCreations,
}) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-14 lg:py-20 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3EA] to-[#FFFDF9]">
      {/* Decorative background embellishments */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-amber-200/25 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Branding, Tagline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-amber-500/15 border border-amber-300/80 text-rose-950 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Premium Ladies &amp; Kids Tailoring Boutique in Kulti</span>
            </div>

            {/* Brand Title & Tagline */}
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-1">
                <span className="font-brand text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-rose-950">
                  SILAI ZONE
                </span>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md rotate-6">
                  <Scissors className="w-5 h-5 sm:w-6 sm:h-6 text-gray-950" />
                </div>
              </div>

              {/* Tagline directly below brand name */}
              <h2 className="font-serif italic text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-rose-900 via-pink-800 to-amber-700 bg-clip-text text-transparent tracking-wide">
                "Sasta Mein Shandaar Silai"
              </h2>

              <p className="text-xs sm:text-sm font-semibold text-amber-900/80 mt-1">
                क्वालिटी सिलाई, शानदार फिनिशिंग और 100% परफेक्ट फिटिंग की पक्की गारंटी।
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Welcome to <strong>Silai Zone</strong>! Salwar suits, designer astar blouses, princess cut blouses, lehenga choli, pant-pajama, plazo, ya garara—hamare experienced master tailors dete hain boutique finish fitting aur finest stitching craftsmanship.
            </p>



            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                onClick={onBookNow}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-900 via-pink-900 to-rose-950 hover:from-rose-800 hover:to-pink-900 text-amber-200 font-bold text-sm sm:text-base shadow-lg shadow-rose-950/20 transition-all flex items-center justify-center gap-2 active:scale-95 border border-amber-300/40"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Book Stitching Online</span>
              </button>

              <button
                onClick={onOpenMeasurementSlip}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white hover:bg-amber-50/80 text-rose-950 font-bold text-sm sm:text-base shadow-sm border border-amber-300/80 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Ruler className="w-4 h-4 text-amber-700" />
                <span>Create Digital Naap Slip</span>
              </button>
            </div>

            {/* Direct Quick Contact */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-gray-600">
              <a
                href="tel:9339075854"
                className="flex items-center gap-1.5 text-rose-900 hover:underline"
              >
                <Phone className="w-3.5 h-3.5 text-rose-800" />
                <span>Call: 9339075854</span>
              </a>

              <span>•</span>

              <a
                href="https://wa.me/919339075854"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-700 hover:underline"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <span>WhatsApp Masterji</span>
              </a>

              <span>•</span>

              <span className="flex items-center gap-1 text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Imli Talab, Kathgola, Kulti</span>
              </span>
            </div>
          </div>

          {/* Right Column: Boutique Visual Collage & PWA Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Feature Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-rose-950">
                <img
                  src="/images/categories/salwar-suit.jpg"
                  alt="Silai Zone Boutique Designer Suit"
                  referrerPolicy="no-referrer"
                  className="w-full h-96 sm:h-[450px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-black/20"></div>

                {/* Overlaid Floating Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-100 shadow-lg text-gray-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                        Boutique Quality Guaranteed
                      </span>
                      <h4 className="font-serif font-bold text-base text-gray-900">
                        Princess Cut &amp; Bridal Finishing
                      </h4>
                      <p className="text-xs text-gray-600">
                        Customized Boutique Fit • Free trial alteration
                      </p>
                    </div>
                    <button
                      onClick={onExploreCreations}
                      className="px-3 py-1.5 rounded-xl bg-rose-900 text-amber-200 text-xs font-bold shadow-xs hover:bg-rose-800 transition"
                    >
                      View
                    </button>
                  </div>
                </div>

                {/* Top Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-300/40 text-amber-300 text-xs font-bold">
                  ★ 4.9 Rating in Kulti
                </div>
              </div>

              {/* Floating Needle & Tape Embellishment */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-2 shadow-xl border-2 border-white flex flex-col items-center justify-center text-gray-950 rotate-12 hidden sm:flex">
                <i className="fa-solid fa-tape text-xl mb-0.5"></i>
                <span className="text-[10px] font-black uppercase text-center leading-tight">100% Fit</span>
              </div>
            </div>
          </div>
        </div>

        {/* PWA In-App Banner Mount */}
        <div className="mt-10 max-w-4xl mx-auto">
          <PWAInstallButton variant="banner" />
        </div>
      </div>
    </section>
  );
};
