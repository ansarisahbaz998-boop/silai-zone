import React, { useState } from 'react';
import { MeasurementSlip } from '../types';
import { 
  Ruler, 
  X, 
  Printer, 
  Share2, 
  Save, 
  CheckCircle, 
  Scissors, 
  FileText,
  Sparkles,
  Info
} from 'lucide-react';

interface MeasurementSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSlip: (slip: MeasurementSlip) => void;
  existingSlip?: MeasurementSlip | null;
}

export const MeasurementSlipModal: React.FC<MeasurementSlipModalProps> = ({
  isOpen,
  onClose,
  onSaveSlip,
  existingSlip,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState(existingSlip?.customerName || '');
  const [phone, setPhone] = useState(existingSlip?.phone || '');
  const [clothCategory, setClothCategory] = useState(existingSlip?.clothCategory || 'Astar Blouse');
  const [notes, setNotes] = useState(existingSlip?.notes || '');

  // Measurements
  const [measurements, setMeasurements] = useState<MeasurementSlip['measurements']>(existingSlip?.measurements || {
    bustChest: '36',
    waist: '30',
    hip: '38',
    totalLength: '14.5',
    shoulder: '14',
    sleeveLength: '6.5',
    sleeveMori: '11',
    frontNeckDepth: '6.5',
    backNeckDepth: '9',
    armhole: '15',
    damanChak: '20',
    bottomLength: '38',
    bottomWaist: '32',
    bottomHip: '40',
    bottomMori: '12',
    thigh: '22',
    crotchRise: '13',
    cupPadded: false,
    zipperSide: 'None' as const,
    liningFabric: 'Pure Cotton',
  });

  const [generatedSlip, setGeneratedSlip] = useState<MeasurementSlip | null>(existingSlip || null);

  const handleMeasurementChange = (field: string, value: any) => {
    setMeasurements((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Kripya apna naam darj karein.');
      return;
    }

    const slipId = existingSlip?.id || `NAAP-SZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSlip: MeasurementSlip = {
      id: slipId,
      customerName: customerName.trim(),
      phone: phone.trim() || '9339075854',
      clothCategory,
      date: new Date().toISOString().split('T')[0],
      notes,
      measurements,
    };

    onSaveSlip(newSlip);
    setGeneratedSlip(newSlip);
  };

  const handlePrint = () => {
    window.print();
  };

  const shareOnWhatsApp = () => {
    if (!generatedSlip) return;
    const m = generatedSlip.measurements;
    const text = `*SILAI ZONE DIGITAL NAAP PARCHI*\n` +
      `*Slip ID:* ${generatedSlip.id}\n` +
      `*Customer:* ${generatedSlip.customerName}\n` +
      `*Phone:* ${generatedSlip.phone}\n` +
      `*Garment:* ${generatedSlip.clothCategory}\n` +
      `*Date:* ${generatedSlip.date}\n` +
      `-------------------------\n` +
      `• Length: ${m.totalLength || '-'} in\n` +
      `• Bust / Chest: ${m.bustChest || '-'} in\n` +
      `• Waist: ${m.waist || '-'} in\n` +
      `• Shoulder: ${m.shoulder || '-'} in\n` +
      `• Sleeve: ${m.sleeveLength || '-'} in (Mori: ${m.sleeveMori || '-'} in)\n` +
      `• Front Neck: ${m.frontNeckDepth || '-'} in | Back: ${m.backNeckDepth || '-'} in\n` +
      `• Armhole: ${m.armhole || '-'} in\n` +
      (m.bottomWaist ? `• Lower Waist (कमर): ${m.bottomWaist} in\n` : '') +
      (m.bottomLength ? `• Bottom Length: ${m.bottomLength} in (Mori: ${m.bottomMori || '-'} in)\n` : '') +
      `• Notes: ${generatedSlip.notes || 'Perfect Fit'}\n` +
      `-------------------------\n` +
      `Silai Zone, Imli Talab, Kathgola, Kulti • Ph: 9339075854`;

    window.open(`https://wa.me/919339075854?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-amber-300 relative my-6 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-rose-950 via-pink-950 to-rose-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-rose-950 flex items-center justify-center font-bold">
              <Ruler className="w-5 h-5 text-rose-950" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">Digital Naap Parchi</h3>
              <p className="text-xs text-rose-200">Online Measurement Slip • Silai Zone Kulti</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-rose-200 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!generatedSlip ? (
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  Aap apne body measurements (inches mein) yahan enter kar sakte hain. Is slip ko save karke aap direct shop par laa sakte hain ya WhatsApp par bhej sakte hain.
                </p>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Shabnam"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9339075854"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Garment Type
                  </label>
                  <select
                    value={clothCategory}
                    onChange={(e) => setClothCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 font-medium"
                  >
                    <option value="Astar Blouse">Astar Blouse (अस्तर ब्लाउज)</option>
                    <option value="Princess Cut Blouse">Princess Cut Blouse (प्रिंसेस कट)</option>
                    <option value="Salwar Suit">Salwar Suit / Kurti (सूट)</option>
                    <option value="Lehenga Choli">Lehenga Choli (लहंगा चोली)</option>
                    <option value="Plazo">Plazo / Flared Palazzo (प्लाजो)</option>
                    <option value="Pant Pajama">Pant Pajama / Cigarette Pant (पैंट)</option>
                    <option value="Garara">Garara / Sharara (गरारा)</option>
                    <option value="Saya">Saya / Petticoat (साया)</option>
                    <option value="Top">Fancy Top / Western Kurti</option>
                  </select>
                </div>
              </div>

              {/* Upper Body Measurements */}
              <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-amber-600" /> Upper Body / Blouse &amp; Kurti Sizes (Inches)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-600 font-medium mb-1">Bust / Chest (छाती)</label>
                    <input
                      type="text"
                      value={measurements.bustChest || ''}
                      onChange={(e) => handleMeasurementChange('bustChest', e.target.value)}
                      placeholder='e.g. 36"'
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 font-medium mb-1">Waist (कमर)</label>
                    <input
                      type="text"
                      value={measurements.waist || ''}
                      onChange={(e) => handleMeasurementChange('waist', e.target.value)}
                      placeholder='e.g. 30"'
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 font-medium mb-1">Total Length (लंबाई)</label>
                    <input
                      type="text"
                      value={measurements.totalLength || ''}
                      onChange={(e) => handleMeasurementChange('totalLength', e.target.value)}
                      placeholder='e.g. 14.5"'
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 font-medium mb-1">Shoulder (तीरा)</label>
                    <input
                      type="text"
                      value={measurements.shoulder || ''}
                      onChange={(e) => handleMeasurementChange('shoulder', e.target.value)}
                      placeholder='e.g. 14"'
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 font-medium mb-1">Sleeve Length (आस्तीन)</label>
                    <input
                      type="text"
                      value={measurements.sleeveLength || ''}
                      onChange={(e) => handleMeasurementChange('sleeveLength', e.target.value)}
                      placeholder='e.g. 6"'
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 font-medium mb-1">Sleeve Mori (मोहरी)</label>
                    <input
                      type="text"
                      value={measurements.sleeveMori || ''}
                      onChange={(e) => handleMeasurementChange('sleeveMori', e.target.value)}
                      placeholder='e.g. 11"'
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 font-medium mb-1">Front Neck (आगे का गला)</label>
                    <input
                      type="text"
                      value={measurements.frontNeckDepth || ''}
                      onChange={(e) => handleMeasurementChange('frontNeckDepth', e.target.value)}
                      placeholder='e.g. 6.5"'
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 font-medium mb-1">Back Neck (पीछे का गला)</label>
                    <input
                      type="text"
                      value={measurements.backNeckDepth || ''}
                      onChange={(e) => handleMeasurementChange('backNeckDepth', e.target.value)}
                      placeholder='e.g. 9"'
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Lower Body Measurements */}
              <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-amber-700" /> Lower Body / Salwar, Pant, Lehenga (Inches)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-600 font-medium mb-1">Waist (कमर)</label>
                    <input
                      type="text"
                      value={measurements.bottomWaist || ''}
                      onChange={(e) => handleMeasurementChange('bottomWaist', e.target.value)}
                      placeholder='e.g. 32"'
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 font-medium mb-1">Bottom Length (पैंट/सलवार लंबाई)</label>
                    <input
                      type="text"
                      value={measurements.bottomLength || ''}
                      onChange={(e) => handleMeasurementChange('bottomLength', e.target.value)}
                      placeholder='e.g. 38"'
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 font-medium mb-1">Bottom Mori (पैंट मोहरी)</label>
                    <input
                      type="text"
                      value={measurements.bottomMori || ''}
                      onChange={(e) => handleMeasurementChange('bottomMori', e.target.value)}
                      placeholder='e.g. 12"'
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 font-medium mb-1">Hip (हिप)</label>
                    <input
                      type="text"
                      value={measurements.hip || ''}
                      onChange={(e) => handleMeasurementChange('hip', e.target.value)}
                      placeholder='e.g. 40"'
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 font-medium mb-1">Thigh / Crotch (जांघ)</label>
                    <input
                      type="text"
                      value={measurements.thigh || ''}
                      onChange={(e) => handleMeasurementChange('thigh', e.target.value)}
                      placeholder='e.g. 23"'
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Special options */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={measurements.cupPadded || false}
                    onChange={(e) => handleMeasurementChange('cupPadded', e.target.checked)}
                    className="w-4 h-4 text-rose-800 rounded border-gray-300 focus:ring-rose-500"
                  />
                  <span>Need Padded Cups (कटोरी / पैड लगाना है)</span>
                </label>

                <div className="flex items-center gap-1.5">
                  <span>Zipper:</span>
                  <select
                    value={measurements.zipperSide || 'None'}
                    onChange={(e) => handleMeasurementChange('zipperSide', e.target.value)}
                    className="px-2 py-1 rounded border border-gray-200 text-xs"
                  >
                    <option value="None">None (Standard Hook)</option>
                    <option value="Left">Side Zip (Left)</option>
                    <option value="Back">Back Invisible Zip</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Special Fitting Instructions / Dori Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Loose fitting on sleeves, deep back dori with heavy tassels..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-900 via-pink-900 to-rose-950 text-amber-200 font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>Generate Official Naap Parchi</span>
              </button>
            </form>
          ) : (
            /* Printable Naap Parchi Preview */
            <div className="space-y-6">
              <div
                id="printable-measurement-slip"
                className="bg-amber-50/50 p-6 sm:p-8 rounded-3xl border-2 border-amber-300/80 shadow-inner relative"
              >
                {/* Watermark Logo */}
                <div className="absolute right-8 top-8 opacity-10 pointer-events-none">
                  <i className="fa-solid fa-scissors text-9xl text-amber-900"></i>
                </div>

                {/* Boutique Header */}
                <div className="text-center pb-5 border-b-2 border-dashed border-amber-300">
                  <span className="font-brand text-2xl sm:text-3xl font-extrabold text-rose-950 tracking-wider">
                    SILAI ZONE
                  </span>
                  <p className="text-xs font-serif italic text-amber-800 font-semibold mt-0.5">
                    "Sasta Mein Shandaar Silai" • Ladies &amp; Kids Boutique
                  </p>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Imli Talab, Kathgola, Kulti (Near Kulti Station) • Contact: 9339075854
                  </p>
                  <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-rose-900 text-amber-200 font-mono text-xs font-bold">
                    NAAP PARCHI #{generatedSlip.id}
                  </div>
                </div>

                {/* Customer Meta */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs border-b border-amber-200">
                  <div>
                    <span className="text-gray-500 block">Customer:</span>
                    <strong className="text-gray-900">{generatedSlip.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Phone:</span>
                    <strong className="text-gray-900">{generatedSlip.phone}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Garment:</span>
                    <strong className="text-rose-900">{generatedSlip.clothCategory}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Slip Date:</span>
                    <strong className="text-gray-900">{generatedSlip.date}</strong>
                  </div>
                </div>

                {/* Measurement Table */}
                <div className="my-4">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-2">
                    Size &amp; Fit Specifications (Inches)
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {generatedSlip.measurements.bustChest && (
                      <div className="bg-white p-2 rounded-lg border border-amber-200">
                        <span className="text-gray-500 block text-[10px]">Bust / Chest:</span>
                        <span className="font-extrabold text-rose-950 text-sm">{generatedSlip.measurements.bustChest}"</span>
                      </div>
                    )}
                    {generatedSlip.measurements.waist && (
                      <div className="bg-white p-2 rounded-lg border border-amber-200">
                        <span className="text-gray-500 block text-[10px]">Waist:</span>
                        <span className="font-extrabold text-rose-950 text-sm">{generatedSlip.measurements.waist}"</span>
                      </div>
                    )}
                    {generatedSlip.measurements.totalLength && (
                      <div className="bg-white p-2 rounded-lg border border-amber-200">
                        <span className="text-gray-500 block text-[10px]">Total Length:</span>
                        <span className="font-extrabold text-rose-950 text-sm">{generatedSlip.measurements.totalLength}"</span>
                      </div>
                    )}
                    {generatedSlip.measurements.shoulder && (
                      <div className="bg-white p-2 rounded-lg border border-amber-200">
                        <span className="text-gray-500 block text-[10px]">Shoulder:</span>
                        <span className="font-extrabold text-rose-950 text-sm">{generatedSlip.measurements.shoulder}"</span>
                      </div>
                    )}
                    {generatedSlip.measurements.sleeveLength && (
                      <div className="bg-white p-2 rounded-lg border border-amber-200">
                        <span className="text-gray-500 block text-[10px]">Sleeve Length:</span>
                        <span className="font-extrabold text-rose-950 text-sm">{generatedSlip.measurements.sleeveLength}"</span>
                      </div>
                    )}
                    {generatedSlip.measurements.sleeveMori && (
                      <div className="bg-white p-2 rounded-lg border border-amber-200">
                        <span className="text-gray-500 block text-[10px]">Sleeve Mori:</span>
                        <span className="font-extrabold text-rose-950 text-sm">{generatedSlip.measurements.sleeveMori}"</span>
                      </div>
                    )}
                    {generatedSlip.measurements.frontNeckDepth && (
                      <div className="bg-white p-2 rounded-lg border border-amber-200">
                        <span className="text-gray-500 block text-[10px]">Front Neck:</span>
                        <span className="font-extrabold text-rose-950 text-sm">{generatedSlip.measurements.frontNeckDepth}"</span>
                      </div>
                    )}
                    {generatedSlip.measurements.backNeckDepth && (
                      <div className="bg-white p-2 rounded-lg border border-amber-200">
                        <span className="text-gray-500 block text-[10px]">Back Neck:</span>
                        <span className="font-extrabold text-rose-950 text-sm">{generatedSlip.measurements.backNeckDepth}"</span>
                      </div>
                    )}
                    {generatedSlip.measurements.bottomWaist && (
                      <div className="bg-white p-2 rounded-lg border border-amber-200">
                        <span className="text-gray-500 block text-[10px]">Waist (कमर):</span>
                        <span className="font-extrabold text-rose-950 text-sm">{generatedSlip.measurements.bottomWaist}"</span>
                      </div>
                    )}
                    {generatedSlip.measurements.bottomLength && (
                      <div className="bg-white p-2 rounded-lg border border-amber-200">
                        <span className="text-gray-500 block text-[10px]">Bottom Length:</span>
                        <span className="font-extrabold text-rose-950 text-sm">{generatedSlip.measurements.bottomLength}"</span>
                      </div>
                    )}
                    {generatedSlip.measurements.bottomMori && (
                      <div className="bg-white p-2 rounded-lg border border-amber-200">
                        <span className="text-gray-500 block text-[10px]">Bottom Mori:</span>
                        <span className="font-extrabold text-rose-950 text-sm">{generatedSlip.measurements.bottomMori}"</span>
                      </div>
                    )}
                    {generatedSlip.measurements.hip && (
                      <div className="bg-white p-2 rounded-lg border border-amber-200">
                        <span className="text-gray-500 block text-[10px]">Hip Size:</span>
                        <span className="font-extrabold text-rose-950 text-sm">{generatedSlip.measurements.hip}"</span>
                      </div>
                    )}
                    <div className="bg-white p-2 rounded-lg border border-amber-200">
                      <span className="text-gray-500 block text-[10px]">Pads / Cups:</span>
                      <span className="font-bold text-gray-800">{generatedSlip.measurements.cupPadded ? 'Yes (Padded)' : 'No (Normal)'}</span>
                    </div>
                  </div>
                </div>

                {generatedSlip.notes && (
                  <div className="p-2.5 bg-amber-100/60 rounded-xl text-xs text-amber-950 border border-amber-300/60 mt-3">
                    <strong>Masterji Instructions:</strong> {generatedSlip.notes}
                  </div>
                )}

                {/* Stamp & Masterji Sign */}
                <div className="mt-6 pt-4 border-t border-amber-200 flex items-center justify-between text-[11px] text-gray-500">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Verified Silai Zone Naap Record</span>
                  </div>
                  <div className="text-right">
                    <span className="block border-b border-gray-400 w-28 mb-1"></span>
                    <span>Masterji Tailor Sign</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-3 rounded-xl bg-rose-900 hover:bg-rose-800 text-amber-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>Print / Save PDF Slip</span>
                </button>

                <button
                  onClick={shareOnWhatsApp}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                  <span>Send Naap to Masterji</span>
                </button>

                <button
                  onClick={() => setGeneratedSlip(null)}
                  className="px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-xs"
                >
                  Edit Sizes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
