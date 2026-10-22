import React, { useRef, useState } from 'react';
import { CATEGORIES } from '../data/mockData';
import { CategoryItem } from '../types';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Scissors } from 'lucide-react';

interface CategoryMarqueeProps {
  onSelectCategory: (categoryName: string) => void;
  onBookCategory: (categoryName: string) => void;
  selectedCategory?: string;
}

export const CategoryMarquee: React.FC<CategoryMarqueeProps> = ({
  onSelectCategory,
  onBookCategory,
  selectedCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // We duplicate the array 3 times for a truly seamless, glitchless right-to-left marquee loop
  const duplicatedCategories = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES];

  const scrollManual = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-[#FFFDF9] via-[#FDF8F3] to-[#FFFDF9] relative overflow-hidden border-y border-amber-200/40">
      {/* Decorative luxury pattern hints */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Hamare Specialist Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-900 tracking-tight font-bold">
              Har Style Mein Perfect Silai
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Select any category to view recent work designs or book your customized stitching.
            </p>
          </div>

          {/* Controls: Manual navigation arrows & Pause toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-medium text-gray-500 mr-1 hidden sm:inline-block">
              Auto-scrolling • Hover to pause
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                isPaused 
                  ? 'bg-amber-100 text-amber-800 border-amber-300 font-semibold' 
                  : 'bg-white/80 text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
              title="Pause or Resume marquee animation"
            >
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button
              onClick={() => scrollManual('left')}
              className="w-8 h-8 rounded-full bg-white border border-rose-200 text-rose-900 flex items-center justify-center hover:bg-rose-50 transition shadow-xs active:scale-90"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollManual('right')}
              className="w-8 h-8 rounded-full bg-white border border-rose-200 text-rose-900 flex items-center justify-center hover:bg-rose-50 transition shadow-xs active:scale-90"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Ribbon Marquee Track */}
      <div 
        ref={scrollContainerRef}
        className="w-full overflow-x-auto no-scrollbar scroll-smooth relative py-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => {
          // slight delay after touch before resuming
          setTimeout(() => setIsPaused(false), 2000);
        }}
      >
        <div 
          className={`flex gap-4 sm:gap-6 px-4 ${isPaused ? '' : 'animate-marquee'}`}
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {duplicatedCategories.map((cat, index) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <div
                key={`${cat.id}-${index}`}
                className={`group relative w-60 sm:w-72 shrink-0 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5 border ${
                  isSelected 
                    ? 'ring-3 ring-amber-500 border-amber-500' 
                    : 'border-rose-100 hover:border-amber-300'
                }`}
                onClick={() => onSelectCategory(cat.name)}
              >
                {/* Background Image with warm grading */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-rose-950">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                  />
                  {/* Rich gradient overlay so text is crystal clear */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/45 to-transparent"></div>

                  {/* Category quality badge on top */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-300/40 text-amber-300 text-xs font-bold shadow-md">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Boutique Tailored</span>
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-rose-900/80 backdrop-blur-md text-[10px] font-semibold text-rose-100 border border-rose-300/30">
                    {cat.turnaroundDays}
                  </div>

                  {/* Bottom details card */}
                  <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                    <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-medium tracking-wide mb-1">
                      <Scissors className="w-3 h-3 text-amber-400" />
                      <span>{cat.hindiName}</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-200 transition-colors leading-tight">
                      {cat.name}
                    </h3>

                    <p className="text-[11px] text-gray-300 line-clamp-2 mt-1 leading-snug font-normal">
                      {cat.description}
                    </p>

                    {/* Quick action buttons on hover / mobile */}
                    <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-amber-200 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore Works <ArrowRight className="w-3 h-3" />
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookCategory(cat.name);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-[11px] shadow-sm transition active:scale-95"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-6 text-center">
        <p className="text-xs text-rose-950/60 font-medium">
          🌟 Custom sizes, lining options, piping, designer necklines, and instant WhatsApp booking available for all categories.
        </p>
      </div>
    </section>
  );
};
