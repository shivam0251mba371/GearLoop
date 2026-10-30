import React from 'react';
import { 
  Zap, 
  Bike, 
  ShoppingBag, 
  Navigation, 
  Clock, 
  QrCode, 
  Plus, 
  UserCheck, 
  Wallet,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export type TabKey = 'MOBILITY' | 'MARKETPLACE' | 'RIDES';

interface NavbarProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile
}) => {
  const { currentUser, loginWithGoogle } = useAuth();
  const { 
    activeRide, 
    setOpenQrScannerModal, 
    setOpenPostItemModal 
  } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Campus Tag */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('MOBILITY')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-white tracking-tight">GearLoop</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    CAMPUS
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold tracking-wide">
                  DBS Global Univ. • Selaqui Corridor
                </div>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setActiveTab('MOBILITY')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'MOBILITY'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Mobility Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('MARKETPLACE')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'MARKETPLACE'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Campus Re-Commerce</span>
            </button>

            <button
              onClick={() => setActiveTab('RIDES')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'RIDES'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Active Rides</span>
              {activeRide && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5"></span>
              )}
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Quick QR Scanner button */}
            <button
              onClick={() => setOpenQrScannerModal(true)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 hover:text-white transition flex items-center gap-1.5"
              title="Quick QR Unlock"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden lg:inline text-xs font-bold text-slate-200">Unlock</span>
            </button>

            {/* Quick Post button */}
            <button
              onClick={() => setOpenPostItemModal(true)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-blue-400 hover:text-white transition flex items-center gap-1.5"
              title="Post Re-Commerce Item"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline text-xs font-bold text-slate-200">Sell Asset</span>
            </button>

            {/* Student Profile / Login Trigger */}
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2.5 p-1.5 pl-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
              >
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-1 text-xs font-bold text-white">
                    <span>{currentUser.displayName.split(' ')[0]}</span>
                    {currentUser.isVerifiedStudent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono font-semibold">
                    ₹{currentUser.walletBalance}
                  </div>
                </div>

                <div className="relative">
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    className="w-8 h-8 rounded-xl object-cover border border-slate-700"
                  />
                  {currentUser.isVerifiedStudent && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[8px] font-black">
                      ✓
                    </span>
                  )}
                </div>
              </button>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition shadow-lg shadow-emerald-500/20"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/60">
          <button
            onClick={() => setActiveTab('MOBILITY')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-bold ${
              activeTab === 'MOBILITY' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Mobility</span>
          </button>

          <button
            onClick={() => setActiveTab('MARKETPLACE')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-bold ${
              activeTab === 'MARKETPLACE' ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Marketplace</span>
          </button>

          <button
            onClick={() => setActiveTab('RIDES')}
            className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-bold ${
              activeTab === 'RIDES' ? 'text-indigo-400' : 'text-slate-400'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Rides</span>
            {activeRide && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-0 right-2"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
