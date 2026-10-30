import React from 'react';
import { X, MapPin, Navigation, Zap, Bike, BatteryCharging, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CampusHub } from '../types';

interface CampusMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CampusMapModal: React.FC<CampusMapModalProps> = ({ isOpen, onClose }) => {
  const { hubs, selectedHub, setSelectedHub } = useApp();

  if (!isOpen) return null;

  const handleSelectHub = (hub: CampusHub) => {
    setSelectedHub(hub);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">DBS University &amp; Selaqui Corridor Hub Map</h3>
              <p className="text-xs text-slate-400">Live Docking Slots, EV Fleet &amp; PG Corridor Transit</p>
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
          {/* Stylized Interactive Map Canvas */}
          <div className="relative aspect-[16/9] w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-40"></div>
            
            {/* Campus Road Paths SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* Selaqui Main Road */}
              <path 
                d="M 50 150 Q 150 250, 350 220 T 700 320" 
                fill="none" 
                stroke="#334155" 
                strokeWidth="6" 
                strokeDasharray="8 6" 
                className="opacity-60"
              />
              <path 
                d="M 350 220 L 520 120" 
                fill="none" 
                stroke="#334155" 
                strokeWidth="4" 
                className="opacity-40"
              />
              <path 
                d="M 350 220 L 600 380" 
                fill="none" 
                stroke="#334155" 
                strokeWidth="4" 
                className="opacity-40"
              />

              {/* Campus Boundary Zone */}
              <circle cx="50%" cy="45%" r="160" fill="#047857" fillOpacity="0.04" stroke="#10b981" strokeOpacity="0.2" strokeWidth="2" strokeDasharray="6 4" />
              <text x="50%" y="28%" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="middle" opacity="0.6">
                ★ DBS GLOBAL UNIVERSITY MAIN CAMPUS ZONE
              </text>
              <text x="22%" y="85%" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle" opacity="0.6">
                SELAKHI RESIDENTIAL PG CORRIDOR
              </text>
            </svg>

            {/* Hub Pins on Map */}
            {hubs.map((hub) => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <button
                  key={hub.id}
                  onClick={() => handleSelectHub(hub)}
                  style={{ left: `${hub.coordinates.x}%`, top: `${hub.coordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none transition-transform hover:scale-110"
                >
                  <div className="relative flex flex-col items-center">
                    {/* Pulsing ring for selected hub */}
                    {isSelected && (
                      <div className="absolute -inset-3 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />
                    )}

                    {/* Pin icon container */}
                    <div className={`p-2.5 rounded-2xl shadow-xl flex items-center justify-center transition border ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-white ring-4 ring-emerald-500/30 scale-110'
                        : 'bg-slate-900 text-emerald-400 border-slate-700 hover:border-emerald-500 hover:bg-slate-800'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>

                    {/* Tooltip Label */}
                    <div className={`mt-1.5 px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap shadow-lg border transition ${
                      isSelected
                        ? 'bg-emerald-950 text-emerald-200 border-emerald-600'
                        : 'bg-slate-900/90 text-slate-200 border-slate-800 group-hover:bg-slate-800'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <span>{hub.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-emerald-400">({hub.availableScooters + hub.availableBikes})</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hub Selection Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Docking Stations &amp; Real-Time Inventory
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {hubs.map((hub) => {
                const isSelected = selectedHub.id === hub.id;
                return (
                  <div
                    key={hub.id}
                    onClick={() => handleSelectHub(hub)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-bold text-white text-sm">{hub.name}</h5>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{hub.tagline}</p>
                        </div>
                        {isSelected && (
                          <span className="p-1 rounded-full bg-emerald-500 text-slate-950">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-emerald-400" />
                        <span>{hub.distanceFromDBS}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Zap className="w-3.5 h-3.5" />
                          <span>{hub.availableScooters} EV</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-400 font-bold">
                          <Bike className="w-3.5 h-3.5" />
                          <span>{hub.availableBikes} Cycle</span>
                        </div>
                      </div>

                      {hub.isChargingEquipped && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                          <BatteryCharging className="w-3.5 h-3.5" />
                          <span>Fast Charge</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <div className="text-xs text-slate-400">
            Selected Dock: <strong className="text-emerald-400">{selectedHub.name}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition"
          >
            Apply &amp; View Fleet
          </button>
        </div>
      </div>
    </div>
  );
};
