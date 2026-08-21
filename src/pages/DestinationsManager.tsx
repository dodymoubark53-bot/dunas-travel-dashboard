import React, { useState } from 'react';
import { useData, DESTINATIONS_LIST } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Compass, 
  Package, 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  Flame, 
  ChevronRight,
  Layers
} from 'lucide-react';

const DestinationsManager = () => {
  const { trips, packages, deleteTrip, deletePackage, t } = useData();
  const [activeDestId, setActiveDestId] = useState('egypt');

  const activeDestObj = DESTINATIONS_LIST.find(d => d.id === activeDestId) || DESTINATIONS_LIST[0];

  // Trips assigned to active destination
  const destTrips = trips.filter((t: any) => t.destination?.toLowerCase() === activeDestId);

  // Packages assigned to active destination (specifically for Egypt's 5 packages)
  const destPackages = packages.filter((p: any) => p.destination?.toLowerCase() === activeDestId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Globe className="text-amber-400" />
            <span>{t('destinationsManagerTitle')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            استعرض ورحلات كل واجهة سياحية بشكل منفصل مع إدارة باكدجز مصر الـ 5 المخصصة.
          </p>
        </div>

        <Link
          to="/trips"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus size={18} />
          <span>{t('addTrip')}</span>
        </Link>
      </div>

      {/* 8 Destinations Tab Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {DESTINATIONS_LIST.map((dest: any) => {
          const isActive = activeDestId === dest.id;
          const count = trips.filter((t: any) => t.destination?.toLowerCase() === dest.id).length;

          return (
            <button
              key={dest.id}
              onClick={() => setActiveDestId(dest.id)}
              className={`
                flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-200 text-center space-y-1.5
                ${isActive 
                  ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/10 border-amber-500 text-white shadow-lg shadow-amber-500/10 font-bold scale-[1.02]' 
                  : 'bg-[#161b22] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }
              `}
            >
              <span className="text-2xl">{dest.flag}</span>
              <span className="text-xs font-bold">{dest.nameAr}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-amber-400 border border-slate-800">
                {count} {t('toursCountLabel')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Destination Header Banner */}
      <div className={`p-6 rounded-3xl border border-slate-800 bg-gradient-to-r ${activeDestObj.color} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <span className="text-4xl">{activeDestObj.flag}</span>
          <div>
            <h2 className="text-2xl font-black text-white">
              {t('destination')}: {activeDestObj.nameAr} ({activeDestObj.nameEn})
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {t('availableToursForDest')} {destTrips.length} {t('toursCountLabel')}.
            </p>
          </div>
        </div>

        {activeDestId === 'egypt' && (
          <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-3.5 py-1.5 rounded-full border border-amber-500/30">
            {t('egyptInterfaceSubtitle')}
          </span>
        )}
      </div>

      {/* Trips Section for Selected Destination */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Compass size={20} className="text-amber-400" />
            <span>{t('trips')} - {activeDestObj.nameAr}</span>
          </h3>

          <span className="text-xs text-slate-400">{t('all')}: {destTrips.length} {t('toursCountLabel')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destTrips.map((trip: any) => (
            <div 
              key={trip.id} 
              className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-48 bg-slate-800 relative">
                  <img 
                    src={trip.images?.[0] || 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80'} 
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                  {trip.popular && (
                    <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-red-500/90 text-white shadow-lg">
                      🔥 إقبال عالي
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">{trip.duration || 'غير مخصص'}</span>
                    <span className="text-lg font-black text-amber-400">${trip.price || 0}</span>
                  </div>

                  <h4 className="font-bold text-white text-base leading-snug">{trip.title}</h4>
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Star size={13} className="fill-amber-400" />
                    <span>{trip.rating || 5.0} ({trip.reviewCount || 0} تقييم)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/40">
                <span className="text-xs text-slate-500 font-mono">{trip.id}</span>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/trips?edit=${trip.id}`}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-amber-500/20"
                    title="تعديل الرحلة والترجمات"
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => deleteTrip(trip.id)}
                    className="p-2 rounded-xl bg-slate-800 text-red-400 hover:text-white hover:bg-red-500"
                    title="حذف الرحلة"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {destTrips.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-[#161b22] border border-slate-800 rounded-3xl">
              لا توجد رحلات مضافة لهذه الواجهة حالياً. يمكنك إضافة رحلة جديدة.
            </div>
          )}
        </div>
      </div>

      {/* SPECIAL EGYPT PACKAGES SECTION (تظهر بعد رحلات مصر مباشر) */}
      {activeDestId === 'egypt' && (
        <div className="space-y-4 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
            <div>
              <h3 className="font-extrabold text-amber-400 text-lg flex items-center gap-2">
                <Package size={22} />
                <span>{t('egypt5PackagesTitle')}</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {t('egypt5PackagesSubtitle')}
              </p>
            </div>

            <Link
              to="/packages"
              className="text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-xl shrink-0"
            >
              إدارة الباكدجز بالكامل ←
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destPackages.map((pkg: any) => (
              <div 
                key={pkg.id} 
                className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 bg-slate-800 relative">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-amber-400 border border-amber-500/30">
                      {pkg.category?.toUpperCase() || 'PROGRAM'}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-400">{pkg.duration}</span>
                      <span className="text-base font-black text-amber-400">${pkg.price}</span>
                    </div>

                    <h4 className="font-bold text-white text-base leading-snug">{pkg.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{pkg.description}</p>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/40">
                  <span className="text-xs text-slate-500 font-mono">{pkg.id}</span>
                  <div className="flex items-center gap-2">
                    <Link to="/packages" className="p-2 rounded-xl bg-slate-800 text-amber-400 hover:bg-amber-500/20">
                      <Edit size={16} />
                    </Link>
                    <button onClick={() => deletePackage(pkg.id)} className="p-2 rounded-xl bg-slate-800 text-red-400 hover:text-white">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationsManager;
