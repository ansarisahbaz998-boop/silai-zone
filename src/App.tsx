import React, { useState, useEffect } from 'react';
import { 
  PortfolioItem, 
  CustomerInquiry, 
  MeasurementSlip, 
  BoutiqueInfo, 
  InquiryStatus 
} from './types';
import { 
  INITIAL_BOUTIQUE_INFO, 
  INITIAL_PORTFOLIO, 
  INITIAL_INQUIRIES, 
  CATEGORIES 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryMarquee } from './components/CategoryMarquee';
import { PortfolioShowcase } from './components/PortfolioShowcase';
import { InquiryForm } from './components/InquiryForm';
import { MeasurementSlipModal } from './components/MeasurementSlipModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Phone, MessageCircle, Ruler, Sparkles, ChevronUp, Download } from 'lucide-react';
import { usePWAInstall } from './hooks/usePWAInstall';
import { verifyAdminCredentials, isAdminSessionActive, setAdminSessionActive } from './utils/adminAuth';

export default function App() {
  // Persistence States
  const [boutiqueInfo, setBoutiqueInfo] = useState<BoutiqueInfo>(() => {
    const saved = localStorage.getItem('silai_zone_info');
    return saved ? JSON.parse(saved) : INITIAL_BOUTIQUE_INFO;
  });

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('silai_zone_portfolio');
    if (!saved) return INITIAL_PORTFOLIO;
    try {
      const parsed: PortfolioItem[] = JSON.parse(saved);
      const defaultMap = new Map(INITIAL_PORTFOLIO.map((item) => [item.id, item]));
      // Update default preset items with the verified matching images
      const merged = parsed.map((item) => {
        const defaultItem = defaultMap.get(item.id);
        if (defaultItem && item.image.includes('unsplash.com')) {
          return { ...item, image: defaultItem.image };
        }
        return item;
      });
      const existingIds = new Set(merged.map((item) => item.id));
      const missingDefaults = INITIAL_PORTFOLIO.filter((item) => !existingIds.has(item.id));
      return [...merged, ...missingDefaults];
    } catch {
      return INITIAL_PORTFOLIO;
    }
  });

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    const saved = localStorage.getItem('silai_zone_inquiries');
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  const [measurementSlips, setMeasurementSlips] = useState<MeasurementSlip[]>(() => {
    const saved = localStorage.getItem('silai_zone_slips');
    return saved ? JSON.parse(saved) : [];
  });

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return isAdminSessionActive();
  });

  // UI Modal States
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);

  // Active Category Filter for Showcase
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Prefill Data for Booking Form
  const [bookingPrefill, setBookingPrefill] = useState<{
    category?: string;
    note?: string;
    slipId?: string;
  }>({});

  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('silai_zone_info', JSON.stringify(boutiqueInfo));
  }, [boutiqueInfo]);

  useEffect(() => {
    localStorage.setItem('silai_zone_portfolio', JSON.stringify(portfolioItems));
  }, [portfolioItems]);

  useEffect(() => {
    localStorage.setItem('silai_zone_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('silai_zone_slips', JSON.stringify(measurementSlips));
  }, [measurementSlips]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Admin Authentication handlers (Username: MD Irfan Ansari, Password: Sahbaz@sah6666)
  const handleAuthenticateAdmin = (
    username: string, 
    password: string
  ): { success: boolean; error?: string } => {
    const result = verifyAdminCredentials(username, password);
    if (result.success) {
      setIsAdminAuthenticated(true);
      setAdminSessionActive(true);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminSessionActive(false);
  };

  // CRUD for Portfolio Showcase
  const handleAddPortfolioItem = (item: PortfolioItem) => {
    setPortfolioItems((prev) => [item, ...prev]);
  };

  const handleUpdatePortfolioItem = (item: PortfolioItem) => {
    setPortfolioItems((prev) =>
      prev.map((existing) => (existing.id === item.id ? item : existing))
    );
  };

  const handleDeletePortfolioItem = (id: string) => {
    setPortfolioItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetPortfolio = () => {
    setPortfolioItems(INITIAL_PORTFOLIO);
    localStorage.setItem('silai_zone_portfolio', JSON.stringify(INITIAL_PORTFOLIO));
  };

  // Inquiry handlers
  const handleNewInquiry = (newInquiry: CustomerInquiry) => {
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  const handleUpdateInquiryStatus = (id: string, status: InquiryStatus, notes?: string) => {
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id === id) {
          return {
            ...inq,
            status,
            adminNotes: notes !== undefined ? notes : inq.adminNotes,
          };
        }
        return inq;
      })
    );
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
  };

  // Measurement Slip handlers
  const handleSaveMeasurementSlip = (slip: MeasurementSlip) => {
    setMeasurementSlips((prev) => {
      const exists = prev.some((s) => s.id === slip.id);
      if (exists) {
        return prev.map((s) => (s.id === slip.id ? slip : s));
      }
      return [slip, ...prev];
    });
    setBookingPrefill((prev) => ({
      ...prev,
      slipId: slip.id,
      category: slip.clothCategory,
    }));
  };

  // Navigation and booking triggers
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategoryFromMarquee = (categoryName: string) => {
    setSelectedCategoryFilter(categoryName);
    scrollToSection('creations');
  };

  const handleBookFromCategory = (categoryName: string) => {
    setBookingPrefill({
      category: categoryName,
      note: `Requested stitching for ${categoryName}`,
    });
    scrollToSection('booking');
  };

  const handleBookFromShowcase = (categoryName: string, itemTitle: string) => {
    setBookingPrefill({
      category: categoryName,
      note: `Interested in design: "${itemTitle}". Please recommend fabric length and neck styling.`,
    });
    scrollToSection('booking');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#2B2326]">
      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Main Navbar */}
      <Navbar
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onOpenMeasurementSlip={() => setIsMeasurementModalOpen(true)}
        onScrollToSection={scrollToSection}
        isAdmin={isAdminAuthenticated}
        onLogout={handleLogoutAdmin}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onBookNow={() => scrollToSection('booking')}
          onOpenMeasurementSlip={() => setIsMeasurementModalOpen(true)}
          onExploreCreations={() => scrollToSection('creations')}
        />

        {/* Infinite Auto-Scrolling Categories Carousel (Row-wise marquee) */}
        <CategoryMarquee
          onSelectCategory={handleSelectCategoryFromMarquee}
          onBookCategory={handleBookFromCategory}
          selectedCategory={selectedCategoryFilter}
        />

        {/* Tailor Work Showcase & CRUD Portfolio */}
        <PortfolioShowcase
          items={portfolioItems}
          selectedCategoryFilter={selectedCategoryFilter}
          onFilterChange={setSelectedCategoryFilter}
          onBookItem={handleBookFromShowcase}
          isAdmin={isAdminAuthenticated}
          onAuthenticateAdmin={handleAuthenticateAdmin}
          onAddItem={handleAddPortfolioItem}
          onUpdateItem={handleUpdatePortfolioItem}
          onDeleteItem={handleDeletePortfolioItem}
        />

        {/* Customer Inquiry / Booking System */}
        <InquiryForm
          prefilledCategory={bookingPrefill.category}
          prefilledNote={bookingPrefill.note}
          savedMeasurementSlipId={bookingPrefill.slipId}
          onInquirySubmitted={handleNewInquiry}
          onOpenMeasurementSlip={() => setIsMeasurementModalOpen(true)}
        />
      </main>

      {/* Footer & Contact Details */}
      <Footer
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onOpenMeasurementSlip={() => setIsMeasurementModalOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Modals */}
      <MeasurementSlipModal
        isOpen={isMeasurementModalOpen}
        onClose={() => setIsMeasurementModalOpen(false)}
        onSaveSlip={handleSaveMeasurementSlip}
      />

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        isAdminAuthenticated={isAdminAuthenticated}
        onAuthenticate={handleAuthenticateAdmin}
        onLogout={handleLogoutAdmin}
        portfolioItems={portfolioItems}
        onAddPortfolioItem={handleAddPortfolioItem}
        onUpdatePortfolioItem={handleUpdatePortfolioItem}
        onDeletePortfolioItem={handleDeletePortfolioItem}
        onResetPortfolio={handleResetPortfolio}
        inquiries={inquiries}
        onUpdateInquiryStatus={handleUpdateInquiryStatus}
        onDeleteInquiry={handleDeleteInquiry}
        measurementSlips={measurementSlips}
        boutiqueInfo={boutiqueInfo}
        onUpdateBoutiqueInfo={setBoutiqueInfo}
      />

      {/* Floating Action Buttons for Mobile Users */}
      <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-2.5 items-end">
        {/* Scroll To Top */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-rose-950 border border-rose-200 shadow-md flex items-center justify-center hover:bg-rose-50 transition active:scale-90"
            title="Scroll to Top"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}

        {/* Quick Naap Slip trigger */}
        <button
          onClick={() => setIsMeasurementModalOpen(true)}
          className="px-3.5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-gray-950 font-bold text-xs shadow-lg hover:from-amber-300 hover:to-amber-400 transition flex items-center gap-1.5 active:scale-95 border border-amber-300/40"
        >
          <Ruler className="w-4 h-4 text-gray-950" />
          <span className="hidden sm:inline">Naap Parchi</span>
        </button>

        {/* WhatsApp Masterji Direct Chat */}
        <a
          href="https://wa.me/919339075854?text=Namaste%20Silai%20Zone!%20Mujhe%20tailoring%20stitching%20ke%20bare%20mein%20inquiry%20karni%20hai."
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 active:scale-95 border border-white/20"
          title="Direct WhatsApp with Masterji"
        >
          <i className="fa-brands fa-whatsapp text-lg"></i>
          <span>WhatsApp Masterji</span>
        </a>
      </div>
    </div>
  );
}
