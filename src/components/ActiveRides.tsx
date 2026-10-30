import React, { useState } from 'react';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Battery, 
  Bike, 
  Zap, 
  ShieldCheck, 
  Flame, 
  Leaf, 
  FileText, 
  ArrowRight,
  QrCode
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const ActiveRides: React.FC<{ onNavigateToHub: () => void }> = ({ onNavigateToHub }) => {
  const { 
    activeRide, 
    activeRideElapsedSeconds, 
    activeVehicle, 
    endRide, 
    rentals, 
    hubs, 
    setOpenQrScannerModal 
  } = useApp();
  const { currentUser } = useAuth();

  const [selectedDropHub, setSelectedDropHub] = useState<string>(
    hubs.find(h => h.id === 'hub-main-gate')?.name || hubs[0].name
  );
  const [isEndingRide, setIsEndingRide] = useState<boolean>(false);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndRide = () => {
    setIsEndingRide(true);
    setTimeout(() => {
      endRide(selectedDropHub);
      setIsEndingRide(false);
    }, 1000);
  };

  // Metrics calculation
  const speedEstimate = activeRide?.vehicleType === 'E_SCOOTER' ? 19.5 : 12.0; // km/h
  const distanceEstimate = Number(((activeRideElapsedSeconds / 3600) * speedEstimate).toFixed(2));
  const caloriesEstimate = Math.round(activeRideElapsedSeconds * (activeRide?.vehicleType === 'E_SCOOTER' ? 0.05 : 0.15));
  const co2SavedEstimate = Number((distanceEstimate * 0.192).toFixed(2));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Current Active Trip Tracker */}
      {activeRide ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/50 p-6 md:p-8 shadow-2xl shadow-emerald-500/10">
          {/* Pulsing radar header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  {activeRide.vehicleType === 'E_SCOOTER' ? <Zap className="w-7 h-7" /> : <Bike className="w-7 h-7" />}
                </div>
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    LIVE TRIP #{activeRide.rentalId}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {activeRide.planType === 'TRIAL_99' ? '3-Day Trial Pass' : activeRide.planType === 'MONTHLY_899' ? 'Monthly Pass' : 'Pay-per-minute'}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white mt-1">
                  {activeVehicle?.modelName || 'Campus Fleet Vehicle'} ({activeRide.vehicleId})
                </h2>
              </div>
            </div>

            {/* Timer badge */}
            <div className="flex items-center gap-3 bg-slate-950/80 px-5 py-3 rounded-2xl border border-slate-800 self-start md:self-auto">
              <Clock className="w-5 h-5 text-emerald-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Trip Elapsed</span>
                <span className="text-2xl font-mono font-black text-emerald-400">
                  {formatTimer(activeRideElapsedSeconds)}
                </span>
              </div>
            </div>
          </div>

          {/* Real-Time Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-slate-400 text-xs flex items-center justify-center gap-1 mb-1">
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                <span>Distance</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">{distanceEstimate} <span className="text-xs text-slate-400 font-normal">km</span></div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-slate-400 text-xs flex items-center justify-center gap-1 mb-1">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>CO₂ Offset</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">{co2SavedEstimate} <span className="text-xs text-slate-400 font-normal">kg</span></div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-slate-400 text-xs flex items-center justify-center gap-1 mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Active Burn</span>
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">{caloriesEstimate} <span className="text-xs text-slate-400 font-normal">kcal</span></div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-slate-400 text-xs flex items-center justify-center gap-1 mb-1">
                <Battery className="w-3.5 h-3.5 text-teal-400" />
                <span>Battery / Status</span>
              </div>
              <div className="text-2xl font-black text-teal-400 font-mono">
                {activeVehicle?.batteryPercent ? `${activeVehicle.batteryPercent}%` : 'Geared'}
              </div>
            </div>
          </div>

          {/* Origin & Drop-Off Station */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Pickup Dock:</span>
                </div>
                <div className="text-sm font-bold text-white">{activeRide.pickupHub}</div>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-600 hidden sm:block" />

              <div className="space-y-1.5 flex-1 max-w-sm">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Return &amp; Lock Dock:</span>
                  </span>
                  <span className="text-emerald-400 text-[11px]">Free electronic docking</span>
                </div>
                <select
                  value={selectedDropHub}
                  onChange={(e) => setSelectedDropHub(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                >
                  {hubs.map(h => (
                    <option key={h.id} value={h.name}>{h.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* End Ride Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Smart Lock will beep and engage lock pin automatically once docked.</span>
              </div>
              <button
                type="button"
                disabled={isEndingRide}
                onClick={handleEndRide}
                className="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-xl shadow-rose-600/20 transition flex items-center justify-center gap-2"
              >
                {isEndingRide ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Lock Vehicle &amp; End Trip</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 md:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-5">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400">
            <Bike className="w-10 h-10 stroke-[1.5]" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-white">No Active Ride Right Now</h3>
            <p className="text-sm text-slate-400">
              Your vehicles are safely docked. Unlock any EV or geared cycle at Selaqui PG hubs or main campus gates with a single QR scan.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setOpenQrScannerModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-black rounded-2xl transition shadow-lg shadow-emerald-500/20"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan QR to Unlock</span>
            </button>
            <button
              onClick={onNavigateToHub}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-2xl transition"
            >
              <span>Explore Fleet at {currentUser?.hostelHub || 'Selaqui Hub'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Ride & Rental History List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Campus Mobility Trip History</span>
            </h3>
            <p className="text-xs text-slate-400">Subscribed passes, completed journeys &amp; UPI settlements</p>
          </div>
          <span className="text-xs font-mono text-slate-500">{rentals.length} total trips</span>
        </div>

        <div className="space-y-3">
          {rentals.map((rental) => (
            <div
              key={rental.rentalId}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl mt-1 ${
                  rental.vehicleType === 'E_SCOOTER' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {rental.vehicleType === 'E_SCOOTER' ? <Zap className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">{rental.vehicleId}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-300 font-medium">
                      {new Date(rental.startTime).toLocaleDateString()} {new Date(rental.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                      {rental.planType === 'TRIAL_99' ? '3-Day Pilot' : rental.planType === 'MONTHLY_899' ? 'Monthly Pass' : 'Pay Per Ride'}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    {rental.vehicleModel || (rental.vehicleType === 'E_SCOOTER' ? 'Electric Moped' : 'Campus Cycle')}
                  </h4>
                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                    <span>From: <strong>{rental.pickupHub}</strong></span>
                    <span>→</span>
                    <span>To: <strong>{rental.dropHub || 'Campus Gate'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Trip stats & settlement */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="text-left md:text-right">
                  <div className="text-xs font-bold text-white">{rental.distanceKm || 1.8} km</div>
                  <div className="text-[11px] text-emerald-400 font-medium">{rental.durationMinutes || 15} mins • {rental.carbonSavedKg || 0.35}kg CO₂</div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    {rental.totalCost === 0 ? 'Pass Covered' : `₹${rental.totalCost}`}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
                    {rental.upiTxnRef}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
