import React, { useState } from 'react';
import { X, QrCode, Zap, Bike, BatteryCharging, AlertCircle, Sparkles, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Vehicle } from '../types';

interface QrUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedVehicleId?: string;
}

export const QrUnlockModal: React.FC<QrUnlockModalProps> = ({
  isOpen,
  onClose,
  preselectedVehicleId
}) => {
  const { vehicles, selectedHub, startRide, unlockVehicleByQr } = useApp();
  const { currentUser } = useAuth();
  
  const [inputCode, setInputCode] = useState(preselectedVehicleId || '');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(() => {
    if (preselectedVehicleId) {
      return vehicles.find(v => v.vehicleId === preselectedVehicleId) || null;
    }
    return null;
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  if (!isOpen) return null;

  // Filter available vehicles at the current hub
  const availableVehiclesAtHub = vehicles.filter(
    v => v.currentHub === selectedHub.name && v.status === 'AVAILABLE'
  );

  const handleSelectVehicleQuick = (v: Vehicle) => {
    setSelectedVehicle(v);
    setInputCode(v.qrCodeKey);
    setErrorMsg(null);
  };

  const handleLookupCode = (code: string) => {
    setInputCode(code);
    setErrorMsg(null);
    if (!code.trim()) {
      setSelectedVehicle(null);
      return;
    }

    const res = unlockVehicleByQr(code);
    if (res.success && res.vehicle) {
      setSelectedVehicle(res.vehicle);
      setErrorMsg(null);
    } else {
      setSelectedVehicle(null);
      setErrorMsg(res.message);
    }
  };

  const handleStartRide = () => {
    if (!selectedVehicle) {
      setErrorMsg('Please select or scan a valid vehicle QR code.');
      return;
    }

    // Determine applied plan
    let planToUse: 'TRIAL_99' | 'MONTHLY_899' | 'PAY_PER_RIDE' = 'PAY_PER_RIDE';
    if (currentUser?.activePlan === 'TRIAL_3DAY') {
      planToUse = 'TRIAL_99';
    } else if (currentUser?.activePlan === 'MONTHLY_PASS') {
      planToUse = 'MONTHLY_899';
    }

    const ok = startRide(selectedVehicle.vehicleId, planToUse);
    if (ok) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Scan &amp; Unlock Docked Asset</h3>
              <p className="text-xs text-slate-400">Dock: {selectedHub.name}</p>
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
          {/* Simulated Scanner Viewfinder */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group shadow-inner">
            {/* Camera feed overlay background */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
            
            {/* Scanner reticle box */}
            <div className="relative w-44 h-44 border-2 border-dashed border-emerald-500/60 rounded-2xl flex items-center justify-center bg-emerald-950/20 backdrop-blur-[2px]">
              {/* Corner markers */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400 rounded-br-lg"></div>

              {/* Animated laser beam */}
              <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-scan"></div>

              <div className="text-center p-3">
                <QrCode className="w-12 h-12 text-emerald-400/80 mx-auto mb-2 animate-pulse" />
                <span className="text-[11px] font-semibold text-emerald-300">
                  {selectedVehicle ? 'QR Code Aligned' : 'Aim at handlebar QR'}
                </span>
              </div>
            </div>

            {/* Camera indicator */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full border border-slate-700/50 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>HD QR Scanner Active</span>
            </div>

            <button
              onClick={() => setIsScanning(!isScanning)}
              className="absolute bottom-3 right-3 px-3 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition"
            >
              Toggle Light
            </button>
          </div>

          {/* Quick Tap Docked Vehicles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Quick-Select Docked at this Hub:</span>
              <span className="text-emerald-400">{availableVehiclesAtHub.length} ready</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {availableVehiclesAtHub.map(v => (
                <button
                  key={v.vehicleId}
                  onClick={() => handleSelectVehicleQuick(v)}
                  className={`px-3 py-2 rounded-xl border text-left shrink-0 transition flex items-center gap-2.5 ${
                    selectedVehicle?.vehicleId === v.vehicleId
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-800/70 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${v.type === 'E_SCOOTER' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {v.type === 'E_SCOOTER' ? <Zap className="w-3.5 h-3.5" /> : <Bike className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono">{v.vehicleId}</div>
                    <div className="text-[10px] text-slate-400">
                      {v.type === 'E_SCOOTER' ? `${v.batteryPercent}% bat` : '7-Speed'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Code */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Or Enter 6-Digit QR Code Key:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => handleLookupCode(e.target.value)}
                placeholder="e.g. GL-EV-101 or GL-BIKE-201"
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 uppercase"
              />
              <button
                type="button"
                onClick={() => handleLookupCode(inputCode)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
              >
                Validate
              </button>
            </div>
            {errorMsg && (
              <div className="flex items-center gap-2 text-xs text-rose-400 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Vehicle Ready Card if Selected */}
          {selectedVehicle && (
            <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-2xl space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${
                    selectedVehicle.type === 'E_SCOOTER' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {selectedVehicle.type === 'E_SCOOTER' ? <Zap className="w-6 h-6" /> : <Bike className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30 font-bold">
                        {selectedVehicle.vehicleId}
                      </span>
                      <span className="text-xs text-slate-400">{selectedVehicle.type === 'E_SCOOTER' ? 'Electric Moped' : 'Geared Cycle'}</span>
                    </div>
                    <h4 className="font-bold text-white text-base mt-0.5">{selectedVehicle.modelName}</h4>
                  </div>
                </div>

                {selectedVehicle.batteryPercent !== null && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold">
                    <BatteryCharging className="w-4 h-4 text-emerald-400" />
                    <span>{selectedVehicle.batteryPercent}%</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-900/40 text-center">
                <div className="p-2 bg-slate-900/60 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Est. Range</span>
                  <span className="text-xs font-bold text-white">{selectedVehicle.rangeKm || 'Unlimited'} km</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Covered By</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {currentUser?.activePlan === 'TRIAL_3DAY' ? '3-Day Trial' : currentUser?.activePlan === 'MONTHLY_PASS' ? 'Monthly Pass' : 'Pay-as-you-go'}
                  </span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Hub Lock</span>
                  <span className="text-xs font-bold text-slate-300">Auto Unlock</span>
                </div>
              </div>
            </div>
          )}

          {/* Subscription plan reminder */}
          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                Plan: <strong className="text-white">{currentUser?.activePlan !== 'NONE' ? currentUser?.activePlan : 'Free Pilot Ready'}</strong>
              </span>
            </div>
            {currentUser?.isVerifiedStudent && (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                DGU Student Zero-Deposit Pass
              </span>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-900 border-t border-slate-800 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-2xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedVehicle}
            onClick={handleStartRide}
            className="flex-2 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-sm font-black rounded-2xl transition shadow-lg shadow-emerald-500/20 disabled:shadow-none"
          >
            <Navigation className="w-4 h-4" />
            <span>Unlock Electronic Dock &amp; Ride</span>
          </button>
        </div>
      </div>
    </div>
  );
};
