import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar, TabKey } from './components/Navbar';
import { MobilityHub } from './components/MobilityHub';
import { Marketplace } from './components/Marketplace';
import { ActiveRides } from './components/ActiveRides';
import { ProfileModal } from './components/ProfileModal';
import { QrUnlockModal } from './components/QrUnlockModal';
import { 
  Zap, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Lock,
  X
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, switchDemoProfile } = useAuth();
  const { 
    activeRide, 
    activeRideElapsedSeconds, 
    activeVehicle, 
    toastMessage, 
    clearToast, 
    openQrScannerModal, 
    setOpenQrScannerModal 
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabKey>('MOBILITY');
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  const formatMinSec = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0c1017] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 bg-slate-900 border border-emerald-500/60 rounded-2xl shadow-2xl text-xs text-white flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            onClick={clearToast}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Institutional verification highlight banner if not verified */}
      {currentUser && !currentUser.isVerifiedStudent && (
        <div className="bg-amber-950/60 border-b border-amber-800/60 px-4 py-2.5 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Signed in with external domain <strong>{currentUser.email}</strong>. Switch or link your <strong>@dgu.ac.in</strong> email for instant ₹0 deposit and verified student badges.
            </span>
          </div>
          <button
            onClick={() => switchDemoProfile('verified-dgu')}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[11px] transition shrink-0"
          >
            Switch to Verified DGU Student Demo
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      {/* Floating Active Trip Pill (visible on other tabs when ride is active) */}
      {activeRide && activeTab !== 'RIDES' && (
        <div className="sticky top-20 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
          <div 
            onClick={() => setActiveTab('RIDES')}
            className="cursor-pointer p-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/60 shadow-xl flex items-center justify-between gap-4 hover:border-emerald-400 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-emerald-400 block animate-ping absolute"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">ACTIVE COMMUTE:</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">{activeRide.vehicleId}</span>
                <span className="text-xs text-slate-400 hidden sm:inline">• {activeRide.pickupHub}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs font-mono font-bold text-white bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                {formatMinSec(activeRideElapsedSeconds)}
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View &amp; Return</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Application Content Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'MOBILITY' && <MobilityHub />}
        {activeTab === 'MARKETPLACE' && <Marketplace />}
        {activeTab === 'RIDES' && <ActiveRides onNavigateToHub={() => setActiveTab('MOBILITY')} />}
      </main>

      {/* Student Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* QR Scanner / Unlock Modal */}
      <QrUnlockModal
        isOpen={openQrScannerModal}
        onClose={() => setOpenQrScannerModal(false)}
      />

      {/* Campus Platform Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/90 text-slate-400 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>GearLoop — Hyper-Local Campus Mobility &amp; Re-Commerce</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Serving DBS Global University, Selaqui PG Corridor, Green Valley &amp; Dehradun Academic Hubs.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GearShield Escrow Protection</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1.5 text-blue-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>@dgu.ac.in Verified Network</span>
            </div>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setShowProfileModal(true)}
              className="text-slate-300 hover:text-white underline"
            >
              Student Credentials &amp; Demo Switcher
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </AuthProvider>
  );
}
