import React, { useState } from 'react';
import { 
  Zap, 
  Bike, 
  MapPin, 
  Battery, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  SlidersHorizontal,
  Flame,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Vehicle, VehicleType } from '../types';
import { UpiPaymentModal } from './UpiPaymentModal';
import { QrUnlockModal } from './QrUnlockModal';
import { CampusMapModal } from './CampusMapModal';

export const MobilityHub: React.FC = () => {
  const { 
    hubs, 
    selectedHub, 
    setSelectedHub, 
    vehicles, 
    activeRide,
    setOpenQrScannerModal 
  } = useApp();
  const { currentUser, subscribeToPlan } = useAuth();

  const [filterType, setFilterType] = useState<'ALL' | VehicleType>('ALL');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [selectedVehicleForQr, setSelectedVehicleForQr] = useState<string | null>(null);

  // Modals state
  const [showPlanPaymentModal, setShowPlanPaymentModal] = useState<{
    isOpen: boolean;
    plan: 'TRIAL_3DAY' | 'MONTHLY_PASS';
    name: string;
    price: number;
    days: number;
  }>({
    isOpen: false,
    plan: 'TRIAL_3DAY',
    name: '3-Day Pilot Trial',
    price: 99,
    days: 3
  });

  const [showMapModal, setShowMapModal] = useState(false);

  // Filter vehicles at the selected hub
  const hubVehicles = vehicles.filter(v => {
    const hubMatch = v.currentHub === selectedHub.name;
    const typeMatch = filterType === 'ALL' || v.type === filterType;
    const availMatch = !onlyAvailable || v.status === 'AVAILABLE';
    return hubMatch && typeMatch && availMatch;
  });

  const handleOpenPlanPurchase = (plan: 'TRIAL_3DAY' | 'MONTHLY_PASS') => {
    if (plan === 'TRIAL_3DAY') {
      setShowPlanPaymentModal({
        isOpen: true,
        plan: 'TRIAL_3DAY',
        name: '3-Day Pilot Trial Pass',
        price: 99,
        days: 3
      });
    } else {
      setShowPlanPaymentModal({
        isOpen: true,
        plan: 'MONTHLY_PASS',
        name: '30-Day Monthly Saver Pass',
        price: 899,
        days: 30
      });
    }
  };

  const handlePlanPaymentSuccess = (upiRef: string) => {
    subscribeToPlan(showPlanPaymentModal.plan, showPlanPaymentModal.days, upiRef);
    setShowPlanPaymentModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Hero Mobility Banner & Pass Status */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Background glow & accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Micro-Mobility Network</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Instant Commute Between <span className="text-emerald-400">Selaqui PGs</span> &amp; DBS Campus.
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Skip overpriced autos and erratic shuttle timings. Unlock IoT-enabled electric mopeds &amp; geared cycles at designated hostel hubs with seamless student passes.
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>6 Campus &amp; PG Docks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Zero Security Deposit for DGU Students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Fast Battery Swaps</span>
              </div>
            </div>
          </div>

          {/* Quick Unlock Action Box */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl flex flex-col gap-3 min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Student Mobility Pass:</span>
              <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                {currentUser?.activePlan === 'TRIAL_3DAY' ? '3-Day Trial Active' : currentUser?.activePlan === 'MONTHLY_PASS' ? 'Monthly Pass Active' : 'No Pass'}
              </span>
            </div>

            <button
              onClick={() => setOpenQrScannerModal(true)}
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group"
            >
              <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Scan QR to Unlock Ride</span>
            </button>

            <button
              onClick={() => setShowMapModal(true)}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>View Interactive Hub Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Pricing Tiers (₹99 vs ₹899) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Select Mobility Subscription Pass</span>
            </h2>
            <p className="text-xs text-slate-400">
              Tailored for semester schedules and PG-to-campus commutes
            </p>
          </div>
          {currentUser?.isVerifiedStudent && (
            <span className="text-xs text-emerald-400 font-semibold hidden sm:flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              Verified DGU Student ₹0 Deposit Applied
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Plan 1: 3-Day Pilot Trial (₹99) */}
          <div className={`relative rounded-3xl p-6 border transition flex flex-col justify-between ${
            currentUser?.activePlan === 'TRIAL_3DAY'
              ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border-emerald-500 ring-2 ring-emerald-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  Pilot Testing Pass
                </span>
                <span className="text-xs text-slate-400">3 Days Validity</span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">3-Day Pilot Trial</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-emerald-400">₹99</span>
                  <span className="text-xs text-slate-400 line-through">₹249</span>
                  <span className="text-xs text-emerald-400 font-bold">60% Off for Students</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  Test the fleet on your daily morning PG commute without long-term commitment.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 text-xs text-slate-300 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited 30-min hops between Selaqui PGs and DBS campus</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Both Electric Scooters &amp; Geared Bicycles included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>₹0 Refundable security deposit for @dgu.ac.in emails</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              {currentUser?.activePlan === 'TRIAL_3DAY' ? (
                <div className="w-full py-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl text-center">
                  ✓ Current Active Plan
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenPlanPurchase('TRIAL_3DAY')}
                  className="w-full py-3 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <span>Activate 3-Day Pass (₹99)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Plan 2: 30-Day Monthly Saver (₹899) */}
          <div className={`relative rounded-3xl p-6 border transition flex flex-col justify-between ${
            currentUser?.activePlan === 'MONTHLY_PASS'
              ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border-indigo-500 ring-2 ring-indigo-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}>
            <div className="absolute -top-3 right-6 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black uppercase rounded-full shadow-lg">
              Most Popular • Best Value
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
                  Semester Commuter Pass
                </span>
                <span className="text-xs text-slate-400">30 Days Full Access</span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">30-Day Monthly Saver</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-indigo-400">₹899</span>
                  <span className="text-xs text-slate-400">~₹29 / day</span>
                  <span className="text-xs text-amber-400 font-bold">(Cheaper than 2 autos)</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  Complete semester freedom with overnight PG custody privileges and priority battery swaps.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 text-xs text-slate-300 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Unlimited daily campus rides (No trip duration penalties)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Overnight PG parking allowed (Keep vehicle at hostel overnight)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Free battery swaps at Selaqui Hub A &amp; DBS Gate</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              {currentUser?.activePlan === 'MONTHLY_PASS' ? (
                <div className="w-full py-3 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold rounded-xl text-center">
                  ✓ Current Active Plan
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenPlanPurchase('MONTHLY_PASS')}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  <span>Activate 30-Day Pass (₹899)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Docking Hub Selector Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Campus Docking Hubs &amp; Fleet Locator</span>
            </h2>
            <p className="text-xs text-slate-400">
              Currently viewing: <strong className="text-white">{selectedHub.name}</strong> ({selectedHub.distanceFromDBS})
            </p>
          </div>

          <button
            onClick={() => setShowMapModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition self-start sm:self-auto"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Map</span>
          </button>
        </div>

        {/* Hub Scroll Pills */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {hubs.map(hub => {
            const isSelected = selectedHub.id === hub.id;
            return (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(hub)}
                className={`px-4 py-3 rounded-2xl text-left shrink-0 transition border flex items-center gap-3 ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{hub.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {hub.availableScooters} EV • {hub.availableBikes} Bikes
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fleet Filter & Vehicle Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-300">Fleet Filter:</span>
            <div className="flex gap-1.5 ml-2">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition ${
                  filterType === 'ALL' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All ({vehicles.filter(v => v.currentHub === selectedHub.name).length})
              </button>
              <button
                onClick={() => setFilterType('E_SCOOTER')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition flex items-center gap-1 ${
                  filterType === 'E_SCOOTER' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>EV Scooters</span>
              </button>
              <button
                onClick={() => setFilterType('BICYCLE')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition flex items-center gap-1 ${
                  filterType === 'BICYCLE' ? 'bg-blue-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Bike className="w-3 h-3" />
                <span>Cycles</span>
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded bg-slate-800 text-emerald-500 focus:ring-0"
            />
            <span>Show Available Only</span>
          </label>
        </div>

        {/* Vehicles Cards Grid */}
        {hubVehicles.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 space-y-2">
            <Bike className="w-8 h-8 mx-auto text-slate-500" />
            <p className="text-sm">No vehicles matching your filter at this docking station right now.</p>
            <button
              onClick={() => { setFilterType('ALL'); setOnlyAvailable(false); }}
              className="text-xs text-emerald-400 underline font-semibold"
            >
              Reset filters or switch hub
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hubVehicles.map(vehicle => {
              const isAvailable = vehicle.status === 'AVAILABLE';
              return (
                <div
                  key={vehicle.vehicleId}
                  className={`p-5 rounded-3xl border transition flex flex-col justify-between ${
                    isAvailable
                      ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-xl'
                      : 'bg-slate-950/60 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2.5 rounded-xl ${
                          vehicle.type === 'E_SCOOTER' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {vehicle.type === 'E_SCOOTER' ? <Zap className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-white">{vehicle.vehicleId}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {vehicle.status}
                            </span>
                          </div>
                          <h4 className="font-bold text-white text-sm mt-0.5">{vehicle.modelName}</h4>
                        </div>
                      </div>

                      {vehicle.batteryPercent !== null && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-emerald-400">
                          <Battery className="w-3.5 h-3.5" />
                          <span>{vehicle.batteryPercent}%</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-1">
                      <div className="p-2 rounded-xl bg-slate-950/60 text-slate-300">
                        <span className="text-[10px] text-slate-500 block">Capability</span>
                        <span className="font-semibold text-white">
                          {vehicle.type === 'E_SCOOTER' ? `${vehicle.rangeKm} km Range` : `${vehicle.gearCount}-Speed Gear`}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 text-slate-300">
                        <span className="text-[10px] text-slate-500 block">Rate / Pass</span>
                        <span className="font-semibold text-emerald-400">Included in Pass</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="text-[11px] font-mono text-slate-500">
                      QR: {vehicle.qrCodeKey}
                    </div>

                    <button
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedVehicleForQr(vehicle.vehicleId)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Unlock Ride</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Plan Purchase UPI Modal */}
      <UpiPaymentModal
        isOpen={showPlanPaymentModal.isOpen}
        onClose={() => setShowPlanPaymentModal(prev => ({ ...prev, isOpen: false }))}
        title={showPlanPaymentModal.name}
        amount={showPlanPaymentModal.price}
        description={`GearLoop ${showPlanPaymentModal.name}`}
        onPaymentSuccess={handlePlanPaymentSuccess}
      />

      {/* Vehicle QR Unlock Modal */}
      <QrUnlockModal
        isOpen={Boolean(selectedVehicleForQr)}
        onClose={() => setSelectedVehicleForQr(null)}
        preselectedVehicleId={selectedVehicleForQr || undefined}
      />

      {/* Campus Map Modal */}
      <CampusMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
      />
    </div>
  );
};
