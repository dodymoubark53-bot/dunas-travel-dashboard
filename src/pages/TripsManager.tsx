import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star, 
  Compass, 
  Calendar, 
  X, 
  Flame, 
  AlertTriangle,
  Globe,
  Languages,
  Check,
  Building,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Tag,
  Bed,
  MapPin,
  Clock,
  Sparkles,
  ListPlus,
  ArrowRightLeft
} from 'lucide-react';

const LANGUAGES_SUPPORTED = [
  { code: 'ar', label: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'es', label: 'الإسبانية (Spanish)', flag: '🇪🇸' },
  { code: 'pt', label: 'البرتغالية (Portuguese)', flag: '🇵🇹' },
  { code: 'en', label: 'الإنجليزية (English)', flag: '🇬🇧' },
  { code: 'it', label: 'الإيطالية (Italian)', flag: '🇮🇹' }
];

const TripsManager = () => {
  const { trips, packages, addTrip, updateTrip, deleteTrip, updateTripTranslation, deleteTripTranslation, t } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('all');

  // Transfer Trip Modal State
  const [transferTrip, setTransferTrip] = useState<any>(null);
  const [transferTargetDest, setTransferTargetDest] = useState('egypt');
  const [transferTargetCategory, setTransferTargetCategory] = useState('');
  const [transferSuccessBanner, setTransferSuccessBanner] = useState(false);

  const handleOpenTransferModal = (trip: any) => {
    setTransferTrip(trip);
    setTransferTargetDest(trip.destination || 'egypt');
    setTransferTargetCategory(trip.packageCategory || trip.packageId || 'Classic');
  };

  const handleConfirmTransferTrip = () => {
    if (!transferTrip) return;
    updateTrip(transferTrip.id, {
      destination: transferTargetDest,
      packageCategory: transferTargetCategory,
      packageId: transferTargetCategory
    });
    setTransferSuccessBanner(true);
    setTimeout(() => {
      setTransferSuccessBanner(false);
      setTransferTrip(null);
    }, 1200);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Translation Editor State
  const [selectedLang, setSelectedLang] = useState('ar');

  const [form, setForm] = useState<any>({
    title: '',
    subtitle: '',
    slug: '',
    destination: 'egypt',
    market: 'Global',
    language: 'en',
    type: 'Classic',
    duration: '4 Days / 3 Nights',
    departures: 'Daily',
    price: 0,
    hotelCategory: '5-Star Luxury',
    rating: 5.0,
    reviewCount: 0,
    popular: false,
    // Categorization Tags
    familyFriendly: false,
    honeymoon: false,
    adventure: false,
    luxury: true,
    cultural: true,
    // Content
    overview: '',
    highlights: [] as string[],
    included: [] as string[],
    excluded: [] as string[],
    images: [''],
    accommodation: [
      { destination: 'Cairo', nights: 3, regime: 'Bed & Breakfast' }
    ],
    hotels: '',
    itinerary: [
      { day: 1, title: 'اليوم الأول - الوصول والتسكين', description: 'الاستقبال بالفندق والاستراحة.', meals: 'العشاء' }
    ],
    translations: {
      ar: { title: '', subtitle: '', overview: '', highlights: [] as string[], included: [] as string[], excluded: [] as string[], itinerary: [] as any[] },
      es: { title: '', subtitle: '', overview: '', highlights: [] as string[], included: [] as string[], excluded: [] as string[], itinerary: [] as any[] },
      pt: { title: '', subtitle: '', overview: '', highlights: [] as string[], included: [] as string[], excluded: [] as string[], itinerary: [] as any[] },
      en: { title: '', subtitle: '', overview: '', highlights: [] as string[], included: [] as string[], excluded: [] as string[], itinerary: [] as any[] },
      it: { title: '', subtitle: '', overview: '', highlights: [] as string[], included: [] as string[], excluded: [] as string[], itinerary: [] as any[] }
    }
  });

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const targetTrip = trips.find((t: any) => t.id === editId);
      if (targetTrip) {
        handleOpenEdit(targetTrip);
      }
    }
  }, [searchParams, trips]);

  const handleOpenAdd = () => {
    setEditingTripId(null);
    setForm({
      title: '',
      subtitle: '',
      slug: '',
      destination: 'egypt',
      market: 'Global',
      language: 'en',
      type: 'Classic',
      duration: '5 Days / 4 Nights',
      departures: 'Daily',
      price: 990,
      hotelCategory: '5-Star Luxury',
      rating: 5.0,
      reviewCount: 12,
      popular: false,
      familyFriendly: true,
      honeymoon: false,
      adventure: false,
      luxury: true,
      cultural: true,
      overview: '',
      highlights: ['أهرامات الجيزة وأبو الهول', 'المتحف المصري الكبير', 'جولات النيل والأقصر'],
      included: ['الإقامة في فندق 5 نجوم مع الإفطار', 'جميع الانتقالات بأتوبيسات مكيفة حديثة', 'مرشد سياحي مرافق'],
      excluded: ['التذاكر الدولية والطيران', 'المشروبات والإكراميات الشخصية'],
      images: ['https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80'],
      accommodation: [
        { destination: 'Cairo', nights: 3, regime: 'Bed & Breakfast' }
      ],
      hotels: 'Steigenberger El Tahrir or similar',
      itinerary: [
        { day: 1, title: 'الوصول إلى القاهرة', description: 'الاستقبال في المطار والتسكين بالفندق.', meals: 'العشاء' },
        { day: 2, title: 'جولة الأهرامات والمتحف', description: 'زيارة أهرامات الجيزة وأبو الهول والمتحف المصري.', meals: 'الإفطار والغداء' }
      ],
      translations: {
        ar: { title: '', subtitle: '', overview: '', highlights: [], included: [], excluded: [], itinerary: [] },
        es: { title: '', subtitle: '', overview: '', highlights: [], included: [], excluded: [], itinerary: [] },
        pt: { title: '', subtitle: '', overview: '', highlights: [], included: [], excluded: [], itinerary: [] },
        en: { title: '', subtitle: '', overview: '', highlights: [], included: [], excluded: [], itinerary: [] },
        it: { title: '', subtitle: '', overview: '', highlights: [], included: [], excluded: [], itinerary: [] }
      }
    });
    setSelectedLang('ar');
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trip: any) => {
    setEditingTripId(trip.id);
    setForm({
      title: trip.title || '',
      subtitle: trip.subtitle || '',
      slug: trip.slug || '',
      destination: trip.destination || 'egypt',
      market: trip.market || 'Global',
      language: trip.language || 'en',
      type: trip.type || '',
      duration: trip.duration || '',
      departures: trip.departures || 'Daily',
      price: trip.price || 0,
      hotelCategory: trip.hotelCategory || '5-Star Luxury',
      rating: trip.rating || 5.0,
      reviewCount: trip.reviewCount || 0,
      popular: trip.popular || false,
      familyFriendly: trip.familyFriendly || false,
      honeymoon: trip.honeymoon || false,
      adventure: trip.adventure || false,
      luxury: trip.luxury || false,
      cultural: trip.cultural || false,
      overview: trip.overview || '',
      highlights: trip.highlights ? [...trip.highlights] : [],
      included: trip.included ? [...trip.included] : [],
      excluded: trip.excluded ? [...trip.excluded] : [],
      images: trip.images && trip.images.length > 0 ? [...trip.images] : [''],
      accommodation: trip.accommodation && trip.accommodation.length > 0 ? [...trip.accommodation] : [
        { destination: 'Cairo', nights: 3, regime: 'Bed & Breakfast' }
      ],
      hotels: typeof trip.hotels === 'string' ? trip.hotels : '',
      itinerary: trip.itinerary && trip.itinerary.length > 0 ? [...trip.itinerary] : [
        { day: 1, title: 'اليوم الأول', description: 'تفاصيل اليوم الأول', meals: 'الإفطار' }
      ],
      translations: trip.translations ? JSON.parse(JSON.stringify(trip.translations)) : {
        ar: { title: trip.title || '', overview: trip.overview || '' },
        es: {}, pt: {}, en: {}, it: {}
      }
    });
    setSelectedLang('ar');
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('يرجى أدخال عنوان الرحلة الرئيسي');

    if (editingTripId) {
      updateTrip(editingTripId, form);
    } else {
      addTrip(form);
    }

    setIsModalOpen(false);
    setSearchParams({});
  };

  const handleDelete = (id: any) => {
    deleteTrip(id);
    setDeleteConfirmId(null);
  };

  // Accommodation Row Handlers
  const handleAddAccom = () => setForm((f: any) => ({ ...f, accommodation: [...f.accommodation, { destination: '', nights: 1, regime: 'Bed & Breakfast' }] }));
  const handleUpdateAccom = (idx: number, field: string, val: any) => {
    const next = [...form.accommodation];
    next[idx] = { ...next[idx], [field]: val };
    setForm((f: any) => ({ ...f, accommodation: next }));
  };
  const handleRemoveAccom = (idx: number) => setForm((f: any) => ({ ...f, accommodation: f.accommodation.filter((_: any, i: number) => i !== idx) }));

  // Highlights / Inclusions / Images Handlers
  const handleAddHighlight = () => setForm((f: any) => ({ ...f, highlights: [...f.highlights, ''] }));
  const handleUpdateHighlight = (index: number, val: string) => {
    const next = [...form.highlights];
    next[index] = val;
    setForm((f: any) => ({ ...f, highlights: next }));
  };
  const handleRemoveHighlight = (index: number) => setForm((f: any) => ({ ...f, highlights: f.highlights.filter((_: any, i: number) => i !== index) }));

  const handleAddIncluded = () => setForm((f: any) => ({ ...f, included: [...f.included, ''] }));
  const handleUpdateIncluded = (index: number, val: string) => {
    const next = [...form.included];
    next[index] = val;
    setForm((f: any) => ({ ...f, included: next }));
  };
  const handleRemoveIncluded = (index: number) => setForm((f: any) => ({ ...f, included: f.included.filter((_: any, i: number) => i !== index) }));

  const handleAddExcluded = () => setForm((f: any) => ({ ...f, excluded: [...f.excluded, ''] }));
  const handleUpdateExcluded = (index: number, val: string) => {
    const next = [...form.excluded];
    next[index] = val;
    setForm((f: any) => ({ ...f, excluded: next }));
  };
  const handleRemoveExcluded = (index: number) => setForm((f: any) => ({ ...f, excluded: f.excluded.filter((_: any, i: number) => i !== index) }));

  const handleAddImage = () => setForm((f: any) => ({ ...f, images: [...f.images, ''] }));
  const handleUpdateImage = (index: number, val: string) => {
    const next = [...form.images];
    next[index] = val;
    setForm((f: any) => ({ ...f, images: next }));
  };
  const handleRemoveImage = (index: number) => setForm((f: any) => ({ ...f, images: f.images.filter((_: any, i: number) => i !== index) }));

  // Itinerary Handlers
  const handleAddItineraryDay = () => {
    setForm((f: any) => ({
      ...f,
      itinerary: [
        ...f.itinerary,
        { day: f.itinerary.length + 1, title: `اليوم ${f.itinerary.length + 1}`, description: '', meals: 'الإفطار' }
      ]
    }));
  };
  const handleUpdateItineraryDay = (index: number, field: string, val: any) => {
    const next = [...form.itinerary];
    next[index] = { ...next[index], [field]: val };
    setForm((f: any) => ({ ...f, itinerary: next }));
  };
  const handleRemoveItineraryDay = (index: number) => {
    setForm((f: any) => ({ ...f, itinerary: f.itinerary.filter((_: any, i: number) => i !== index) }));
  };

  // --- MULTI-LANGUAGE TRANSLATION HANDLERS (for selectedLang) ---
  const handleUpdateTranslationField = (field: string, val: any) => {
    setForm((prev: any) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [selectedLang]: {
          ...(prev.translations?.[selectedLang] || {}),
          [field]: val
        }
      }
    }));
  };

  // Language Highlights Handlers
  const handleAddTransHighlight = () => {
    const currentList = form.translations?.[selectedLang]?.highlights || [];
    handleUpdateTranslationField('highlights', [...currentList, '']);
  };
  const handleUpdateTransHighlight = (idx: number, val: string) => {
    const currentList = [...(form.translations?.[selectedLang]?.highlights || [])];
    currentList[idx] = val;
    handleUpdateTranslationField('highlights', currentList);
  };
  const handleRemoveTransHighlight = (idx: number) => {
    const currentList = (form.translations?.[selectedLang]?.highlights || []).filter((_: any, i: number) => i !== idx);
    handleUpdateTranslationField('highlights', currentList);
  };

  // Language Included Handlers
  const handleAddTransIncluded = () => {
    const currentList = form.translations?.[selectedLang]?.included || [];
    handleUpdateTranslationField('included', [...currentList, '']);
  };
  const handleUpdateTransIncluded = (idx: number, val: string) => {
    const currentList = [...(form.translations?.[selectedLang]?.included || [])];
    currentList[idx] = val;
    handleUpdateTranslationField('included', currentList);
  };
  const handleRemoveTransIncluded = (idx: number) => {
    const currentList = (form.translations?.[selectedLang]?.included || []).filter((_: any, i: number) => i !== idx);
    handleUpdateTranslationField('included', currentList);
  };

  // Language Excluded Handlers
  const handleAddTransExcluded = () => {
    const currentList = form.translations?.[selectedLang]?.excluded || [];
    handleUpdateTranslationField('excluded', [...currentList, '']);
  };
  const handleUpdateTransExcluded = (idx: number, val: string) => {
    const currentList = [...(form.translations?.[selectedLang]?.excluded || [])];
    currentList[idx] = val;
    handleUpdateTranslationField('excluded', currentList);
  };
  const handleRemoveTransExcluded = (idx: number) => {
    const currentList = (form.translations?.[selectedLang]?.excluded || []).filter((_: any, i: number) => i !== idx);
    handleUpdateTranslationField('excluded', currentList);
  };

  // Language Itinerary Handlers
  const handleAddTransItineraryDay = () => {
    const currentItin = form.translations?.[selectedLang]?.itinerary || [];
    const nextDayNum = currentItin.length + 1;
    handleUpdateTranslationField('itinerary', [
      ...currentItin,
      { day: nextDayNum, title: `Day ${nextDayNum}`, description: '', meals: '' }
    ]);
  };
  const handleUpdateTransItineraryDay = (idx: number, field: string, val: any) => {
    const currentItin = [...(form.translations?.[selectedLang]?.itinerary || [])];
    currentItin[idx] = { ...currentItin[idx], [field]: val };
    handleUpdateTranslationField('itinerary', currentItin);
  };
  const handleRemoveTransItineraryDay = (idx: number) => {
    const currentItin = (form.translations?.[selectedLang]?.itinerary || []).filter((_: any, i: number) => i !== idx);
    handleUpdateTranslationField('itinerary', currentItin);
  };

  const handleDeleteCurrentLangTranslation = () => {
    if (confirm(`هل أنت متاكد من حذف ترجمة اللغة (${selectedLang.toUpperCase()}) لهذه الرحلة؟`)) {
      setForm((prev: any) => {
        const nextTrans = { ...prev.translations };
        delete nextTrans[selectedLang];
        return { ...prev, translations: nextTrans };
      });
      if (editingTripId) {
        deleteTripTranslation(editingTripId, selectedLang);
      }
    }
  };

  const currentLangData = (form.translations as Record<string, any>)?.[selectedLang] || {};

  const filteredTrips = trips.filter((trip: any) => {
    const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (trip.destination && trip.destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (trip.id && trip.id.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDest = destinationFilter === 'all' || trip.destination?.toLowerCase() === destinationFilter.toLowerCase();
    return matchesSearch && matchesDest;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Compass className="text-amber-500" />
            <span>{t('tripsManagerTitle')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('tripsManagerSubtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus size={18} />
          <span>إضافة رحلة جديدة</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#161b22] border border-slate-800 rounded-2xl p-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="بحث باسم الرحلة أو الكود..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">الوجهة:</span>
          <select
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 w-full sm:w-auto"
          >
            <option value="all">كل الوجهات ({trips.length})</option>
            <option value="egypt">🇪🇬 مصر (Egypt)</option>
            <option value="turkey">🇹🇷 تركيا (Turkey)</option>
            <option value="jordan">🇯🇴 الأردن (Jordan)</option>
            <option value="morocco">🇲🇦 المغرب (Morocco)</option>
            <option value="greece">🇬🇷 اليونان (Greece)</option>
            <option value="dubai">🇦🇪 دبي (Dubai)</option>
            <option value="tunisia">🇹🇳 تونس (Tunisia)</option>
            <option value="holyland">🕊️ الأرض المقدسة (Holy Land)</option>
          </select>
        </div>
      </div>

      {/* Trips Table List */}
      <div className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[750px] text-right text-sm">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="py-4 px-6">{t('tourLabel')}</th>
                <th className="py-4 px-4">{t('destinationDuration')}</th>
                <th className="py-4 px-4">{t('hotelTier')}</th>
                <th className="py-4 px-4">{t('availableTranslations')}</th>
                <th className="py-4 px-4">{t('priceRating')}</th>
                <th className="py-4 px-6 text-left">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTrips.map((trip: any) => {
                const availableLangs = Object.keys(trip.translations || {});

                return (
                  <tr key={trip.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                          <img 
                            src={trip.images?.[0] || 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=200&q=80'} 
                            alt={trip.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm hover:text-amber-400 transition-colors">
                            {trip.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500 font-mono">ID: {trip.id}</span>
                            {trip.popular && <span className="text-[10px] text-red-400 font-bold">{t('mostPopular')}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 uppercase">
                          {trip.destination || 'عام'}
                        </span>
                        <p className="text-xs text-slate-400">{trip.duration || 'غير مخصص'}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-xs font-medium text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                        {trip.hotelCategory || '5-Star Luxury'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {LANGUAGES_SUPPORTED.map(l => {
                          const hasLang = availableLangs.includes(l.code);
                          return (
                            <span 
                              key={l.code}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                hasLang ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-900 text-slate-600 border-slate-800 opacity-40'
                              }`}
                            >
                              {l.flag} {l.code.toUpperCase()}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className="text-sm font-black text-amber-400">${trip.price || 0}</span>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span>{trip.rating || 5.0}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-left">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenTransferModal(trip)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-xs font-bold transition-all border border-amber-500/30 shrink-0"
                          title="نقل الرحلة إلى واجهة أو باكدج جديدة"
                        >
                          <ArrowRightLeft size={14} />
                          <span>نقل الرحلة</span>
                        </button>

                        <button
                          onClick={() => handleOpenEdit(trip)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
                        >
                          <Edit size={14} />
                          <span>تعديل</span>
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(trip.id)}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-500 text-slate-400 hover:text-white transition-colors border border-slate-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRANSFER TRIP TO ANOTHER DESTINATION / PACKAGE MODAL */}
      {transferTrip && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-lg w-full p-4 sm:p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <ArrowRightLeft size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">نقل الرحلة إلى واجهة أو باكدج جديدة</h3>
                  <p className="text-xs text-slate-400 mt-0.5">تعديل التخصيص المكانـي والبرنامج للرحلة بسهولة</p>
                </div>
              </div>
              <button onClick={() => setTransferTrip(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {/* Success Notification */}
            {transferSuccessBanner && (
              <div className="bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 animate-bounce">
                <CheckCircle size={18} />
                <span>تم نقل الرحلة بنجاح إلى الواجهة والباكدج المحددة!</span>
              </div>
            )}

            {/* Current Trip Summary Card */}
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <img
                src={transferTrip.images?.[0] || 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=200&q=80'}
                alt={transferTrip.title}
                className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-white text-xs leading-snug">{transferTrip.title}</h4>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-slate-400 font-mono">ID: {transferTrip.id}</span>
                  <span className="text-amber-400 font-semibold">• الحالية: {transferTrip.destination}</span>
                </div>
              </div>
            </div>

            {/* Transfer Options Form */}
            <div className="space-y-4 text-xs">
              {/* Select New Destination */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Globe size={14} className="text-amber-400" />
                  <span>اختر الواجهة السياحية الجديدة (New Destination) *</span>
                </label>
                <select
                  value={transferTargetDest}
                  onChange={(e) => setTransferTargetDest(e.target.value)}
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-bold focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="egypt">🇪🇬 مصر (Egypt)</option>
                  <option value="turkey">🇹🇷 تركيا (Turkey)</option>
                  <option value="jordan">🇯🇴 الأردن (Jordan)</option>
                  <option value="morocco">🇲🇦 المغرب (Morocco)</option>
                  <option value="greece">🇬🇷 اليونان (Greece)</option>
                  <option value="dubai">🇦🇪 دبي (Dubai)</option>
                  <option value="tunisia">🇹🇳 تونس (Tunisia)</option>
                  <option value="holyland">🕊️ الأرض المقدسة (Holy Land)</option>
                </select>
              </div>

              {/* Select New Package / Category */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Tag size={14} className="text-amber-400" />
                  <span>اختر الباكدج أو الفئة الجديدة (New Package / Category) *</span>
                </label>
                <select
                  value={transferTargetCategory}
                  onChange={(e) => setTransferTargetCategory(e.target.value)}
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="Classic">Classic Program (برنامج كلاسيكي)</option>
                  <option value="Honeymoon">Honeymoon Package (شهر العسل)</option>
                  <option value="Nile Cruise & Pyramids">Nile Cruise & Pyramids (رحلة نيلية وأهرامات)</option>
                  <option value="Luxury VIP">Luxury VIP Package (رحلة VIP فاخرة)</option>
                  <option value="Desert & Adventure">Desert & Adventure (مغامرة وصحراء)</option>
                  <option value="Family Holiday">Family Holiday (برنامج عائلي)</option>
                  {packages.map((pkg: any) => (
                    <option key={pkg.id} value={pkg.id}>
                      📦 {pkg.title} ({pkg.destination})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setTransferTrip(null)}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmTransferTrip}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <ArrowRightLeft size={16} />
                <span>تأكيد نقل الرحلة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle size={24} />
              <h3 className="font-bold text-lg text-white">تأكيد حذف الرحلة</h3>
            </div>
            <p className="text-sm text-slate-300">هل أنت متاكد من حذف هذه الرحلة بجميع بياناتها وترجماتها نهائياً؟</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-bold">إلغاء</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-bold">حذف نهائياً</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT TRIP MODAL WITH FULL ATTRIBUTE TABS & FULL MULTI-LANG EDITOR */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col my-auto shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingTripId ? 'تعديل جميع بيانات الرحلة وتفاصيلها والترجمات الـ 5' : 'إضافة رحلة جديدة'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  قم بتخصيص السعر، المواعيد، الفنادق، الإقامة، البرنامج اليومي، الوسوم وترجمة جميع العناصر (Title, Overview, Key Highlights, Itinerary) للغات الـ 5.
                </p>
              </div>

              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><X size={20} /></button>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="flex border-b border-slate-800 bg-[#0d1117] px-4 sm:px-6 gap-2 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setActiveTab('basic')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'basic' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400'
                }`}
              >
                1. البيانات الأساسية والتسعير
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'overview' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400'
                }`}
              >
                2. الوصف والتوزيع الفندقي
              </button>
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'itinerary' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400'
                }`}
              >
                3. البرنامج اليومي التفصيلي
              </button>
              <button
                onClick={() => setActiveTab('highlights')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'highlights' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400'
                }`}
              >
                4. المميزات والمشتملات
              </button>
              <button
                onClick={() => setActiveTab('images')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'images' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400'
                }`}
              >
                5. معرض الصور
              </button>
              <button
                onClick={() => setActiveTab('translations')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'translations' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400'
                }`}
              >
                <Languages size={15} />
                <span>6. إدارة الترجمات الـ 5 (الكل)</span>
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* TAB 1: BASIC & PRICING & TAGS */}
              {activeTab === 'basic' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان الرحلة الرئيسي (Title)</label>
                      <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" placeholder="مثال: Cairo Express & Pyramids" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">العنوان الفرعي (Subtitle)</label>
                      <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" placeholder="مثال: Explore the timeless Pyramids" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">الرابط الفرعي (Slug)</label>
                      <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs" placeholder="cairo-express-4d" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">الوجهة (Destination)</label>
                      <select value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white">
                        <option value="egypt">🇪🇬 مصر (Egypt)</option>
                        <option value="turkey">🇹🇷 تركيا (Turkey)</option>
                        <option value="jordan">🇯🇴 الأردن (Jordan)</option>
                        <option value="morocco">🇲🇦 المغرب (Morocco)</option>
                        <option value="greece">🇬🇷 اليونان (Greece)</option>
                        <option value="dubai">🇦🇪 دبي (Dubai)</option>
                        <option value="tunisia">🇹🇳 تونس (Tunisia)</option>
                        <option value="holyland">🕊️ الأرض المقدسة (Holy Land)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">السوق المستهدف (Market)</label>
                      <select value={form.market} onChange={(e) => setForm({ ...form, market: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white">
                        <option value="Global">Global (عالمي)</option>
                        <option value="Brasil">Brasil (البرازيل)</option>
                        <option value="España">España (إسبانيا)</option>
                        <option value="Portugal">Portugal (البرتغال)</option>
                        <option value="Italy">Italy (إيطاليا)</option>
                        <option value="Middle East">Middle East (الشرق الأوسط)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">السعر ($)</label>
                      <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">مدة الرحلة (Duration)</label>
                      <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="4 Days / 3 Nights" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">مواعيد المغادرة (Departures)</label>
                      <input type="text" value={form.departures} onChange={(e) => setForm({ ...form, departures: e.target.value })} placeholder="Daily / Diário" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">فئة الفنادق (Hotel Category)</label>
                      <input type="text" value={form.hotelCategory} onChange={(e) => setForm({ ...form, hotelCategory: e.target.value })} placeholder="5-Star Luxury" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">التقييم (Rating 1 - 5)</label>
                      <input type="number" step="0.1" max="5" min="1" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 5.0 })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">عدد المراجعات (Review Count)</label>
                      <input type="number" value={form.reviewCount} onChange={(e) => setForm({ ...form, reviewCount: parseInt(e.target.value) || 0 })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                    </div>

                    <div className="flex items-center pt-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} className="w-5 h-5 accent-amber-500 rounded" />
                        <span className="text-xs font-bold text-amber-400">رحلة الأكثر إقبالاً 🔥 (Popular Trip)</span>
                      </label>
                    </div>
                  </div>

                  {/* Categorization Checkboxes */}
                  <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 space-y-2">
                    <span className="text-xs font-bold text-slate-300 block">تصنيفات الرحلة وميزاتها الفنية (Category Tags):</span>
                    <div className="flex items-center gap-6 flex-wrap">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-semibold">
                        <input type="checkbox" checked={form.familyFriendly} onChange={e => setForm({ ...form, familyFriendly: e.target.checked })} className="accent-amber-500" />
                        <span>👨‍👩‍👧‍👦 عائلية (Family Friendly)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-semibold">
                        <input type="checkbox" checked={form.honeymoon} onChange={e => setForm({ ...form, honeymoon: e.target.checked })} className="accent-amber-500" />
                        <span>💍 شهر عسل (Honeymoon)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-semibold">
                        <input type="checkbox" checked={form.luxury} onChange={e => setForm({ ...form, luxury: e.target.checked })} className="accent-amber-500" />
                        <span>⭐ فاخرة VIP (Luxury)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-semibold">
                        <input type="checkbox" checked={form.cultural} onChange={e => setForm({ ...form, cultural: e.target.checked })} className="accent-amber-500" />
                        <span>🏛️ ثقافية وتاريخية (Cultural)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-semibold">
                        <input type="checkbox" checked={form.adventure} onChange={e => setForm({ ...form, adventure: e.target.checked })} className="accent-amber-500" />
                        <span>🐪 مغامرات وصحراء (Adventure)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: OVERVIEW & ACCOMMODATION BREAKDOWN */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">الوصف التفصيلي للرحلة (Overview)</label>
                    <textarea rows={4} value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} placeholder="وصف كامل وجذاب للرحلة..." className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-3 text-white" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <Bed size={16} className="text-amber-400" />
                        <span>توزيع الليالي والإقامة بالفنادق (Accommodation Breakdown)</span>
                      </h4>
                      <button type="button" onClick={handleAddAccom} className="text-xs text-amber-400 font-bold hover:underline">+ إضافة مدينة/فندق</button>
                    </div>

                    <div className="space-y-3">
                      {form.accommodation.map((acc: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 bg-[#0d1117] border border-slate-800 rounded-xl p-3">
                          <input type="text" placeholder="المدينة (مثل: Cairo)" value={acc.destination || ''} onChange={e => handleUpdateAccom(index, 'destination', e.target.value)} className="flex-1 bg-[#161b22] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                          <input type="number" min="1" placeholder="عدد الليالي" value={acc.nights || 1} onChange={e => handleUpdateAccom(index, 'nights', parseInt(e.target.value) || 1)} className="w-24 bg-[#161b22] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                          <input type="text" placeholder="نظام الوجبات (Bed & Breakfast)" value={acc.regime || ''} onChange={e => handleUpdateAccom(index, 'regime', e.target.value)} className="flex-1 bg-[#161b22] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                          <button type="button" onClick={() => handleRemoveAccom(index)} className="text-red-400 hover:text-white"><X size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">أسماء الفنادق المعتمدة والملاحظات (Hotels Notes)</label>
                    <input type="text" value={form.hotels} onChange={(e) => setForm({ ...form, hotels: e.target.value })} placeholder="مثال: Steigenberger El Tahrir or Sofitel Winter Palace" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                  </div>
                </div>
              )}

              {/* TAB 3: ITINERARY */}
              {activeTab === 'itinerary' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">برنامج اليوم بيوم للرحلة</h4>
                    <button type="button" onClick={handleAddItineraryDay} className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">+ إضافة يوم جديد</button>
                  </div>

                  <div className="space-y-4">
                    {form.itinerary.map((item: any, index: number) => (
                      <div key={index} className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">اليوم {index + 1}</span>
                          <button type="button" onClick={() => handleRemoveItineraryDay(index)} className="text-xs text-red-400 font-bold">حذف اليوم</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input type="text" placeholder="عنوان اليوم" value={item.title || ''} onChange={(e) => handleUpdateItineraryDay(index, 'title', e.target.value)} className="sm:col-span-2 bg-[#161b22] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                          <input type="text" placeholder="الوجبة المشمولة" value={item.meals || ''} onChange={(e) => handleUpdateItineraryDay(index, 'meals', e.target.value)} className="bg-[#161b22] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                        </div>

                        <textarea rows={2} placeholder="تفاصيل الأنشطة..." value={item.description || ''} onChange={(e) => handleUpdateItineraryDay(index, 'description', e.target.value)} className="w-full bg-[#161b22] border border-slate-800 rounded-xl p-3 text-white" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: HIGHLIGHTS & INCLUSIONS */}
              {activeTab === 'highlights' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">أبرز المميزات المعالم (Key Highlights)</h4>
                      <button type="button" onClick={handleAddHighlight} className="text-xs text-amber-400 font-bold hover:underline">+ إضافة ميزة</button>
                    </div>

                    <div className="space-y-2">
                      {form.highlights.map((hl: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <input type="text" value={hl} onChange={(e) => handleUpdateHighlight(index, e.target.value)} className="flex-1 bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                          <button type="button" onClick={() => handleRemoveHighlight(index)} className="text-red-400 p-2"><X size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-emerald-400 text-sm">المشتملات (Included)</h4>
                        <button type="button" onClick={handleAddIncluded} className="text-xs text-amber-400 font-bold hover:underline">+ إضافة</button>
                      </div>
                      <div className="space-y-2">
                        {form.included.map((inc: any, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <input type="text" value={inc} onChange={(e) => handleUpdateIncluded(index, e.target.value)} className="flex-1 bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white text-xs" />
                            <button type="button" onClick={() => handleRemoveIncluded(index)} className="text-red-400"><X size={16} /></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-rose-400 text-sm">غير المشمول (Excluded)</h4>
                        <button type="button" onClick={handleAddExcluded} className="text-xs text-amber-400 font-bold hover:underline">+ إضافة</button>
                      </div>
                      <div className="space-y-2">
                        {form.excluded.map((exc: any, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <input type="text" value={exc} onChange={(e) => handleUpdateExcluded(index, e.target.value)} className="flex-1 bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white text-xs" />
                            <button type="button" onClick={() => handleRemoveExcluded(index)} className="text-red-400"><X size={16} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: GALLERY IMAGES */}
              {activeTab === 'images' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">روابط ومعرض صور الرحلة (Gallery)</h4>
                    <button type="button" onClick={handleAddImage} className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">+ إضافة رابط صورة</button>
                  </div>

                  <div className="space-y-3">
                    {form.images.map((imgUrl: any, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                          {imgUrl ? <img src={imgUrl} alt={`preview-${index}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">لا يوجد</div>}
                        </div>
                        <input type="text" value={imgUrl} onChange={(e) => handleUpdateImage(index, e.target.value)} placeholder="https://images.unsplash.com/..." className="flex-1 bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs" />
                        <button type="button" onClick={() => handleRemoveImage(index)} className="text-red-400 p-2"><X size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: COMPLETE 5-LANGUAGE TRANSLATIONS EDITOR (Title, Subtitle, Overview, Key Highlights, Itinerary, Inclusions) */}
              {activeTab === 'translations' && (
                <div className="space-y-6">
                  {/* Language Selector Bar */}
                  <div className="flex items-center justify-between bg-[#0d1117] border border-slate-800 rounded-2xl p-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">اختر اللغة لإدارة ترجماتها بالكامل:</span>
                      <div className="flex items-center gap-1.5">
                        {LANGUAGES_SUPPORTED.map(lang => {
                          const isSel = selectedLang === lang.code;
                          const hasTrans = !!form.translations?.[lang.code]?.title;

                          return (
                            <button
                              key={lang.code}
                              type="button"
                              onClick={() => setSelectedLang(lang.code)}
                              className={`
                                flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border
                                ${isSel 
                                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-[1.03]' 
                                  : hasTrans 
                                    ? 'bg-slate-800 text-amber-400 border-slate-700' 
                                    : 'bg-slate-900 text-slate-500 border-slate-800'
                                }
                              `}
                            >
                              <span>{lang.flag}</span>
                              <span>{lang.code.toUpperCase()}</span>
                              {hasTrans && <Check size={12} className="text-amber-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDeleteCurrentLangTranslation}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-xs font-bold border border-red-500/20 transition-all"
                    >
                      <Trash2 size={13} />
                      <span>حذف ترجمة ({selectedLang.toUpperCase()}) تماماً</span>
                    </button>
                  </div>

                  {/* Complete Translation Sub-Editors for selectedLang */}
                  <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                        <span>إدارة وترجمة محتوى الرحلة بالكامل لـ:</span>
                        <span className="text-white font-black text-base">{LANGUAGES_SUPPORTED.find(l => l.code === selectedLang)?.label}</span>
                      </h4>
                    </div>

                    {/* 1. Title & Subtitle Translation */}
                    <div className="space-y-3">
                      <h5 className="font-bold text-xs text-slate-300 uppercase tracking-wider">1. العنوان والعنوان الفرعي (Title & Subtitle)</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">عنوان الرحلة بـ ({selectedLang.toUpperCase()})</label>
                          <input type="text" placeholder={`العنوان بـ ${selectedLang}`} value={currentLangData.title || ''} onChange={(e) => handleUpdateTranslationField('title', e.target.value)} className="w-full bg-[#161b22] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">العنوان الفرعي بـ ({selectedLang.toUpperCase()})</label>
                          <input type="text" placeholder={`العنوان الفرعي بـ ${selectedLang}`} value={currentLangData.subtitle || ''} onChange={(e) => handleUpdateTranslationField('subtitle', e.target.value)} className="w-full bg-[#161b22] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* 2. Overview Translation */}
                    <div className="space-y-3 pt-4 border-t border-slate-800/80">
                      <h5 className="font-bold text-xs text-slate-300 uppercase tracking-wider">2. الوصف الكامل (Overview)</h5>
                      <textarea rows={3} placeholder={`الوصف التفصيلي بـ ${selectedLang}`} value={currentLangData.overview || ''} onChange={(e) => handleUpdateTranslationField('overview', e.target.value)} className="w-full bg-[#161b22] border border-slate-800 rounded-xl p-3 text-white" />
                    </div>

                    {/* 3. Key Highlights Translation Editor */}
                    <div className="space-y-3 pt-4 border-t border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles size={14} />
                          <span>3. أبرز المميزات والمعالم بـ ({selectedLang.toUpperCase()}) - Key Highlights</span>
                        </h5>
                        <button type="button" onClick={handleAddTransHighlight} className="text-xs text-amber-400 font-bold hover:underline">+ إضافة ميزة بـ ({selectedLang.toUpperCase()})</button>
                      </div>

                      <div className="space-y-2">
                        {(currentLangData.highlights || []).map((hlItem: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder={`الميزة ${idx + 1} بـ ${selectedLang}`}
                              value={hlItem || ''}
                              onChange={(e) => handleUpdateTransHighlight(idx, e.target.value)}
                              className="flex-1 bg-[#161b22] border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                            />
                            <button type="button" onClick={() => handleRemoveTransHighlight(idx)} className="text-red-400 p-1.5 hover:text-white"><X size={16} /></button>
                          </div>
                        ))}

                        {(!currentLangData.highlights || currentLangData.highlights.length === 0) && (
                          <p className="text-xs text-slate-500 italic">لا توجد مميزات مضافة بعد بهذه اللغة. اضغط على "+ إضافة ميزة" بالعلوي.</p>
                        )}
                      </div>
                    </div>

                    {/* 4. Day-by-Day Itinerary Translation Editor */}
                    <div className="space-y-3 pt-4 border-t border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-xs text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>4. البرنامج اليومي التفصيلي بـ ({selectedLang.toUpperCase()}) - Day-by-Day Itinerary</span>
                        </h5>
                        <button type="button" onClick={handleAddTransItineraryDay} className="text-xs text-blue-400 font-bold hover:underline">+ إضافة يوم بـ ({selectedLang.toUpperCase()})</button>
                      </div>

                      <div className="space-y-3">
                        {(currentLangData.itinerary || []).map((itinDay: any, idx: number) => (
                          <div key={idx} className="bg-[#161b22] border border-slate-800 rounded-2xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-blue-400">Day {idx + 1} ({selectedLang.toUpperCase()})</span>
                              <button type="button" onClick={() => handleRemoveTransItineraryDay(idx)} className="text-xs text-red-400 font-bold">حذف اليوم</button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input type="text" placeholder={`عنوان اليوم بـ ${selectedLang}`} value={itinDay.title || ''} onChange={(e) => handleUpdateTransItineraryDay(idx, 'title', e.target.value)} className="sm:col-span-2 bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white" />
                              <input type="text" placeholder={`الوجبة بـ ${selectedLang}`} value={itinDay.meals || ''} onChange={(e) => handleUpdateTransItineraryDay(idx, 'meals', e.target.value)} className="bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white" />
                            </div>

                            <textarea rows={2} placeholder={`وصف أنشطة اليوم بـ ${selectedLang}...`} value={itinDay.description || ''} onChange={(e) => handleUpdateTransItineraryDay(idx, 'description', e.target.value)} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
                          </div>
                        ))}

                        {(!currentLangData.itinerary || currentLangData.itinerary.length === 0) && (
                          <p className="text-xs text-slate-500 italic">لا توجد أيام مضافة لهذا البرنامج بهذه اللغة. اضغط على "+ إضافة يوم".</p>
                        )}
                      </div>
                    </div>

                    {/* 5. Included & Excluded Translation Editor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs text-emerald-400">المشتملات بـ ({selectedLang.toUpperCase()})</h5>
                          <button type="button" onClick={handleAddTransIncluded} className="text-xs text-amber-400 font-bold hover:underline">+ إضافة</button>
                        </div>
                        <div className="space-y-1.5">
                          {(currentLangData.included || []).map((inc: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input type="text" value={inc || ''} onChange={(e) => handleUpdateTransIncluded(idx, e.target.value)} className="flex-1 bg-[#161b22] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white" />
                              <button type="button" onClick={() => handleRemoveTransIncluded(idx)} className="text-red-400 p-1"><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs text-rose-400">غير المشمول بـ ({selectedLang.toUpperCase()})</h5>
                          <button type="button" onClick={handleAddTransExcluded} className="text-xs text-amber-400 font-bold hover:underline">+ إضافة</button>
                        </div>
                        <div className="space-y-1.5">
                          {(currentLangData.excluded || []).map((exc: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input type="text" value={exc || ''} onChange={(e) => handleUpdateTransExcluded(idx, e.target.value)} className="flex-1 bg-[#161b22] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white" />
                              <button type="button" onClick={() => handleRemoveTransExcluded(idx)} className="text-red-400 p-1"><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">تأكد من حفظ التعديلات بعد مراجعة كافة التبويبات والترجمات.</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">إلغاء</button>
                  <button type="submit" className="px-6 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20">حفظ كافة التعديلات والترجمات</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripsManager;
