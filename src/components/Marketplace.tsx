import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ShieldCheck, 
  MapPin, 
  SlidersHorizontal, 
  Package, 
  UserCheck, 
  Lock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ItemCategory, MarketplaceItem } from '../types';
import { PostItemModal } from './PostItemModal';
import { ItemDetailModal } from './ItemDetailModal';

export const Marketplace: React.FC = () => {
  const { marketplaceItems, openPostItemModal, setOpenPostItemModal } = useApp();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ItemCategory>('ALL');
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<MarketplaceItem | null>(null);

  const categories: { key: 'ALL' | ItemCategory; label: string }[] = [
    { key: 'ALL', label: 'All Essentials' },
    { key: 'APPLIANCE', label: 'Hostel Appliances' },
    { key: 'FURNITURE', label: 'Desk & Furniture' },
    { key: 'BOOKS_NOTES', label: 'Books & Notes' },
    { key: 'CYCLE', label: 'Cycles & Rides' },
    { key: 'GEAR', label: 'Room Gear' }
  ];

  const filteredItems = marketplaceItems.filter(item => {
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchQuery = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hubLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Marketplace Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950/40 border border-blue-500/30 p-6 md:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Closed-Loop Student Re-Commerce</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Buy, Sell &amp; Handover <span className="text-blue-400">Semester Essentials</span> with Escrow.
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              No strangers from outside campus. Verified DBS students buy and sell hostel refrigerators, induction tops, study desks, and cycles with 100% deposit escrow protection.
            </p>
          </div>

          <button
            onClick={() => setOpenPostItemModal(true)}
            className="flex items-center justify-center gap-2.5 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition shrink-0 group self-start md:self-auto"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>Post an Asset for Sale</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search hostel mini-fridge, induction, books, cycles, table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner"
            />
          </div>

          <button
            onClick={() => setOpenPostItemModal(true)}
            className="sm:hidden flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-bold text-xs rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Sell Item</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition ${
                selectedCategory === cat.key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Marketplace Catalog Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400 space-y-3">
          <Package className="w-10 h-10 mx-auto text-slate-500" />
          <h3 className="text-base font-bold text-white">No Items Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or be the first student to post an asset in this category!
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
            className="px-4 py-2 bg-slate-800 text-xs text-slate-200 font-semibold rounded-xl hover:bg-slate-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map(item => (
            <div
              key={item.itemId}
              onClick={() => setSelectedItemForDetail(item)}
              className="group cursor-pointer rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/10 transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image card with badges */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Condition Tag */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-sm text-[11px] font-bold text-white border border-slate-800">
                      {item.condition.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Status Tag */}
                  {item.status === 'ESCROW_PENDING' && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase shadow-md flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Escrow Locked</span>
                    </div>
                  )}

                  {item.status === 'SOLD' && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-800/90 text-slate-300 text-[10px] font-bold uppercase border border-slate-700">
                      <span>Sold</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="text-2xl font-black text-emerald-400">
                      ₹{item.price}
                    </div>
                    {item.depositEscrow > 0 && (
                      <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        ₹{item.depositEscrow} Escrow
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-base line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {item.sellerName.charAt(0)}
                      </span>
                      <span className="truncate font-medium">{item.sellerName.split(' ')[0]}</span>
                      {item.sellerIsVerified && (
                        <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span className="truncate max-w-[100px]">{item.hubLocation.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA bar */}
              <div className="px-5 pb-5 pt-0">
                <button
                  type="button"
                  className="w-full py-2.5 bg-slate-800 group-hover:bg-blue-600 text-slate-200 group-hover:text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Inspect &amp; Secure via Escrow</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Item Drawer/Modal */}
      <PostItemModal
        isOpen={openPostItemModal}
        onClose={() => setOpenPostItemModal(false)}
      />

      {/* Item Detail & Escrow Reserve Modal */}
      <ItemDetailModal
        item={selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
      />
    </div>
  );
};
