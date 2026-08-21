import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  Hotel, 
  Plus, 
  Trash2, 
  Edit, 
  Star, 
  MapPin, 
  Search, 
  Sparkles, 
  Bed, 
  ExternalLink,
  AlertTriangle,
  X
} from 'lucide-react';

const HotelsManager = () => {
  const { hotels, deleteHotel, t } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredHotels = hotels.filter((h: any) => {
    const matchesSearch = (h.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (h.city || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDest = destinationFilter === 'all' || h.destination === destinationFilter;
    return matchesSearch && matchesDest;
  });

  const handleDeleteConfirmed = () => {
    if (deleteConfirmId) {
      deleteHotel(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Hotel className="text-emerald-400" size={28} />
            <span>{t('hotelsManagerTitle')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('hotelsManagerSubtitle')}
          </p>
        </div>

        <button
          onClick={() => navigate('/hotels/edit/new')}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 shrink-0 cursor-pointer"
        >
          <Plus size={18} />
          <span>{t('addHotel')}</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#161b22] border border-slate-800 rounded-2xl p-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('searchHotelOrCity')}
            className="w-full bg-[#0d1117] border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={destinationFilter}
            onChange={e => setDestinationFilter(e.target.value)}
            className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-semibold focus:border-emerald-500 focus:outline-none cursor-pointer"
          >
            <option value="all">جميع الوجهات (All Destinations)</option>
            <option value="egypt">مصر 🇪🇬</option>
            <option value="turkey">تركيا 🇹🇷</option>
            <option value="jordan">الأردن 🇯🇴</option>
            <option value="morocco">المغرب 🇲🇦</option>
            <option value="greece">اليونان 🇬🇷</option>
            <option value="dubai">دبي 🇦🇪</option>
            <option value="tunisia">تونس 🇹🇳</option>
            <option value="holyland">الأرض المقدسة 🕊️</option>
          </select>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((h: any) => (
          <div 
            key={h.id} 
            className="bg-[#161b22] border border-slate-800 hover:border-emerald-500/40 rounded-3xl overflow-hidden transition-all duration-200 shadow-lg flex flex-col justify-between group"
          >
            <div>
              {/* Card Image Header */}
              <div className="h-48 bg-slate-800 relative overflow-hidden">
                <img 
                  src={h.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'} 
                  alt={h.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-amber-500/90 backdrop-blur-sm text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                  <Star size={11} className="fill-slate-950" />
                  <span>{h.stars || 5} نجوم</span>
                </div>

                {h.status && (
                  <div className="absolute top-3 left-3 bg-emerald-500/90 text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                    {h.status}
                  </div>
                )}
              </div>

              {/* Card Details Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                    <MapPin size={13} />
                    <span>{h.city || 'المدينة'} • {h.destination}</span>
                  </div>
                  <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                    ${h.pricePerNight || 150} / ليلة
                  </span>
                </div>

                <h3 className="font-bold text-white text-base leading-snug group-hover:text-emerald-400 transition-colors">
                  {h.name}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {h.description || 'فندق فاخر يوفر خدمات الضيافة المتميزة للنزلاء والضيوف.'}
                </p>

                {/* Additional Stats Badges */}
                <div className="flex items-center gap-2 pt-1">
                  {Array.isArray(h.amenities) && h.amenities.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded-lg">
                      <Sparkles size={10} className="text-emerald-400" />
                      <span>{h.amenities.length} مرفق وخدمة</span>
                    </span>
                  )}

                  {Array.isArray(h.roomTypes) && h.roomTypes.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded-lg">
                      <Bed size={10} className="text-amber-400" />
                      <span>{h.roomTypes.length} فئات غرف</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/40">
              <span className="text-[11px] text-slate-500 font-mono">{h.id}</span>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/hotels/edit/${h.id}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold text-xs transition-all border border-emerald-500/30"
                >
                  <Edit size={14} />
                  <span>تعديل البيانات الكاملة</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setDeleteConfirmId(h.id)} 
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-500 text-slate-400 hover:text-white transition-colors"
                  title="حذف الفندق"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Hotel className="mx-auto text-slate-600" size={40} />
          <h3 className="text-slate-300 font-bold text-base">لا توجد فنادق مطابقة للبحث</h3>
          <p className="text-slate-500 text-xs">جرب تغيير كلمات البحث أو اختر جميع الوجهات.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <AlertTriangle className="text-red-400" size={20} />
                <span>تأكيد حذف الفندق</span>
              </h3>
              <button onClick={() => setDeleteConfirmId(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              هل أنت تأكد من رغبتك في حذف هذا الفندق نهائياً من منظومة لوحة التحكم؟ لا يمكن التراجع عن هذه الخطوة.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-500/20"
              >
                حذف الفندق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelsManager;
