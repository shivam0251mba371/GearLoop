import React, { useState } from 'react';
import { X, Upload, ShieldAlert, Sparkles, Image as ImageIcon, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ItemCategory, ItemCondition } from '../types';

interface PostItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_SAMPLE_PHOTOS: { label: string; url: string; cat: ItemCategory }[] = [
  {
    label: 'Mini Fridge / Chiller',
    url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    cat: 'APPLIANCE'
  },
  {
    label: 'Study Desk & Chair',
    url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    cat: 'FURNITURE'
  },
  {
    label: 'Induction / Kettle',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    cat: 'APPLIANCE'
  },
  {
    label: 'Campus Bicycle',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    cat: 'CYCLE'
  },
  {
    label: 'Textbooks / Notes',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    cat: 'BOOKS_NOTES'
  },
  {
    label: 'Room Heater / Fan',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    cat: 'GEAR'
  }
];

export const PostItemModal: React.FC<PostItemModalProps> = ({ isOpen, onClose }) => {
  const { hubs, createMarketplaceItem } = useApp();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('APPLIANCE');
  const [price, setPrice] = useState<number>(1200);
  const [hasDeposit, setHasDeposit] = useState<boolean>(true);
  const [depositEscrow, setDepositEscrow] = useState<number>(300);
  const [condition, setCondition] = useState<ItemCondition>('LIKE_NEW');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_SAMPLE_PHOTOS[0].url);
  const [hubLocation, setHubLocation] = useState(currentUser?.hostelHub || hubs[0].name);

  if (!isOpen) return null;

  const handlePriceChange = (val: number) => {
    setPrice(val);
    if (hasDeposit) {
      // Suggest ~20-25% deposit
      setDepositEscrow(Math.round(val * 0.25));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createMarketplaceItem({
      sellerId: currentUser?.uid || 'student-user',
      sellerName: currentUser?.displayName || 'Campus Scholar',
      sellerEmail: currentUser?.email || 'student@dgu.ac.in',
      sellerIsVerified: currentUser?.isVerifiedStudent ?? true,
      title: title.trim(),
      category,
      price: Number(price) || 500,
      depositEscrow: hasDeposit ? Number(depositEscrow) || 0 : 0,
      condition,
      description: description.trim() || 'Genuine student essential item in good working order. Handover at specified campus docking station.',
      images: [imageUrl],
      hubLocation
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Post Asset to Campus Re-Commerce</h3>
              <p className="text-xs text-slate-400">P2P Closed-Loop Market for DBS Students</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Item Title */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-semibold">Listing Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Philips Induction Cooktop with Warranty, 21-Speed Cycle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category & Condition Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-semibold">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as ItemCategory;
                  setCategory(cat);
                  const matchingPreset = PRESET_SAMPLE_PHOTOS.find(p => p.cat === cat);
                  if (matchingPreset) setImageUrl(matchingPreset.url);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="APPLIANCE">Appliances (Fridge, Induction, Kettle)</option>
                <option value="FURNITURE">Furniture (Desk, Chair, Mattress)</option>
                <option value="BOOKS_NOTES">Books &amp; Exam Notes</option>
                <option value="CYCLE">Bicycles &amp; Rides</option>
                <option value="GEAR">Room Gear &amp; Electronics</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-semibold">Physical Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="LIKE_NEW">Like New (Used &lt; 1 Sem)</option>
                <option value="GOOD">Good (Functional &amp; Clean)</option>
                <option value="FAIR">Fair (Visible signs of use)</option>
              </select>
            </div>
          </div>

          {/* Pricing & Refundable Escrow */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold">Asking Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="50"
                    required
                    value={price}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-300 font-semibold">Buyer Deposit Escrow</label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-blue-400">
                    <input
                      type="checkbox"
                      checked={hasDeposit}
                      onChange={(e) => {
                        setHasDeposit(e.target.checked);
                        if (!e.target.checked) setDepositEscrow(0);
                        else setDepositEscrow(Math.round(price * 0.25));
                      }}
                      className="rounded bg-slate-800 text-blue-500 focus:ring-0"
                    />
                    <span>Required</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    disabled={!hasDeposit}
                    value={depositEscrow}
                    onChange={(e) => setDepositEscrow(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-900 border border-slate-700 disabled:opacity-50 rounded-xl text-sm font-bold text-emerald-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 bg-blue-950/30 border border-blue-900/40 rounded-xl text-xs text-blue-300">
              <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>GearShield Escrow:</strong> Deposit is securely locked until the buyer inspects the item in-person on campus. No ghosting, no fake claims.
              </span>
            </div>
          </div>

          {/* Photo Selection / Preset */}
          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-semibold flex items-center justify-between">
              <span>Item Photo:</span>
              <span className="text-[11px] text-slate-400">Choose sample photo or paste custom URL</span>
            </label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_SAMPLE_PHOTOS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(item.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition group ${
                    imageUrl === item.url ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-800 hover:border-slate-700'
                  }`}
                  title={item.label}
                >
                  <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                  {imageUrl === item.url && (
                    <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <input
              type="url"
              placeholder="Or paste direct image URL (https://...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Handover Dock */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-semibold">Preferred Handover Dock / PG Hub</label>
            <select
              value={hubLocation}
              onChange={(e) => setHubLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {hubs.map(h => (
                <option key={h.id} value={h.name}>{h.name}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-semibold">Details &amp; Notes</label>
            <textarea
              rows={3}
              placeholder="Mention semester purchased, any warranty left, working condition, accessories included..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
            ></textarea>
          </div>

          {/* Verification Badge footer */}
          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400">
            <span>Listing as:</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <span>{currentUser?.displayName || 'DBS Student'}</span>
              {currentUser?.isVerifiedStudent && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                  ✓ Verified DGU Student
                </span>
              )}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-2xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-2xl transition shadow-lg shadow-blue-600/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish Verified Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
