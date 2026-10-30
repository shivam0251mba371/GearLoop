import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, QrCode, Smartphone, Copy, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount: number;
  description: string;
  onPaymentSuccess: (upiRef: string) => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  title,
  amount,
  description,
  onPaymentSuccess
}) => {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [upiRef, setUpiRef] = useState(`UPI/DGU/${Math.floor(10000000 + Math.random() * 90000000)}`);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!isOpen) return null;

  const upiId = 'gearloop.dbs@icici';
  const upiLink = `upi://pay?pa=${upiId}&pn=GearLoop%20Campus%20Mobility&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
      setTimeout(() => {
        onPaymentSuccess(upiRef);
        onClose();
        setPaymentDone(false);
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{title}</h3>
              <p className="text-xs text-slate-400">Instant Student UPI Gateway</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentDone ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">Payment Confirmed!</h4>
            <p className="text-sm text-slate-300">
              Transaction verified with DBS Campus nodal account.
            </p>
            <div className="p-3 bg-slate-800/60 rounded-xl text-xs font-mono text-emerald-400">
              REF: {upiRef}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Amount & Purpose */}
            <div className="flex items-center justify-between p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <div>
                <span className="text-xs text-slate-400 font-medium">Payable Amount</span>
                <div className="text-2xl font-black text-emerald-400 flex items-baseline gap-1">
                  <span>₹{amount}</span>
                  <span className="text-xs font-normal text-slate-400">INR</span>
                </div>
              </div>
              <div className="text-right max-w-[200px]">
                <span className="text-xs text-slate-400 font-medium">Description</span>
                <p className="text-xs text-slate-200 truncate">{description}</p>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner relative group">
              {/* Dynamic stylized QR representation */}
              <div className="w-48 h-48 bg-white p-2 rounded-xl border border-slate-200 flex flex-col items-center justify-between">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                  {/* Outer corner boxes */}
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                  <rect x="13" y="13" width="12" height="12" rx="1" fill="#0f172a" />

                  <rect x="67" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                  <rect x="75" y="13" width="12" height="12" rx="1" fill="#0f172a" />

                  <rect x="5" y="67" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                  <rect x="13" y="75" width="12" height="12" rx="1" fill="#0f172a" />

                  {/* QR Matrix Pattern Dots */}
                  <rect x="38" y="10" width="8" height="6" rx="1" fill="#0f172a" />
                  <rect x="50" y="10" width="12" height="6" rx="1" fill="#0f172a" />
                  <rect x="38" y="20" width="6" height="8" rx="1" fill="#0f172a" />
                  <rect x="48" y="20" width="14" height="6" rx="1" fill="#0f172a" />

                  <rect x="10" y="38" width="6" height="12" rx="1" fill="#0f172a" />
                  <rect x="20" y="38" width="8" height="6" rx="1" fill="#0f172a" />
                  <rect x="10" y="54" width="12" height="6" rx="1" fill="#0f172a" />

                  <rect x="38" y="38" width="24" height="24" rx="4" fill="#10b981" />
                  <text x="50" y="54" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">GL</text>

                  <rect x="68" y="38" width="10" height="6" rx="1" fill="#0f172a" />
                  <rect x="82" y="38" width="10" height="14" rx="1" fill="#0f172a" />
                  <rect x="68" y="50" width="8" height="8" rx="1" fill="#0f172a" />

                  <rect x="38" y="68" width="12" height="8" rx="1" fill="#0f172a" />
                  <rect x="54" y="68" width="10" height="6" rx="1" fill="#0f172a" />
                  <rect x="68" y="68" width="24" height="8" rx="1" fill="#0f172a" />
                  <rect x="38" y="80" width="8" height="12" rx="1" fill="#0f172a" />
                  <rect x="50" y="80" width="20" height="8" rx="1" fill="#0f172a" />
                  <rect x="74" y="80" width="18" height="12" rx="1" fill="#0f172a" />
                </svg>
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-slate-600">
                <span>Scan with GPay / PhonePe / Paytm</span>
              </div>
            </div>

            {/* UPI ID copy */}
            <div className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/80">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="text-slate-400">UPI ID:</span>
                <span className="font-mono text-emerald-400 font-bold">{upiId}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* UPI Deep links */}
            <div className="grid grid-cols-4 gap-2">
              <a
                href={upiLink}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition group text-center"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold mb-1">
                  G
                </div>
                <span className="text-[10px] text-slate-300">Google Pay</span>
              </a>
              <a
                href={upiLink}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition group text-center"
              >
                <div className="w-7 h-7 rounded-full bg-purple-600/30 text-purple-400 flex items-center justify-center text-xs font-bold mb-1">
                  Pe
                </div>
                <span className="text-[10px] text-slate-300">PhonePe</span>
              </a>
              <a
                href={upiLink}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition group text-center"
              >
                <div className="w-7 h-7 rounded-full bg-sky-600/30 text-sky-400 flex items-center justify-center text-xs font-bold mb-1">
                  Pt
                </div>
                <span className="text-[10px] text-slate-300">Paytm</span>
              </a>
              <a
                href={upiLink}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition group text-center"
              >
                <div className="w-7 h-7 rounded-full bg-amber-600/30 text-amber-400 flex items-center justify-center text-xs font-bold mb-1">
                  BH
                </div>
                <span className="text-[10px] text-slate-300">BHIM UPI</span>
              </a>
            </div>

            {/* Simulated UPI Reference Code input */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 flex items-center justify-between">
                <span>12-Digit UPI Ref / UTR Number:</span>
                <span className="text-[10px] text-emerald-400">Pre-generated for quick testing</span>
              </label>
              <input
                type="text"
                value={upiRef}
                onChange={(e) => setUpiRef(e.target.value)}
                placeholder="e.g. 428190382910"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Campus Closed-Loop Guarantee: Instant refund protection for student members.</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-600/50 text-slate-950 text-sm font-bold rounded-xl transition shadow-lg shadow-emerald-500/20"
              >
                {isProcessing ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm &amp; Activate</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
