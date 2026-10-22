import React, { useState } from 'react';
import { PortfolioItem, CustomerInquiry, MeasurementSlip, BoutiqueInfo, InquiryStatus } from '../types';
import { CATEGORIES } from '../data/mockData';
import { 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Edit3, 
  Phone, 
  Check, 
  X, 
  Ruler, 
  Settings, 
  Layers, 
  AlertCircle,
  MessageCircle,
  ShieldCheck,
  RotateCcw,
  User,
  KeyRound,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  DEFAULT_ADMIN_USERNAME, 
  DEFAULT_ADMIN_PASSWORD,
  SECURITY_QUESTION_1,
  SECURITY_QUESTION_2,
  resetPasswordWithSecurityQuestions,
  recoverUsernameWithSecurityQuestions,
  resetUsernameWithSecurityQuestions,
  getAdminUsername,
  setAdminUsername,
  setAdminPassword
} from '../utils/adminAuth';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminAuthenticated: boolean;
  onAuthenticate: (username: string, password: string) => { success: boolean; error?: string };
  onLogout: () => void;
  portfolioItems: PortfolioItem[];
  onAddPortfolioItem: (item: PortfolioItem) => void;
  onUpdatePortfolioItem: (item: PortfolioItem) => void;
  onDeletePortfolioItem: (id: string) => void;
  onResetPortfolio: () => void;
  inquiries: CustomerInquiry[];
  onUpdateInquiryStatus: (id: string, status: InquiryStatus, notes?: string) => void;
  onDeleteInquiry: (id: string) => void;
  measurementSlips: MeasurementSlip[];
  boutiqueInfo: BoutiqueInfo;
  onUpdateBoutiqueInfo: (info: BoutiqueInfo) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  isAdminAuthenticated,
  onAuthenticate,
  onLogout,
  portfolioItems,
  onAddPortfolioItem,
  onUpdatePortfolioItem,
  onDeletePortfolioItem,
  onResetPortfolio,
  inquiries,
  onUpdateInquiryStatus,
  onDeleteInquiry,
  measurementSlips,
  boutiqueInfo,
  onUpdateBoutiqueInfo,
}) => {
  if (!isOpen) return null;

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'creations' | 'inquiries' | 'measurements' | 'settings'>('inquiries');

  // Username & Password login state
  const [enteredUsername, setEnteredUsername] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Security Question Recovery & Reset state
  const [isResetMode, setIsResetMode] = useState(false);
  const [recoveryType, setRecoveryType] = useState<'username' | 'password'>('username');
  const [resetAnswer1, setResetAnswer1] = useState('');
  const [resetAnswer2, setResetAnswer2] = useState('');
  const [recoveredUsername, setRecoveredUsername] = useState('');
  const [customNewUsername, setCustomNewUsername] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // Portfolio form state (Create / Edit)
  const [isEditingItem, setIsEditingItem] = useState<PortfolioItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0].name);
  const [formStitchingType, setFormStitchingType] = useState('Designer Cut with Piping');
  const [formTurnaround, setFormTurnaround] = useState('3 Days');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formTags, setFormTags] = useState('Salwar Suit, Silk, Designer');

  // Direct Password update in Settings tab
  const [newDirectPassword, setNewDirectPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // In-app delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'creation' | 'inquiry';
    id: string;
    title: string;
  } | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPassword.trim()) {
      setLoginError('Kripya Admin Password darj karein.');
      return;
    }

    const usernameToUse = enteredUsername.trim() || getAdminUsername();
    const result = onAuthenticate(usernameToUse, enteredPassword.trim());
    if (result.success) {
      setLoginError('');
      setEnteredPassword('');
    } else {
      setLoginError(result.error || 'Galat Password! Kripya sahi password darj karein.');
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
      setResetError('Kripya dono sawalon ke sahi uttar darj karein.');
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
      }, 2000);
    } else {
      setResetError(result.message);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setIsEditingItem(null);
    setFormTitle('');
    setFormCategory(CATEGORIES[0].name);
    setFormStitchingType('Designer Cut with Piping');
    setFormTurnaround('3 Days');
    setFormDescription('Finely stitched with pure cotton astar, matching piping, and durable lock stitching.');
    setFormImage('/images/categories/salwar-suit.jpg');
    setFormTags('Boutique, Handwork, Festive');
    setIsCreatingNew(true);
  };

  const openEditModal = (item: PortfolioItem) => {
    setIsEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormStitchingType(item.stitchingType);
    setFormTurnaround(item.turnaround);
    setFormDescription(item.description);
    setFormImage(item.image);
    setFormTags(item.tags.join(', '));
    setIsCreatingNew(true);
  };

  const handleSavePortfolioForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please enter a title for the stitching creation.');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (isEditingItem) {
      const updated: PortfolioItem = {
        ...isEditingItem,
        title: formTitle.trim(),
        category: formCategory,
        stitchingType: formStitchingType.trim(),
        turnaround: formTurnaround.trim(),
        description: formDescription.trim(),
        image: formImage || isEditingItem.image,
        tags: tagsArray,
      };
      onUpdatePortfolioItem(updated);
    } else {
      const newItem: PortfolioItem = {
        id: `cr-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        stitchingType: formStitchingType.trim(),
        turnaround: formTurnaround.trim(),
        description: formDescription.trim(),
        image: formImage || '/images/categories/salwar-suit.jpg',
        tags: tagsArray,
        rating: 5,
        createdAt: new Date().toISOString().split('T')[0],
      };
      onAddPortfolioItem(newItem);
    }

    setIsCreatingNew(false);
    setIsEditingItem(null);
  };

  const handleDirectPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDirectPassword.trim().length < 4) {
      alert('Password must be at least 4 characters long.');
      return;
    }
    setAdminPassword(newDirectPassword.trim());
    setNewDirectPassword('');
    setPasswordChangeSuccess(true);
    setTimeout(() => setPasswordChangeSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-amber-300 relative my-6 max-h-[94vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-rose-950 via-pink-950 to-rose-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-rose-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-rose-950" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">Silai Zone Admin Control Panel</h3>
              <p className="text-xs text-rose-200">Management &amp; Portfolio Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-rose-100 flex items-center gap-1.5 transition"
              >
                <Unlock className="w-3.5 h-3.5 text-amber-300" />
                <span>Lock / Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-rose-200 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* If NOT Authenticated, show Username & Password Login */}
        {!isAdminAuthenticated ? (
          <div className="p-6 sm:p-10 max-w-md mx-auto my-auto w-full">
            {!isResetMode ? (
              /* Standard Username & Password Login */
              <div>
                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-4 border border-amber-300 shadow-sm">
                  <Lock className="w-8 h-8 text-amber-800" />
                </div>

                <div className="text-center mb-6">
                  <h3 className="font-serif text-2xl font-bold text-gray-900">
                    Admin Portal Login
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Photo upload, delete, customer inquiries aur boutique controls ke liye credentials darj karein.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Username Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-rose-800" />
                        <span>Admin Username (उपयोगकर्ता नाम)</span>
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
                        className="text-[11px] text-rose-800 hover:text-rose-950 font-bold hover:underline cursor-pointer"
                      >
                        Forgot Username?
                      </button>
                    </div>
                    <input
                      type="text"
                      autoFocus
                      value={enteredUsername}
                      onChange={(e) => setEnteredUsername(e.target.value)}
                      placeholder="Enter Admin Username (or leave blank if entering password)"
                      autoComplete="off"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-rose-800" />
                        <span>Admin Password (पासवर्ड)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsResetMode(true);
                          setRecoveryType('password');
                          setResetError('');
                          setResetSuccess('');
                        }}
                        className="text-[11px] text-rose-800 hover:text-rose-950 font-bold hover:underline cursor-pointer"
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-1.5 text-left">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-900 to-pink-900 hover:from-rose-800 hover:to-pink-800 text-amber-200 font-bold text-sm shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Unlock Admin Dashboard</span>
                  </button>

                  <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(true);
                        setRecoveryType('username');
                        setResetError('');
                        setResetSuccess('');
                        setRecoveredUsername('');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-900 font-semibold hover:underline bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-amber-800" />
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
                      className="inline-flex items-center gap-1.5 text-xs text-amber-900 font-semibold hover:underline bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-800" />
                      <span>Forgot Password?</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Security Question Recovery & Reset Form */
              <div className="animate-in fade-in">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-900 flex items-center justify-center mx-auto mb-3 border border-rose-300 shadow-sm">
                  <HelpCircle className="w-7 h-7 text-rose-800" />
                </div>

                <div className="text-center mb-3">
                  <h3 className="font-serif text-xl font-bold text-gray-900">
                    Security Question Recovery
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Answer the security questions to recover or reset your Admin credentials.
                  </p>
                </div>

                {/* Tab Switcher: Username or Password */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-3 border border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryType('username');
                      setResetError('');
                      setResetSuccess('');
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                      recoveryType === 'username'
                        ? 'bg-rose-900 text-amber-200 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Forgot Username</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryType('password');
                      setResetError('');
                      setResetSuccess('');
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                      recoveryType === 'password'
                        ? 'bg-rose-900 text-amber-200 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Forgot Password</span>
                  </button>
                </div>

                <div className="space-y-3 text-left">
                  {/* Security Question 1 */}
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      1. {SECURITY_QUESTION_1} <span className="text-[11px] text-gray-500 font-normal">(Who are you?)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={resetAnswer1}
                      onChange={(e) => setResetAnswer1(e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                    />
                  </div>

                  {/* Security Question 2 */}
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      2. {SECURITY_QUESTION_2} <span className="text-[11px] text-gray-500 font-normal">(What is your name?)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={resetAnswer2}
                      onChange={(e) => setResetAnswer2(e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                    />
                  </div>

                  {/* Section: Username Recovery & Change */}
                  {recoveryType === 'username' ? (
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleRecoverUsername}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-900 to-pink-900 hover:from-rose-800 hover:to-pink-800 text-amber-200 font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Verify &amp; Show Admin Username</span>
                      </button>

                      {recoveredUsername && (
                        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 animate-in fade-in">
                          <p className="text-xs text-emerald-900 font-bold flex items-center gap-1">
                            <Check className="w-4 h-4 text-emerald-700" />
                            <span>Identity Verified!</span>
                          </p>
                          <div className="p-2.5 bg-white rounded-lg border border-emerald-200 flex items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] text-gray-500 block uppercase tracking-wide">
                                Your Admin Username:
                              </span>
                              <strong className="text-sm font-mono text-gray-900">
                                {recoveredUsername}
                              </strong>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setEnteredUsername(recoveredUsername);
                                setIsResetMode(false);
                              }}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer shrink-0"
                            >
                              Use in Login
                            </button>
                          </div>

                          <div className="pt-2 border-t border-emerald-200/80">
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">
                              Or change to a new username (नया नाम सेट करें):
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={customNewUsername}
                                onChange={(e) => setCustomNewUsername(e.target.value)}
                                placeholder="Enter new username..."
                                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-rose-400"
                              />
                              <button
                                type="button"
                                onClick={handleUpdateUsername}
                                className="px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-amber-200 text-xs font-bold rounded-lg cursor-pointer transition shrink-0"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Section: Password Reset */
                    <form onSubmit={handleSecurityResetSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          Enter New Password (नया पासवर्ड दर्ज करें)
                        </label>
                        <input
                          type="password"
                          required
                          value={resetNewPassword}
                          onChange={(e) => setResetNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          autoComplete="new-password"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-amber-200 font-bold text-xs shadow-md transition cursor-pointer"
                      >
                        Update Password
                      </button>
                    </form>
                  )}

                  {resetError && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  {resetSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-1.5 font-semibold">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{resetSuccess}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(false);
                        setResetError('');
                        setResetSuccess('');
                        setRecoveredUsername('');
                      }}
                      className="w-full py-2 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition cursor-pointer"
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab Navigation */}
            <div className="bg-rose-50/70 border-b border-rose-200/80 px-6 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'inquiries'
                    ? 'bg-rose-900 text-amber-200 shadow-sm'
                    : 'bg-white hover:bg-rose-100/70 text-gray-700 border border-gray-200'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Customer Inquiries ({inquiries.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('creations')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'creations'
                    ? 'bg-rose-900 text-amber-200 shadow-sm'
                    : 'bg-white hover:bg-rose-100/70 text-gray-700 border border-gray-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Showcase Designs ({portfolioItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('measurements')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'measurements'
                    ? 'bg-rose-900 text-amber-200 shadow-sm'
                    : 'bg-white hover:bg-rose-100/70 text-gray-700 border border-gray-200'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Naap Records ({measurementSlips.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-rose-900 text-amber-200 shadow-sm'
                    : 'bg-white hover:bg-rose-100/70 text-gray-700 border border-gray-200'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Shop Info &amp; Password</span>
              </button>
            </div>

            {/* Tab 1: Customer Inquiries */}
            {activeTab === 'inquiries' && (
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-gray-900">
                      Recent Tailoring Bookings &amp; Inquiries
                    </h4>
                    <p className="text-xs text-gray-500">
                      Update order status, add Masterji notes, or chat with customers directly.
                    </p>
                  </div>
                </div>

                {inquiries.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-sm text-gray-500">No customer inquiries yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm hover:shadow-md transition space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-xs bg-rose-100 text-rose-900 px-2.5 py-1 rounded-md">
                              {inquiry.id}
                            </span>
                            <h5 className="font-bold text-sm text-gray-900">
                              {inquiry.fullName}
                            </h5>
                            <span className="text-xs text-gray-500">({inquiry.phone})</span>
                          </div>

                          {/* Status Badge & Select */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">Status:</span>
                            <select
                              value={inquiry.status}
                              onChange={(e) =>
                                onUpdateInquiryStatus(
                                  inquiry.id,
                                  e.target.value as InquiryStatus,
                                  inquiry.adminNotes
                                )
                              }
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                                inquiry.status === 'Completed' || inquiry.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : inquiry.status === 'In Stitching'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : inquiry.status === 'Ready for Trial'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : 'bg-rose-50 text-rose-800 border-rose-200'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Measurement Taken">Measurement Taken</option>
                              <option value="In Stitching">In Stitching</option>
                              <option value="Ready for Trial">Ready for Trial</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs bg-gray-50/70 p-3 rounded-xl">
                          <div>
                            <span className="text-gray-500 block text-[11px]">Garment:</span>
                            <strong className="text-gray-800">{inquiry.category}</strong>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[11px]">Trial / Delivery:</span>
                            <strong className="text-gray-800">{inquiry.preferredDate}</strong>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[11px]">Urgency:</span>
                            <strong className="text-rose-800">{inquiry.urgency}</strong>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[11px]">Booked On:</span>
                            <span className="text-gray-600">{inquiry.createdAt}</span>
                          </div>
                        </div>

                        {inquiry.requirements && (
                          <div className="text-xs bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50">
                            <span className="font-bold text-amber-950">Customer Notes: </span>
                            <span className="text-gray-700 italic">"{inquiry.requirements}"</span>
                          </div>
                        )}

                        {/* Internal Tailor Notes Field */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Add internal tailor note (e.g. Lining selected, trial done)..."
                            defaultValue={inquiry.adminNotes || ''}
                            onBlur={(e) =>
                              onUpdateInquiryStatus(inquiry.id, inquiry.status, e.target.value)
                            }
                            className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-rose-400"
                          />
                        </div>

                        {/* Quick Action Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/91${inquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Namaste ${inquiry.fullName} ji! Main Silai Zone Boutique Kulti se Masterji baat kar raha hoon. Aapki tailoring inquiry (${inquiry.id}) regarding ${inquiry.category} ke baare mein update dena tha.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                            >
                              <i className="fa-brands fa-whatsapp"></i>
                              <span>Chat on WhatsApp</span>
                            </a>

                            <a
                              href={`tel:${inquiry.phone}`}
                              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold flex items-center gap-1.5 transition"
                            >
                              <Phone className="w-3 h-3 text-gray-600" />
                              <span>Call {inquiry.phone}</span>
                            </a>
                          </div>

                          <button
                            onClick={() => {
                              setDeleteTarget({
                                type: 'inquiry',
                                id: inquiry.id,
                                title: `Inquiry #${inquiry.id} (${inquiry.fullName})`,
                              });
                            }}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs transition"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Showcase Designs (CRUD) */}
            {activeTab === 'creations' && (
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-gray-900">
                      Manage Showcase Portfolio Designs
                    </h4>
                    <p className="text-xs text-gray-500">
                      Upload new photos, edit details, or remove finished pieces.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onResetPortfolio}
                      className="px-3 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition"
                      title="Reset to default authentic boutique presets"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Samples</span>
                    </button>

                    <button
                      onClick={openCreateModal}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload New Design</span>
                    </button>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolioItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-44 bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-rose-950 font-bold text-[10px]">
                            {item.category}
                          </span>
                        </div>

                        <div className="p-3">
                          <h5 className="font-bold text-sm text-gray-900 line-clamp-1">
                            {item.title}
                          </h5>
                          <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
                            {item.description}
                          </p>
                          <p className="text-[10px] text-rose-800 font-semibold mt-1">
                            Technique: {item.stitchingType}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 pt-0 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">Time: {item.turnaround}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget({
                                type: 'creation',
                                id: item.id,
                                title: item.title,
                              });
                            }}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Customer Measurement Slips */}
            {activeTab === 'measurements' && (
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-gray-900">
                      Saved Customer Measurement Slips (Naap Records)
                    </h4>
                    <p className="text-xs text-gray-500">
                      View recorded customer measurements for quick reference while cutting cloth.
                    </p>
                  </div>
                </div>

                {measurementSlips.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-sm text-gray-500">
                      No measurement slips saved yet. Customers can create slips from the website.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {measurementSlips.map((slip) => (
                      <div
                        key={slip.id}
                        className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/80 space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                          <div>
                            <h5 className="font-bold text-sm text-gray-900">{slip.customerName}</h5>
                            <span className="text-xs text-rose-900 font-semibold">{slip.clothCategory}</span>
                          </div>
                          <span className="font-mono text-xs font-bold bg-rose-900 text-amber-200 px-2 py-0.5 rounded">
                            {slip.id}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-[11px]">
                          {slip.measurements.bustChest && <div>Bust: <strong>{slip.measurements.bustChest}"</strong></div>}
                          {slip.measurements.waist && <div>Waist: <strong>{slip.measurements.waist}"</strong></div>}
                          {slip.measurements.bottomWaist && <div className="text-amber-900">Lower कमर: <strong>{slip.measurements.bottomWaist}"</strong></div>}
                          {slip.measurements.totalLength && <div>Length: <strong>{slip.measurements.totalLength}"</strong></div>}
                          {slip.measurements.shoulder && <div>Shoulder: <strong>{slip.measurements.shoulder}"</strong></div>}
                          {slip.measurements.sleeveLength && <div>Sleeve: <strong>{slip.measurements.sleeveLength}"</strong></div>}
                          {slip.measurements.bottomLength && <div>Pant L: <strong>{slip.measurements.bottomLength}"</strong></div>}
                          {slip.measurements.bottomMori && <div>Mori: <strong>{slip.measurements.bottomMori}"</strong></div>}
                        </div>

                        {slip.notes && (
                          <p className="text-xs text-gray-600 italic">Notes: {slip.notes}</p>
                        )}

                        <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs">
                          <span className="text-gray-500">Ph: {slip.phone}</span>
                          <a
                            href={`https://wa.me/91${slip.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Namaste ${slip.customerName} ji! Aapki Silai Zone Naap Parchi (${slip.id}) hamare paas verify ho chuki hai.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                          >
                            <i className="fa-brands fa-whatsapp"></i> Chat
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Settings & Password Update */}
            {activeTab === 'settings' && (
              <div className="p-6 overflow-y-auto space-y-6 max-w-2xl">
                <div>
                  <h4 className="font-serif text-lg font-bold text-gray-900">
                    Boutique Admin Credentials &amp; Shop Profile
                  </h4>
                  <p className="text-xs text-gray-500">
                    Update your master access credentials and security settings.
                  </p>
                </div>

                {/* Admin Credentials Card */}
                <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-200 space-y-4">
                  <h5 className="font-bold text-sm text-rose-950 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-rose-800" /> Admin Credentials Management
                  </h5>

                  <div className="p-3 bg-white rounded-xl border border-rose-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-500 block">Registered Admin Username:</span>
                      <strong className="text-gray-900 text-sm font-mono">{getAdminUsername()}</strong>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Protected
                    </span>
                  </div>

                  <form onSubmit={handleDirectPasswordChange} className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700">
                      Set New Admin Password (नया पासवर्ड दर्ज करें):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={newDirectPassword}
                        onChange={(e) => setNewDirectPassword(e.target.value)}
                        placeholder="Enter new strong password"
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-amber-200 font-bold text-xs transition"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                  {passwordChangeSuccess && (
                    <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Password successfully updated and saved!
                    </p>
                  )}

                  <div className="pt-2 border-t border-rose-200/60 text-xs text-gray-600 space-y-1">
                    <p className="font-semibold text-rose-950">Security Questions for Recovery:</p>
                    <p>• Q1: <em>"{SECURITY_QUESTION_1}"</em> (Answer: robot)</p>
                    <p>• Q2: <em>"{SECURITY_QUESTION_2}"</em> (Answer: robot)</p>
                    <p className="text-[11px] text-gray-500 italic">
                      If you ever forget your username or password, you can recover or reset either anytime using these security questions.
                    </p>
                  </div>
                </div>

                {/* Boutique Details Overview */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3 text-xs">
                  <h5 className="font-bold text-sm text-gray-900">Registered Boutique Profile</h5>
                  <div>
                    <span className="text-gray-500 block">Brand Name:</span>
                    <strong className="text-gray-800">{boutiqueInfo.name}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Tagline:</span>
                    <strong className="text-gray-800">{boutiqueInfo.tagline}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Phone Number:</span>
                    <strong className="text-rose-900">{boutiqueInfo.phone}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Address:</span>
                    <strong className="text-gray-800">{boutiqueInfo.address}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Operational Hours:</span>
                    <strong className="text-gray-800">{boutiqueInfo.hours}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal for Creating / Editing Portfolio Creation */}
        {isCreatingNew && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-300 relative my-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h4 className="font-serif text-lg font-bold text-gray-900">
                  {isEditingItem ? 'Edit Showcase Creation' : 'Upload New Finished Work'}
                </h4>
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePortfolioForm} className="space-y-4 mt-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Design Title <span className="text-red-500">*</span>
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
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 font-medium"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Stitching Technique
                    </label>
                    <input
                      type="text"
                      value={formStitchingType}
                      onChange={(e) => setFormStitchingType(e.target.value)}
                      placeholder="e.g. Double Astar with Hand Piping"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                </div>

                {/* Turnaround Days */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Turnaround Days / Completion Time
                  </label>
                  <input
                    type="text"
                    value={formTurnaround}
                    onChange={(e) => setFormTurnaround(e.target.value)}
                    placeholder="e.g. 2-3 Days"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>

                {/* Photo Upload or URL */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Photo (Upload from Device or enter URL)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-rose-900 hover:file:bg-rose-100 cursor-pointer"
                    />
                    <input
                      type="url"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="Or paste image URL (https://...)"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50"
                    />
                  </div>

                  {formImage && (
                    <div className="mt-2 h-36 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Description &amp; Highlights
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe neck cut, sleeve style, fabric type..."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Search Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="e.g. Bridal, Boat Neck, Padded, Velvet"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-900 to-pink-900 text-amber-200 text-xs font-bold shadow-md hover:from-rose-800 hover:to-pink-800 transition cursor-pointer"
                  >
                    {isEditingItem ? 'Save Changes' : 'Upload to Showcase'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* In-App Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-red-200 text-center relative animate-in zoom-in-95">
              <button
                onClick={() => setDeleteTarget(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 border border-red-200 shadow-sm">
                <Trash2 className="w-7 h-7" />
              </div>

              <h4 className="font-serif text-xl font-bold text-gray-900">
                Delete {deleteTarget.type === 'inquiry' ? 'Inquiry' : 'Design'}?
              </h4>

              <p className="text-xs text-gray-600 mt-2 mb-5 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-gray-900">"{deleteTarget.title}"</strong>?
              </p>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (deleteTarget.type === 'inquiry') {
                      onDeleteInquiry(deleteTarget.id);
                    } else {
                      onDeletePortfolioItem(deleteTarget.id);
                    }
                    setDeleteTarget(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
