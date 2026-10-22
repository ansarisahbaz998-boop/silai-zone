import React, { useState, useEffect } from 'react';
import { CustomerInquiry, InquiryUrgency } from '../types';
import { CATEGORIES } from '../data/mockData';
import { 
  Calendar, 
  Phone, 
  User, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Send, 
  Sparkles, 
  Clock, 
  Scissors, 
  Ruler,
  AlertCircle,
  HelpCircle,
  Check
} from 'lucide-react';

interface InquiryFormProps {
  prefilledCategory?: string;
  prefilledNote?: string;
  onInquirySubmitted: (inquiry: CustomerInquiry) => void;
  onOpenMeasurementSlip: () => void;
  savedMeasurementSlipId?: string;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({
  prefilledCategory,
  prefilledNote,
  onInquirySubmitted,
  onOpenMeasurementSlip,
  savedMeasurementSlipId,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState(prefilledCategory || CATEGORIES[0].name);
  const [requirements, setRequirements] = useState(prefilledNote || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [urgency, setUrgency] = useState<InquiryUrgency>('Normal (3-5 Days)');
  const [hasOwnFabric, setHasOwnFabric] = useState(true);
  const [measurementSlipId, setMeasurementSlipId] = useState(savedMeasurementSlipId || '');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submittedInquiry, setSubmittedInquiry] = useState<CustomerInquiry | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Sync props if changed
  useEffect(() => {
    if (prefilledCategory) {
      setCategory(prefilledCategory);
    }
  }, [prefilledCategory]);

  useEffect(() => {
    if (prefilledNote) {
      setRequirements(prefilledNote);
    }
  }, [prefilledNote]);

  useEffect(() => {
    if (savedMeasurementSlipId) {
      setMeasurementSlipId(savedMeasurementSlipId);
    }
  }, [savedMeasurementSlipId]);

  // Set default minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name.';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!category) {
      errs.category = 'Please select a clothing category.';
    }

    if (!preferredDate) {
      errs.preferredDate = 'Please select your preferred completion or trial date.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Generate random 4-digit ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newInquiryId = `SZ-2026-${randomNum}`;

    const newInquiry: CustomerInquiry = {
      id: newInquiryId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      category,
      requirements: requirements.trim(),
      preferredDate,
      urgency,
      hasOwnFabric,
      measurementSlipId: measurementSlipId ? measurementSlipId : undefined,
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      adminNotes: 'Online booking generated via website',
    };

    onInquirySubmitted(newInquiry);
    setSubmittedInquiry(newInquiry);
  };

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setCategory(CATEGORIES[0].name);
    setRequirements('');
    setPreferredDate('');
    setUrgency('Normal (3-5 Days)');
    setSubmittedInquiry(null);
    setErrors({});
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section id="booking" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-white via-rose-50/30 to-amber-50/40 rounded-3xl border border-rose-200/80 shadow-xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-rose-950 via-pink-950 to-rose-900 px-6 sm:px-10 py-8 text-white relative">
          <div className="absolute right-6 top-6 opacity-10 hidden sm:block">
            <i className="fa-solid fa-scissors text-8xl text-amber-200"></i>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Instant Custom Tailoring Booking</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-white">
            Book Your Custom Stitching
          </h2>
          <p className="text-xs sm:text-sm text-rose-200 mt-1 max-w-xl">
            Ab call ya shop par bheed mein wait karne ki zaroorat nahi. Online booking karein, confirm slip paayein aur direct Masterji se WhatsApp par connect karein.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-amber-200/90 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> Free Trial &amp; Alteration
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> On-Time Delivery Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> Digital Naap Record
            </span>
          </div>
        </div>

        {/* Booking Form Body */}
        <div className="p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-800" />
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Shabnam Parveen / Sunita"
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2 bg-white ${
                    errors.fullName
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-rose-200 focus:border-rose-400'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Mobile / WhatsApp Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-rose-800" />
                  WhatsApp / Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 border-r border-gray-200 pr-2">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9339075854"
                    className={`w-full pl-16 pr-4 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2 bg-white ${
                      errors.phone
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-rose-200 focus:border-rose-400'
                    }`}
                  />
                </div>
                {errors.phone ? (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-500 mt-1">
                    Booking updates &amp; fitting status will be sent on this number.
                  </p>
                )}
              </div>

              {/* Cloth Category Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-rose-800" />
                  Stitching Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name} ({cat.hindiName})
                    </option>
                  ))}
                  <option value="Other Custom Dress">Other Custom Dress / Kids Wear</option>
                </select>
                {errors.category && (
                  <p className="text-xs text-red-600 mt-1">{errors.category}</p>
                )}
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-800" />
                  Preferred Completion / Trial Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  min={minDateString}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2 bg-white ${
                    errors.preferredDate
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-rose-200 focus:border-rose-400'
                  }`}
                />
                {errors.preferredDate && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.preferredDate}
                  </p>
                )}
              </div>
            </div>

            {/* Urgency & Fabric Ownership Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-rose-50/50 p-4 rounded-2xl border border-rose-100/80">
              {/* Urgency */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-800" /> Delivery Urgency
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgency('Normal (3-5 Days)')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition ${
                      urgency === 'Normal (3-5 Days)'
                        ? 'bg-rose-900 text-amber-200 border-rose-900 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Normal (3-5 Days)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('Express (24-48 Hours)')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition ${
                      urgency === 'Express (24-48 Hours)'
                        ? 'bg-amber-500 text-gray-950 border-amber-600 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    ⚡ Express (24-48h)
                  </button>
                </div>
              </div>

              {/* Fabric status */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  Do you have your own fabric (Kapda)?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHasOwnFabric(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition ${
                      hasOwnFabric
                        ? 'bg-rose-900 text-amber-200 border-rose-900 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Yes, I have fabric
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasOwnFabric(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition ${
                      !hasOwnFabric
                        ? 'bg-rose-900 text-amber-200 border-rose-900 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Need Boutique Fabric
                  </button>
                </div>
              </div>
            </div>

            {/* Optional Online Measurement Slip Link */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                  <Ruler className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                    Online Measurement Slip (Naap Parchi)
                  </h4>
                  <p className="text-[11px] text-gray-600">
                    {measurementSlipId 
                      ? `Linked Naap Slip ID: ${measurementSlipId}` 
                      : 'Fill your body measurements online to save time on shop visit.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenMeasurementSlip}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100 text-rose-950 font-bold text-xs border border-amber-300 shadow-xs transition active:scale-95 shrink-0"
              >
                {measurementSlipId ? 'Edit Measurement Slip' : '+ Fill Measurement Slip'}
              </button>
            </div>

            {/* Requirements & Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-rose-800" />
                Stitching Requirements / Design Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="e.g. Boat neck design, elbow length sleeves, padded princess cut, matching golden piping on borders..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-900 via-pink-900 to-rose-950 hover:from-rose-800 hover:to-pink-900 text-amber-200 font-bold text-base shadow-lg shadow-rose-950/20 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer border border-amber-400/30"
              >
                <Scissors className="w-5 h-5 text-amber-300" />
                <span>Confirm Stitching Booking &amp; Get Inquiry ID</span>
              </button>
              <p className="text-center text-[11px] text-gray-500 mt-2">
                🔒 Free trial alteration and 100% fitting guarantee by Silai Zone Masterji.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {submittedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-300 relative">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900">
                Booking Successful!
              </h3>
              <p className="text-xs text-rose-800 font-bold mt-1">
                Silai Zone • Sasta Mein Shandaar Silai
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Aapki tailoring inquiry successfully register ho chuki hai.
              </p>
            </div>

            {/* Booking Slip Card */}
            <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200 space-y-3 mb-6">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                <span className="text-xs font-bold text-gray-600">Inquiry ID:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-extrabold text-base text-rose-950 bg-amber-200/80 px-2.5 py-0.5 rounded-md">
                    {submittedInquiry.id}
                  </span>
                  <button
                    onClick={() => copyToClipboard(submittedInquiry.id)}
                    className="p-1 rounded hover:bg-amber-200 text-gray-600"
                    title="Copy ID"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500 block">Customer Name:</span>
                  <span className="font-bold text-gray-800">{submittedInquiry.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Phone:</span>
                  <span className="font-bold text-gray-800">{submittedInquiry.phone}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Category:</span>
                  <span className="font-bold text-gray-800">{submittedInquiry.category}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Trial / Delivery:</span>
                  <span className="font-bold text-gray-800">{submittedInquiry.preferredDate}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Speed:</span>
                  <span className="font-bold text-rose-800">{submittedInquiry.urgency}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Shop Address:</span>
                  <span className="font-bold text-gray-800">Imli Talab, Kulti</span>
                </div>
              </div>

              {submittedInquiry.requirements && (
                <div className="pt-2 border-t border-amber-200/60 text-xs">
                  <span className="text-gray-500 block">Notes:</span>
                  <p className="text-gray-700 italic">"{submittedInquiry.requirements}"</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <a
                href={`https://wa.me/919339075854?text=${encodeURIComponent(
                  `Namaste Silai Zone! Maine online booking ki hai:\n\n*Inquiry ID:* ${submittedInquiry.id}\n*Name:* ${submittedInquiry.fullName}\n*Phone:* ${submittedInquiry.phone}\n*Category:* ${submittedInquiry.category}\n*Preferred Date:* ${submittedInquiry.preferredDate}\n*Urgency:* ${submittedInquiry.urgency}\n*Notes:* ${submittedInquiry.requirements || 'Standard'}\n\nKripya confirmation aur fabric drop timing batayein.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <i className="fa-brands fa-whatsapp text-lg"></i>
                <span>Send Booking to Masterji on WhatsApp</span>
              </a>

              <button
                onClick={resetForm}
                className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition"
              >
                Done / Book Another Garment
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
