import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Wallet, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  LogOut,
  RefreshCw,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile, switchDemoProfile, logout } = useAuth();
  const { hubs, showToast } = useApp();

  const [hostelHub, setHostelHub] = useState(currentUser?.hostelHub || hubs[0].name);
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [upiId, setUpiId] = useState(currentUser?.upiId || 'student@okaxis');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      hostelHub,
      phone,
      upiId
    });
    setIsSaved(true);
    showToast('Campus profile & UPI settlement preferences updated!');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Campus Student Profile</h3>
              <p className="text-xs text-slate-400">Institutional ID &amp; Escrow Wallet</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Institutional Student ID Card Visualization */}
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950 p-5 border border-indigo-500/30 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
                />
                <div>
                  <h4 className="font-black text-white text-base flex items-center gap-2">
                    <span>{currentUser.displayName}</span>
                    {currentUser.isVerifiedStudent && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                    )}
                  </h4>
                  <div className="text-xs font-mono text-indigo-300">{currentUser.email}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {currentUser.department || 'DBS Global University Scholar'}
                  </div>
                </div>
              </div>

              {/* Verified badge */}
              {currentUser.isVerifiedStudent ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black flex items-center gap-1 uppercase tracking-wider shrink-0">
                  <UserCheck className="w-3.5 h-3.5" />
                  Verified DGU
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black flex items-center gap-1 uppercase tracking-wider shrink-0">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Unverified
                </span>
              )}
            </div>

            {/* Bottom info banner */}
            <div className="mt-4 pt-3 border-t border-indigo-900/40 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Student ID Number</span>
                <span className="font-mono font-bold text-slate-200">{currentUser.studentId || 'DGU-2023-CS-049'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Current Plan</span>
                <span className="font-bold text-emerald-400">
                  {currentUser.activePlan === 'TRIAL_3DAY' ? '3-Day Pilot Active' : currentUser.activePlan === 'MONTHLY_PASS' ? '30-Day Monthly Pass' : 'Standard'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Demo Persona Switcher for Evaluation */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                <span>One-Click Demo Evaluator Switcher:</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Test Domain Badges</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  switchDemoProfile('verified-dgu');
                  showToast('Switched to Karan Singhania (@dgu.ac.in) — 3-Day Pilot Trial');
                }}
                className={`p-2 rounded-xl text-left border text-xs transition ${
                  currentUser.email === 'karan.singh@dgu.ac.in'
                    ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="text-[11px] font-bold">Karan (DBS)</div>
                <div className="text-[9px] text-emerald-400">@dgu.ac.in (Trial)</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  switchDemoProfile('monthly-dgu');
                  showToast('Switched to Priya Verma (@dgu.ac.in) — Monthly Passholder');
                }}
                className={`p-2 rounded-xl text-left border text-xs transition ${
                  currentUser.email === 'priya.verma@dgu.ac.in'
                    ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="text-[11px] font-bold">Priya (DBS)</div>
                <div className="text-[9px] text-emerald-400">@dgu.ac.in (Monthly)</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  switchDemoProfile('unverified-guest');
                  showToast('Switched to Guest (@gmail.com) — Shows verification guard');
                }}
                className={`p-2 rounded-xl text-left border text-xs transition ${
                  !currentUser.isVerifiedStudent
                    ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="text-[11px] font-bold">Guest User</div>
                <div className="text-[9px] text-amber-400">@gmail.com (Unverified)</div>
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Preferred Hostel / PG Docking Hub */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Primary Hostel / PG Docking Hub</span>
              </label>
              <select
                value={hostelHub}
                onChange={(e) => setHostelHub(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {hubs.map(h => (
                  <option key={h.id} value={h.name}>{h.name}</option>
                ))}
              </select>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mobile Number for OTP &amp; UPI Escrow Alerts</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* UPI ID for Escrow Payouts */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                <span>Student UPI ID (For Marketplace Payouts)</span>
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. name@okaxis or name@paytm"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Wallet & Escrow balance */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Campus Escrow Wallet</span>
                <div className="text-xl font-black text-emerald-400">₹{currentUser.walletBalance}</div>
              </div>
              <div className="text-xs text-slate-400 text-right">
                <span>Refundable deposit buffer:</span>
                <div className="text-white font-mono font-bold">100% Protected</div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/30"
              >
                {isSaved ? 'Preferences Saved!' : 'Save Hub & UPI Preferences'}
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-rose-400 font-medium text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
