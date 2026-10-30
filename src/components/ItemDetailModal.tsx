import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, MapPin, UserCheck, Key, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import { MarketplaceItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UpiPaymentModal } from './UpiPaymentModal';

interface ItemDetailModalProps {
  item: MarketplaceItem | null;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  const { currentUser } = useAuth();
  const { lockEscrowForItem, completeEscrowPickup, cancelEscrowHold } = useApp();
  
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!item) return null;

  const isSeller = currentUser?.uid === item.sellerId;
  const isEscrowBuyer = currentUser?.uid === item.escrowBuyerId;
  const totalDueNow = item.depositEscrow > 0 ? item.depositEscrow : item.price;

  const handleEscrowPaymentSuccess = (upiRef: string) => {
    lockEscrowForItem(item.itemId, upiRef);
    setShowUpiModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700">
                {item.category.replace('_', ' ')}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                item.condition === 'LIKE_NEW'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              }`}>
                {item.condition.replace('_', ' ')}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6">
            {/* Image Gallery */}
            <div className="space-y-2">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img 
                  src={item.images[activeImageIdx] || item.images[0]} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
                {item.status === 'ESCROW_PENDING' && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-amber-500/90 text-slate-950 text-xs font-black rounded-full shadow-lg">
                    <Lock className="w-3.5 h-3.5" />
                    <span>ESCROW LOCKED - INSPECTION IN PROGRESS</span>
                  </div>
                )}
                {item.status === 'SOLD' && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-300 text-xs font-black rounded-full border border-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>HANDOVER COMPLETED</span>
                  </div>
                )}
              </div>

              {item.images.length > 1 && (
                <div className="flex gap-2">
                  {item.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIdx(i)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition ${
                        activeImageIdx === i ? 'border-emerald-500' : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Price Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white leading-snug">{item.title}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Handover Hub: <strong className="text-slate-200">{item.hubLocation}</strong></span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl shrink-0 text-right sm:min-w-[140px]">
                <div className="text-xs text-slate-400 font-medium">Asking Price</div>
                <div className="text-2xl font-black text-emerald-400">₹{item.price}</div>
                {item.depositEscrow > 0 && (
                  <div className="text-[11px] text-amber-400 font-semibold mt-0.5">
                    + ₹{item.depositEscrow} Refundable Escrow
                  </div>
                )}
              </div>
            </div>

            {/* Seller Info Card */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                  {item.sellerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{item.sellerName}</span>
                    {item.sellerIsVerified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                        <UserCheck className="w-3 h-3" />
                        Verified DGU
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{item.sellerEmail || 'Registered DBS Student'}</span>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400">
                <span>Listed: {new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Item Details &amp; Notes</h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
                {item.description}
              </p>
            </div>

            {/* GearShield Digital Escrow Explainer */}
            <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-950 border border-emerald-800/40 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>GearShield Closed-Loop Escrow Protection</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                When you click <strong>Secure via Escrow</strong>, your deposit is safely held in digital escrow. The seller cannot claim it until you meet at the campus hub, inspect the asset, and exchange the security verification PIN. If the item does not match condition, cancel instantly for full refund.
              </p>
            </div>

            {/* In Escrow Status banner */}
            {item.status === 'ESCROW_PENDING' && (
              <div className="p-4 bg-amber-950/30 border border-amber-800/60 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Key className="w-4 h-4" />
                    <span>Inspection Handover Active</span>
                  </div>
                  <span className="text-xs font-mono bg-slate-950 px-3 py-1 rounded-lg text-amber-300 border border-amber-700/50">
                    PIN: {item.escrowCode || 'ESC-7741'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Buyer: <strong className="text-white">{item.escrowBuyerName || 'Campus Student'}</strong>. Meet at {item.hubLocation} to inspect item and finalize handover.
                </p>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => completeEscrowPickup(item.itemId)}
                    className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition"
                  >
                    Confirm Campus Handover (Release Funds)
                  </button>
                  <button
                    onClick={() => cancelEscrowHold(item.itemId)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold rounded-xl transition border border-rose-900/40"
                  >
                    Cancel &amp; Refund Escrow
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="p-5 bg-slate-950 border-t border-slate-800 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-2xl transition"
            >
              Close
            </button>

            {item.status === 'AVAILABLE' && (
              <button
                type="button"
                onClick={() => setShowUpiModal(true)}
                className="flex-2 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-black rounded-2xl transition shadow-lg shadow-emerald-500/20"
              >
                <Lock className="w-4 h-4" />
                <span>Secure via Escrow (₹{totalDueNow})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {item.status === 'SOLD' && (
              <div className="flex-2 flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-slate-400 text-sm font-bold rounded-2xl">
                <span>Sold &amp; Handed Over</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulated UPI Checkout Modal for Escrow Deposit */}
      <UpiPaymentModal
        isOpen={showUpiModal}
        onClose={() => setShowUpiModal(false)}
        title="Lock Deposit in Escrow"
        amount={totalDueNow}
        description={`GearShield Escrow for ${item.title}`}
        onPaymentSuccess={handleEscrowPaymentSuccess}
      />
    </>
  );
};
