import React, { useState } from 'react';
import { PortfolioItem } from '../types';
import { CATEGORIES } from '../data/mockData';
import { 
  Sparkles, 
  Search, 
  Clock, 
  Eye, 
  Scissors, 
  X, 
  Plus, 
  ShoppingBag,
  Edit2, 
  Trash2, 
  Filter, 
  Lock, 
  Unlock, 
  Save, 
  Check, 
  AlertCircle,
  User,
  KeyRound,
  HelpCircle,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import {
  DEFAULT_ADMIN_USERNAME,
  SECURITY_QUESTION_1,
  SECURITY_QUESTION_2,
  resetPasswordWithSecurityQuestions,
  recoverUsernameWithSecurityQuestions,
  resetUsernameWithSecurityQuestions,
  getAdminUsername
} from '../utils/adminAuth';

interface PortfolioShowcaseProps {
  items: PortfolioItem[];
  selectedCategoryFilter: string;
  onFilterChange: (cat: string) => void;
  onBookItem: (category: string, itemTitle: string) => void;
  isAdmin: boolean;
  onAuthenticateAdmin: (username: string, password: string) => { success: boolean; error?: string };
  onAddItem: (item: PortfolioItem) => void;
  onUpdateItem: (item: PortfolioItem) => void;
  onDeleteItem: (id: string) => void;
}

export const PortfolioShowcase: React.FC<PortfolioShowcaseProps> = ({
  items,
  selectedCategoryFilter,
  onFilterChange,
  onBookItem,
  isAdmin,
  onAuthenticateAdmin,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activePreview, setActivePreview] = useState<PortfolioItem | null>(null);

  // Management / Edit Mode state
  const [isManageMode, setIsManageMode] = useState(isAdmin);

  // Admin Auth prompt modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [enteredUsername, setEnteredUsername] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Security Question Recovery & Reset state inside Auth Modal
  const [isResetMode, setIsResetMode] = useState(false);
  const [recoveryType, setRecoveryType] = useState<'username' | 'password'>('username');
  const [resetAnswer1, setResetAnswer1] = useState('');
  const [resetAnswer2, setResetAnswer2] = useState('');
  const [recoveredUsername, setRecoveredUsername] = useState('');
  const [customNewUsername, setCustomNewUsername] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // Upload & Edit Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0].name);
  const [formStitchingType, setFormStitchingType] = useState('Designer Cut with Piping');
  const [formTurnaround, setFormTurnaround] = useState('3 Days');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formTags, setFormTags] = useState('Salwar Suit, Silk, Designer');
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Delete Confirmation State
  const [itemToDelete, setItemToDelete] = useState<PortfolioItem | null>(null);

  const filterCategories = [
    'All',
    'Salwar Suit',
    'Princess Cut Blouse',
    'Astar Blouse',
    'Lehenga Choli',
    'Top',
    'Plazo',
    'Pant Pajama',
    'Garara',
    'Saya',
  ];

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategoryFilter === 'All' ||
      item.category.toLowerCase() === selectedCategoryFilter.toLowerCase();

    const matchesSearch =
      searchTerm.trim() === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.stitchingType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Strict check: Only authorized admin can upload, edit, or delete
  const requireAdminAuth = (action: () => void) => {
    if (isAdmin) {
      action();
    } else {
      setPendingAction(() => action);
      setEnteredUsername('');
      setEnteredPassword('');
      setAuthError('');
      setIsResetMode(false);
      setShowAuthModal(true);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPassword.trim()) {
      setAuthError('Kripya Admin Password darj karein.');
      return;
    }

    const usernameToUse = enteredUsername.trim() || getAdminUsername();
    const result = onAuthenticateAdmin(usernameToUse, enteredPassword.trim());
    if (result.success) {
      setShowAuthModal(false);
      setIsManageMode(true);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      setAuthError(result.error || 'Galat Password! Kripya sahi password darj karein.');
    }
  };

  const handleRecoverUsername = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    setRecoveredUsername('');

    if (!resetAnswer1.trim() || !resetAnswer2.trim()) {
      setResetError('Kripya dono security sawalon ke sahi uttar darj karein.');
      return;
    }

    const result = recoverUsernameWithSecurityQuestions(resetAnswer1, resetAnswer2);
    if (result.success && result.username) {
      setRecoveredUsername(result.username);
      setResetSuccess(result.message);
    } else {
      setResetError(result.message);
    }
  };

  const handleUpdateUsername = () => {
    setResetError('');
    setResetSuccess('');

    if (!customNewUsername.trim() || customNewUsername.trim().length < 3) {
      setResetError('Naya username kam se kam 3 characters ka hona chahiye.');
      return;
    }

    const result = resetUsernameWithSecurityQuestions(resetAnswer1, resetAnswer2, customNewUsername.trim());
    if (result.success) {
      setRecoveredUsername(customNewUsername.trim());
      setResetSuccess(result.message);
      setCustomNewUsername('');
    } else {
      setResetError(result.message);
    }
  };

  const handleSecurityResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (!resetAnswer1.trim() || !resetAnswer2.trim()) {
      setResetError('Kripya dono security sawalon ke sahi uttar darj karein.');
      return;
    }

    if (!resetNewPassword.trim() || resetNewPassword.trim().length < 4) {
      setResetError('New password must be at least 4 characters long.');
      return;
    }

    const result = resetPasswordWithSecurityQuestions(resetAnswer1, resetAnswer2, resetNewPassword);
    if (result.success) {
      setResetSuccess(result.message);
      setEnteredPassword('');
      setEnteredUsername('');
      setTimeout(() => {
        setIsResetMode(false);
        setResetSuccess('');
        setResetAnswer1('');
        setResetAnswer2('');
        setResetNewPassword('');
      }, 1800);
    } else {
      setResetError(result.message);
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    requireAdminAuth(() => {
      setEditingItem(null);
      setFormTitle('');
      setFormCategory(selectedCategoryFilter !== 'All' ? selectedCategoryFilter : CATEGORIES[0].name);
      setFormStitchingType('Designer Handwork & Piping');
      setFormTurnaround('3 Days');
      setFormDescription('Finely stitched with soft pure cotton astar, matching piping, and durable lock stitching.');
      setFormImage('/images/categories/salwar-suit.jpg');
      setFormTags('Boutique, Handwork, Festive');
      setFormError('');
      setShowFormModal(true);
    });
  };

  // Open Edit Modal
  const handleOpenEdit = (item: PortfolioItem) => {
    requireAdminAuth(() => {
      setEditingItem(item);
      setFormTitle(item.title);
      setFormCategory(item.category);
      setFormStitchingType(item.stitchingType);
      setFormTurnaround(item.turnaround);
      setFormDescription(item.description);
      setFormImage(item.image);
      setFormTags(item.tags.join(', '));
      setFormError('');
      setShowFormModal(true);
    });
  };

  // Handle Delete - requires admin auth
  const handleDelete = (item: PortfolioItem) => {
    requireAdminAuth(() => {
      setItemToDelete(item);
    });
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDeleteItem(itemToDelete.id);
      triggerToast(`Deleted "${itemToDelete.title}"`);
      if (activePreview?.id === itemToDelete.id) {
        setActivePreview(null);
      }
      setItemToDelete(null);
    }
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Handle image upload from file or camera
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save creation post (Create or Update)
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Please enter a design title.');
      return;
    }

    if (!formImage.trim()) {
      setFormError('Please upload a photo or enter an image URL.');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingItem) {
      const updated: PortfolioItem = {
        ...editingItem,
        title: formTitle.trim(),
        category: formCategory,
        stitchingType: formStitchingType.trim(),
        turnaround: formTurnaround.trim(),
        description: formDescription.trim(),
        image: formImage.trim(),
        tags: tagsArray,
      };
      onUpdateItem(updated);
      triggerToast('Design updated successfully!');
    } else {
      const newItem: PortfolioItem = {
        id: `cr-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        stitchingType: formStitchingType.trim(),
        turnaround: formTurnaround.trim(),
        description: formDescription.trim(),
        image: formImage.trim(),
        tags: tagsArray,
        rating: 5,
        createdAt: new Date().toISOString().split('T')[0],
      };
      onAddItem(newItem);
      triggerToast('New design uploaded to creations!');
    }

    setShowFormModal(false);
    setEditingItem(null);
  };

  const isFullAdminAccess = Boolean(isAdmin);

  return (
    <section id="creations" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-xl border border-emerald-500 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Scissors className="w-3.5 h-3.5 text-amber-700" />
            <span>Hamare Naye Designs • Silai Zone Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-950 tracking-tight">
            Our Recent Creations
          </h2>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            Har suit aur blouse mein ultra-fine stitching, perfect body fitting, aur customized neckline design.
          </p>
        </div>

        {/* Action Controls: Direct Upload ONLY for authenticated Admin */}
        {isAdmin && (
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Admin: {getAdminUsername()}</span>
            </span>

            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Upload New Design</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar & Search Input */}
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-rose-100 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search design (e.g. velvet, bridal, boat neck)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 bg-gray-50/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 w-full sm:w-auto justify-between sm:justify-end">
            <span className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-rose-800" />
              <span>Showing <strong>{filteredItems.length}</strong> creations</span>
            </span>

            {isFullAdminAccess && (
              <span className="text-[11px] bg-amber-200/80 text-amber-950 font-bold px-2 py-0.5 rounded-md">
                ✏️ Admin Edit &amp; Delete Active
              </span>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-1">
          {filterCategories.map((category) => {
            const isActive = selectedCategoryFilter === category;
            return (
              <button
                key={category}
                onClick={() => onFilterChange(category)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-rose-900 text-amber-200 shadow-sm shadow-rose-900/30 ring-2 ring-rose-900/20'
                    : 'bg-rose-50/70 hover:bg-rose-100 text-rose-950 border border-rose-200/60'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Creations */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-rose-200 p-8">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-800 flex items-center justify-center mx-auto mb-3">
            <Scissors className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="font-serif text-lg font-bold text-gray-800">No creations found</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Try selecting another category, clearing your search, or uploading a new design.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                onFilterChange('All');
                setSearchTerm('');
              }}
              className="px-4 py-2 bg-rose-900 text-amber-200 rounded-xl text-xs font-bold hover:bg-rose-800 transition"
            >
              Show All Designs
            </button>
            {isAdmin && (
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
              >
                + Upload Design Now
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative"
            >
              {/* Direct Quick Edit/Delete Floating Badges when Admin Mode is Active */}
              {isFullAdminAccess && (
                <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-xl shadow-lg border border-amber-300/40">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(item);
                    }}
                    className="p-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs transition cursor-pointer"
                    title="Edit design details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}
                    className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition cursor-pointer"
                    title="Delete design"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div>
                {/* Image & Overlay */}
                <div 
                  className="relative h-64 overflow-hidden bg-rose-950 cursor-pointer"
                  onClick={() => setActivePreview(item)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-rose-950 shadow-xs">
                    {item.category}
                  </div>

                  {/* Quick Preview Icon */}
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <Eye className="w-4 h-4 text-amber-300" />
                  </div>

                  {/* Turnaround Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] text-amber-200 font-medium">
                    <Clock className="w-3 h-3 text-amber-300" />
                    <span>{item.turnaround}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-rose-800 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>{item.stitchingType}</span>
                  </div>

                  <h3 
                    onClick={() => setActivePreview(item)}
                    className="font-serif text-base font-bold text-gray-900 group-hover:text-rose-900 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer: User Options vs Admin Options */}
              <div className="p-4 pt-0">
                <div className="border-t border-rose-50 pt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onBookItem(item.category, item.title)}
                    className="flex-1 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-amber-200 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order Similar Fit</span>
                  </button>

                  <button
                    onClick={() => setActivePreview(item)}
                    className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition cursor-pointer"
                    title="View details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {/* Admin Edit & Delete buttons: Only visible for Admin to keep clean user interface */}
                  {isFullAdminAccess && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition cursor-pointer"
                        title="Edit design"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition cursor-pointer"
                        title="Delete design"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Zoom & Details View */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-amber-200/50 relative animate-in fade-in zoom-in-95 duration-200 my-8">
            <button
              onClick={() => setActivePreview(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-80 sm:h-96 w-full bg-rose-950">
              <img
                src={activePreview.image}
                alt={activePreview.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="px-2.5 py-1 rounded-full bg-amber-400 text-gray-950 text-xs font-bold mr-2">
                  {activePreview.category}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-rose-900/90 text-rose-100 text-xs font-semibold">
                  Custom Boutique Fit
                </span>
                <h3 className="font-serif text-2xl font-bold mt-2 text-white">
                  {activePreview.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-amber-600" />
                  Stitching Technique: {activePreview.stitchingType}
                </p>
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                  {activePreview.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-rose-50/50 p-3.5 rounded-2xl border border-rose-100 text-xs">
                <div>
                  <span className="text-gray-500 block text-[11px]">Turnaround Time:</span>
                  <span className="font-bold text-gray-800">{activePreview.turnaround}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Fitting Trial:</span>
                  <span className="font-bold text-emerald-700">Free Alteration</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Lining / Astar:</span>
                  <span className="font-bold text-gray-800">Available on request</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {activePreview.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const cat = activePreview.category;
                    const title = activePreview.title;
                    setActivePreview(null);
                    onBookItem(cat, title);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-900 to-pink-900 text-amber-200 font-bold text-sm shadow-md hover:from-rose-800 hover:to-pink-800 transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>Book Stitching for This Design</span>
                </button>

                {/* Edit & Delete in modal only shown to Admin */}
                {isFullAdminAccess && (
                  <>
                    <button
                      onClick={() => {
                        const it = activePreview;
                        setActivePreview(null);
                        handleOpenEdit(it);
                      }}
                      className="px-4 py-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4 text-amber-800" />
                      <span>Edit Post</span>
                    </button>

                    <button
                      onClick={() => {
                        const it = activePreview;
                        handleDelete(it);
                      }}
                      className="px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-red-200 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                      <span>Delete Post</span>
                    </button>
                  </>
                )}

                <a
                  href={`https://wa.me/919339075854?text=${encodeURIComponent(
                    `Namaste Silai Zone! Mujhe aapka recent design pasand aaya: "${activePreview.title}" (${activePreview.category}). Stitching and booking details batayein.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN AUTH MODAL: USERNAME & PASSWORD REQUIRED TO UPLOAD OR DELETE */}
      {showAuthModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-amber-300 relative animate-in zoom-in-95">
            <button
              onClick={() => {
                setShowAuthModal(false);
                setPendingAction(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>

            {!isResetMode ? (
              /* Username & Password Form */
              <div>
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-2 border border-amber-300">
                    <ShieldCheck className="w-6 h-6 text-amber-800" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-gray-900">
                    Admin Verification Required
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Photo upload ya delete karne ke liye Admin Username aur Password darj karein.
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-3 text-left">
                  {/* Username */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-rose-800" />
                        <span>Username</span>
                        <span className="text-[10px] text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsResetMode(true);
                          setRecoveryType('username');
                          setResetError('');
                          setResetSuccess('');
                          setRecoveredUsername('');
                        }}
                        className="text-[10px] text-rose-800 hover:text-rose-950 font-bold hover:underline cursor-pointer"
                      >
                        Forgot Username?
                      </button>
                    </div>
                    <input
                      type="text"
                      autoFocus
                      value={enteredUsername}
                      onChange={(e) => setEnteredUsername(e.target.value)}
                      placeholder="Enter Admin Username (Optional)"
                      autoComplete="off"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-rose-800" />
                        <span>Password</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsResetMode(true);
                          setRecoveryType('password');
                          setResetError('');
                          setResetSuccess('');
                        }}
                        className="text-[10px] text-rose-800 hover:text-rose-950 font-bold hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={enteredPassword}
                        onChange={(e) => setEnteredPassword(e.target.value)}
                        placeholder="••••••••••••"
                        autoComplete="current-password"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500 pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {authError && (
                    <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-900 to-pink-900 text-amber-200 font-bold text-xs shadow-md cursor-pointer hover:from-rose-800 hover:to-pink-800 transition"
                  >
                    Verify &amp; Continue
                  </button>

                  <div className="pt-1 flex items-center justify-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(true);
                        setRecoveryType('username');
                        setResetError('');
                        setResetSuccess('');
                        setRecoveredUsername('');
                      }}
                      className="text-[11px] text-amber-900 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer bg-amber-50 px-2 py-1 rounded-md border border-amber-200"
                    >
                      <User className="w-3 h-3 text-amber-700" />
                      <span>Forgot Username?</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(true);
                        setRecoveryType('password');
                        setResetError('');
                        setResetSuccess('');
                      }}
                      className="text-[11px] text-amber-900 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer bg-amber-50 px-2 py-1 rounded-md border border-amber-200"
                    >
                      <KeyRound className="w-3 h-3 text-amber-700" />
                      <span>Forgot Password?</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Security Question Recovery & Reset Modal */
              <div className="text-left animate-in fade-in">
                <div className="text-center mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center mx-auto mb-1 border border-rose-300">
                    <HelpCircle className="w-5 h-5 text-rose-800" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-gray-900">
                    Security Question Recovery
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Answer questions to recover username or reset password.
                  </p>
                </div>

                {/* Tab switcher */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-2.5 border border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryType('username');
                      setResetError('');
                      setResetSuccess('');
                    }}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                      recoveryType === 'username'
                        ? 'bg-rose-900 text-amber-200 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <User className="w-3 h-3" />
                    <span>Forgot Username</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryType('password');
                      setResetError('');
                      setResetSuccess('');
                    }}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                      recoveryType === 'password'
                        ? 'bg-rose-900 text-amber-200 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Forgot Password</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                    <label className="block text-[11px] font-bold text-gray-800 mb-1">
                      1. {SECURITY_QUESTION_1}
                    </label>
                    <input
                      type="text"
                      required
                      value={resetAnswer1}
                      onChange={(e) => setResetAnswer1(e.target.value)}
                      placeholder="Answer..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                    />
                  </div>

                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                    <label className="block text-[11px] font-bold text-gray-800 mb-1">
                      2. {SECURITY_QUESTION_2}
                    </label>
                    <input
                      type="text"
                      required
                      value={resetAnswer2}
                      onChange={(e) => setResetAnswer2(e.target.value)}
                      placeholder="Answer..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                    />
                  </div>

                  {recoveryType === 'username' ? (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleRecoverUsername}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-900 to-pink-900 text-amber-200 font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Verify &amp; Show Username</span>
                      </button>

                      {recoveredUsername && (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 animate-in fade-in">
                          <p className="text-[11px] text-emerald-900 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Verified! Admin Username:</span>
                          </p>
                          <div className="p-2 bg-white rounded-lg border border-emerald-200 flex items-center justify-between gap-1.5">
                            <strong className="text-xs font-mono text-gray-900">
                              {recoveredUsername}
                            </strong>
                            <button
                              type="button"
                              onClick={() => {
                                setEnteredUsername(recoveredUsername);
                                setIsResetMode(false);
                              }}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg transition shadow-xs cursor-pointer"
                            >
                              Use in Login
                            </button>
                          </div>

                          <div className="pt-1.5 border-t border-emerald-200/80">
                            <label className="block text-[10px] font-bold text-gray-700 mb-1">
                              Or change to a new username:
                            </label>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={customNewUsername}
                                onChange={(e) => setCustomNewUsername(e.target.value)}
                                placeholder="New username..."
                                className="flex-1 px-2 py-1 rounded-lg border border-gray-300 text-xs bg-white"
                              />
                              <button
                                type="button"
                                onClick={handleUpdateUsername}
                                className="px-2.5 py-1 bg-rose-900 hover:bg-rose-800 text-amber-200 text-[11px] font-bold rounded-lg cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleSecurityResetSubmit} className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-800 mb-1">
                          New Password (नया पासवर्ड):
                        </label>
                        <input
                          type="password"
                          required
                          value={resetNewPassword}
                          onChange={(e) => setResetNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          autoComplete="new-password"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-mono bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 rounded-xl bg-rose-900 text-amber-200 text-xs font-bold hover:bg-rose-800 cursor-pointer"
                      >
                        Reset Password
                      </button>
                    </form>
                  )}

                  {resetError && (
                    <div className="p-2 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-1 border border-red-200">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  {resetSuccess && (
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs flex items-center gap-1 font-semibold border border-emerald-200">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>{resetSuccess}</span>
                    </div>
                  )}

                  <div className="pt-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(false);
                        setResetError('');
                        setResetSuccess('');
                        setRecoveredUsername('');
                      }}
                      className="w-full py-1.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FULL UPLOAD / EDIT POST MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-300 relative my-6 max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Scissors className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-gray-900">
                    {editingItem ? 'Edit Creation Post' : 'Upload New Finished Work'}
                  </h4>
                  <p className="text-xs text-rose-800 font-medium">Silai Zone Creations Gallery</p>
                </div>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4 mt-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-1.5 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Design Title / Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Royal Brocade Princess Cut Blouse"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>

              {/* Category & Stitching Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 font-medium"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.hindiName})
                      </option>
                    ))}
                    <option value="Other Custom Dress">Other Custom Dress</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Stitching Technique / Cut
                  </label>
                  <input
                    type="text"
                    value={formStitchingType}
                    onChange={(e) => setFormStitchingType(e.target.value)}
                    placeholder="e.g. Double Lining Cotton Astar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
              </div>

              {/* Turnaround Time */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Turnaround Time / Delivery Days
                </label>
                <input
                  type="text"
                  value={formTurnaround}
                  onChange={(e) => setFormTurnaround(e.target.value)}
                  placeholder="e.g. 2-3 Days"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>

              {/* Photo Upload (Device / Camera) or URL */}
              <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 space-y-3">
                <label className="block text-xs font-bold text-gray-800 flex items-center justify-between">
                  <span>Photo (Upload from Mobile / PC or Paste URL) <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-gray-500 font-normal">Auto-compressed</span>
                </label>

                {/* File input */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-900 file:text-amber-200 hover:file:bg-rose-800 cursor-pointer"
                  />
                </div>

                {/* URL input */}
                <div>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="Or enter image URL (https://...)"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  />
                </div>

                {/* Live Preview */}
                {formImage && (
                  <div className="relative h-44 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-300 shadow-inner">
                    <img src={formImage} alt="Post preview" className="w-full h-full object-cover object-top" />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Preview
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description &amp; Design Notes
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe neck cut, sleeve style, fabric type, piping..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Search Tags (separated by comma)
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="e.g. Bridal, Boat Neck, Padded, Velvet"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold shadow-md hover:from-emerald-700 hover:to-teal-800 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'Save Changes' : 'Publish Design'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IN-APP CONFIRMATION MODAL FOR DELETING CREATIONS */}
      {itemToDelete && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-red-200 text-center relative animate-in zoom-in-95">
            <button
              onClick={() => setItemToDelete(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
              aria-label="Cancel delete"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 border border-red-200 shadow-sm">
              <Trash2 className="w-7 h-7" />
            </div>

            <h4 className="font-serif text-xl font-bold text-gray-900">
              Delete this Creation?
            </h4>

            <p className="text-xs text-gray-600 mt-2 mb-5 leading-relaxed">
              Are you sure you want to permanently remove <strong className="text-gray-900">"{itemToDelete.title}"</strong> ({itemToDelete.category}) from your portfolio?
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
