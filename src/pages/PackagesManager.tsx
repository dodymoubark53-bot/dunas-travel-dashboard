import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Star, 
  Calendar, 
  Languages, 
  Check, 
  AlertTriangle, 
  Sparkles,
  Bed,
  CheckCircle,
  XCircle,
  Tag
} from 'lucide-react';

const LANGUAGES_SUPPORTED = [
  { code: 'ar', label: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'es', label: 'الإسبانية (Spanish)', flag: '🇪🇸' },
  { code: 'pt', label: 'البرتغالية (Portuguese)', flag: '🇵🇹' },
  { code: 'en', label: 'الإنجليزية (English)', flag: '🇬🇧' },
  { code: 'it', label: 'الإيطالية (Italian)', flag: '🇮🇹' }
];

const PackagesManager = () => {
  const { packages, addPackage, updatePackage, deletePackage, t } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Translation Editor State
  const [selectedLang, setSelectedLang] = useState('ar');

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    slug: '',
    destination: 'egypt',
    category: 'classic',
    duration: '8 Days / 7 Nights',
    price: 1250,
    rating: 4.9,
    reviewCount: 15,
    popular: true,
    // Tags
    familyFriendly: false,
    honeymoon: false,
    adventure: false,
    luxury: true,
    cultural: true,
    // Content
    description: '',
    overview: '',
    highlights: [],
    included: [],
    excluded: [],
    image: '',
    images: [''],
    accommodation: [
      { destination: 'Cairo', nights: 4, regime: 'Bed & Breakfast' },
      { destination: 'Nile Cruise', nights: 3, regime: 'Full Board' }
    ],
    hotels: '',
    itinerary: [
      { day: 1, title: 'اليوم الأول - الوصول والتسكين', description: 'الاستقبال بالفندق والاستراحة.', meals: 'العشاء' }
    ],
    translations: {
      ar: { title: '', subtitle: '', description: '', overview: '', highlights: [], included: [], excluded: [], itinerary: [] },
      es: { title: '', subtitle: '', description: '', overview: '', highlights: [], included: [], excluded: [], itinerary: [] },
      pt: { title: '', subtitle: '', description: '', overview: '', highlights: [], included: [], excluded: [], itinerary: [] },
      en: { title: '', subtitle: '', description: '', overview: '', highlights: [], included: [], excluded: [], itinerary: [] },
      it: { title: '', subtitle: '', description: '', overview: '', highlights: [], included: [], excluded: [], itinerary: [] }
    }
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      title: '',
      subtitle: '',
      slug: '',
      destination: 'egypt',
      category: 'classic',
      duration: '8 Days / 7 Nights',
      price: 1250,
      rating: 4.9,
      reviewCount: 10,
      popular: true,
      familyFriendly: true,
      honeymoon: false,
      adventure: false,
      luxury: true,
      cultural: true,
      description: '',
      overview: '',
      highlights: ['براميدز الجيزة والأهرامات الثلاثة', 'المتحف المصري الكبير', 'كروز النيل بين الأقصر وأسوان'],
      included: ['الإقامة في فنادق 5 نجوم وكروز النيل', 'جميع الجولات السياحية والانتقالات المكيفة'],
      excluded: ['التذاكر الدولية والطيران', 'المشروبات والإكراميات الشخصية'],
      image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80'],
      accommodation: [
        { destination: 'Cairo', nights: 4, regime: 'Bed & Breakfast' }
      ],
      hotels: 'Steigenberger El Tahrir & Nile Cruise 5-Star',
      itinerary: [
        { day: 1, title: 'الوصول للقاهرة', description: 'الاستقبال في المطار والتسكين بالفندق.', meals: 'العشاء' },
        { day: 2, title: 'جولة الأهرامات والمتحف', description: 'زيارة أهرامات الجيزة والمتحف المصري الكبير.', meals: 'الإفطار والغداء' }
      ],
      translations: {
        ar: { title: '', subtitle: '', description: '', overview: '', highlights: [], included: [], excluded: [], itinerary: [] },
        es: { title: '', subtitle: '', description: '', overview: '', highlights: [], included: [], excluded: [], itinerary: [] },
        pt: { title: '', subtitle: '', description: '', overview: '', highlights: [], included: [], excluded: [], itinerary: [] },
        en: { title: '', subtitle: '', description: '', overview: '', highlights: [], included: [], excluded: [], itinerary: [] },
        it: { title: '', subtitle: '', description: '', overview: '', highlights: [], included: [], excluded: [], itinerary: [] }
      }
    });
    setSelectedLang('ar');
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingId(pkg.id);
    setForm({
      title: pkg.title || '',
      subtitle: pkg.subtitle || '',
      slug: pkg.slug || '',
      destination: pkg.destination || 'egypt',
      category: pkg.category || 'classic',
      duration: pkg.duration || '',
      price: pkg.price || 0,
      rating: pkg.rating || 4.9,
      reviewCount: pkg.reviewCount || 10,
      popular: pkg.popular || false,
      familyFriendly: pkg.familyFriendly || false,
      honeymoon: pkg.honeymoon || false,
      adventure: pkg.adventure || false,
      luxury: pkg.luxury || false,
      cultural: pkg.cultural || false,
      description: pkg.description || '',
      overview: pkg.overview || pkg.description || '',
      highlights: pkg.highlights ? [...pkg.highlights] : [],
      included: pkg.included ? [...pkg.included] : [],
      excluded: pkg.excluded ? [...pkg.excluded] : [],
      image: pkg.image || (pkg.images?.[0] || ''),
      images: pkg.images && pkg.images.length > 0 ? [...pkg.images] : [pkg.image || ''],
      accommodation: pkg.accommodation && pkg.accommodation.length > 0 ? [...pkg.accommodation] : [
        { destination: 'Cairo', nights: 3, regime: 'Bed & Breakfast' }
      ],
      hotels: typeof pkg.hotels === 'string' ? pkg.hotels : '',
      itinerary: pkg.itinerary && pkg.itinerary.length > 0 ? [...pkg.itinerary] : [
        { day: 1, title: 'اليوم الأول', description: 'تفاصيل اليوم', meals: 'الإفطار' }
      ],
      translations: pkg.translations ? JSON.parse(JSON.stringify(pkg.translations)) : {
        ar: { title: pkg.title || '', description: pkg.description || '' },
        es: {}, pt: {}, en: {}, it: {}
      }
    });
    setSelectedLang('ar');
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) return alert('يرجى أدخال اسم الباكدج الرئيسي');

    const updatedPackageObj = {
      ...form,
      image: form.images?.[0] || form.image || 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80'
    };

    if (editingId) {
      updatePackage(editingId, updatedPackageObj);
    } else {
      addPackage(updatedPackageObj);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    deletePackage(id);
    setDeleteConfirmId(null);
  };

  // Accommodation Row Handlers
  const handleAddAccom = () => setForm(f => ({ ...f, accommodation: [...f.accommodation, { destination: '', nights: 1, regime: 'Bed & Breakfast' }] }));
  const handleUpdateAccom = (idx, field, val) => {
    const next = [...form.accommodation];
    next[idx] = { ...next[idx], [field]: val };
    setForm(f => ({ ...f, accommodation: next }));
  };
  const handleRemoveAccom = (idx) => setForm(f => ({ ...f, accommodation: f.accommodation.filter((_, i) => i !== idx) }));

  // Highlights / Inclusions / Images Handlers
  const handleAddHighlight = () => setForm(f => ({ ...f, highlights: [...f.highlights, ''] }));
  const handleUpdateHighlight = (index, val) => {
    const next = [...form.highlights];
    next[index] = val;
    setForm(f => ({ ...f, highlights: next }));
  };
  const handleRemoveHighlight = (index) => setForm(f => ({ ...f, highlights: f.highlights.filter((_, i) => i !== index) }));

  const handleAddIncluded = () => setForm(f => ({ ...f, included: [...f.included, ''] }));
  const handleUpdateIncluded = (index, val) => {
    const next = [...form.included];
    next[index] = val;
    setForm(f => ({ ...f, included: next }));
  };
  const handleRemoveIncluded = (index) => setForm(f => ({ ...f, included: f.included.filter((_, i) => i !== index) }));

  const handleAddExcluded = () => setForm(f => ({ ...f, excluded: [...f.excluded, ''] }));
  const handleUpdateExcluded = (index, val) => {
    const next = [...form.excluded];
    next[index] = val;
    setForm(f => ({ ...f, excluded: next }));
  };
  const handleRemoveExcluded = (index) => setForm(f => ({ ...f, excluded: f.excluded.filter((_, i) => i !== index) }));

  const handleAddImage = () => setForm(f => ({ ...f, images: [...f.images, ''] }));
  const handleUpdateImage = (index, val) => {
    const next = [...form.images];
    next[index] = val;
    setForm(f => ({ ...f, images: next }));
  };
  const handleRemoveImage = (index) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== index) }));

  // Itinerary Handlers
  const handleAddItineraryDay = () => {
    setForm(f => ({
      ...f,
      itinerary: [
        ...f.itinerary,
        { day: f.itinerary.length + 1, title: `اليوم ${f.itinerary.length + 1}`, description: '', meals: 'الإفطار' }
      ]
    }));
  };
  const handleUpdateItineraryDay = (index, field, val) => {
    const next = [...form.itinerary];
    next[index] = { ...next[index], [field]: val };
    setForm(f => ({ ...f, itinerary: next }));
  };
  const handleRemoveItineraryDay = (index) => {
    setForm(f => ({ ...f, itinerary: f.itinerary.filter((_, i) => i !== index) }));
  };

  // --- MULTI-LANGUAGE TRANSLATION HANDLERS (for selectedLang) ---
  const handleUpdateTranslationField = (field, val) => {
    setForm(prev => ({
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

  const handleAddTransHighlight = () => {
    const currentList = form.translations?.[selectedLang]?.highlights || [];
    handleUpdateTranslationField('highlights', [...currentList, '']);
  };
  const handleUpdateTransHighlight = (idx, val) => {
    const currentList = [...(form.translations?.[selectedLang]?.highlights || [])];
    currentList[idx] = val;
    handleUpdateTranslationField('highlights', currentList);
  };
  const handleRemoveTransHighlight = (idx) => {
    const currentList = (form.translations?.[selectedLang]?.highlights || []).filter((_, i) => i !== idx);
    handleUpdateTranslationField('highlights', currentList);
  };

  const handleAddTransIncluded = () => {
    const currentList = form.translations?.[selectedLang]?.included || [];
    handleUpdateTranslationField('included', [...currentList, '']);
  };
  const handleUpdateTransIncluded = (idx, val) => {
    const currentList = [...(form.translations?.[selectedLang]?.included || [])];
    currentList[idx] = val;
    handleUpdateTranslationField('included', currentList);
  };
  const handleRemoveTransIncluded = (idx) => {
    const currentList = (form.translations?.[selectedLang]?.included || []).filter((_, i) => i !== idx);
    handleUpdateTranslationField('included', currentList);
  };

  const handleAddTransExcluded = () => {
    const currentList = form.translations?.[selectedLang]?.excluded || [];
    handleUpdateTranslationField('excluded', [...currentList, '']);
  };
  const handleUpdateTransExcluded = (idx, val) => {
    const currentList = [...(form.translations?.[selectedLang]?.excluded || [])];
    currentList[idx] = val;
    handleUpdateTranslationField('excluded', currentList);
  };
  const handleRemoveTransExcluded = (idx) => {
    const currentList = (form.translations?.[selectedLang]?.excluded || []).filter((_, i) => i !== idx);
    handleUpdateTranslationField('excluded', currentList);
  };

  const handleAddTransItineraryDay = () => {
    const currentItin = form.translations?.[selectedLang]?.itinerary || [];
    const nextDayNum = currentItin.length + 1;
    handleUpdateTranslationField('itinerary', [
      ...currentItin,
      { day: nextDayNum, title: `Day ${nextDayNum}`, description: '', meals: '' }
    ]);
  };
  const handleUpdateTransItineraryDay = (idx, field, val) => {
    const currentItin = [...(form.translations?.[selectedLang]?.itinerary || [])];
    currentItin[idx] = { ...currentItin[idx], [field]: val };
    handleUpdateTranslationField('itinerary', currentItin);
  };
  const handleRemoveTransItineraryDay = (idx) => {
    const currentItin = (form.translations?.[selectedLang]?.itinerary || []).filter((_, i) => i !== idx);
    handleUpdateTranslationField('itinerary', currentItin);
  };

  const handleDeleteCurrentLangTranslation = () => {
    if (confirm(`هل أنت متاكد من حذف ترجمة اللغة (${selectedLang.toUpperCase()}) لهذا الباكدج؟`)) {
      setForm(prev => {
        const nextTrans = { ...prev.translations };
        delete nextTrans[selectedLang];
        return { ...prev, translations: nextTrans };
      });
    }
  };

  const currentLangData = form.translations?.[selectedLang] || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Package className="text-blue-400" />
            <span>{t('packagesManagerTitle')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('packagesManagerSubtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-blue-500/20 shrink-0"
        >
          <Plus size={18} />
          <span>{t('addPackage')}</span>
        </button>
      </div>

      {/* Packages Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const availableLangs = Object.keys(pkg.translations || {});

          return (
            <div 
              key={pkg.id} 
              className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-48 bg-slate-800 relative">
                  <img 
                    src={pkg.image || pkg.images?.[0] || 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80'} 
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-amber-400 border border-amber-500/30 uppercase">
                    {pkg.destination || 'MULTI'}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-400">{pkg.duration}</span>
                    <span className="text-lg font-black text-amber-400">${pkg.price}</span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug">{pkg.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{pkg.description || pkg.overview}</p>

                  {/* Available Languages */}
                  <div className="flex items-center gap-1 flex-wrap pt-1">
                    {LANGUAGES_SUPPORTED.map(l => (
                      <span key={l.code} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${availableLangs.includes(l.code) ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
                        {l.flag} {l.code.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/40">
                <span className="text-xs text-slate-400 font-mono">{pkg.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(pkg)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-500/20"
                    title="تعديل التفاصيل والترجمات"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(pkg.id)}
                    className="p-2 rounded-xl bg-slate-800 text-red-400 hover:text-white hover:bg-red-500"
                    title="حذف الباكدج"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle size={24} />
              <h3 className="font-bold text-lg text-white">تأكيد حذف الباكدج</h3>
            </div>
            <p className="text-xs text-slate-300">هل أنت متاكد من حذف هذا الباكدج بجميع بياناته وترجماته نهائياً؟</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-bold">إلغاء</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold">حذف نهائياً</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PACKAGE MODAL WITH 6-TABS AND 5-LANGUAGE TRANSLATIONS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col my-auto shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {editingId ? 'تعديل جميع بيانات الباكدج والترجمات الـ 5' : 'إضافة باكدج جديد'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  قم بتعديل وتخصيص التفاصيل الكاملة والبرنامج اليومي وترجمة جميع العناصر (Title, Overview, Key Highlights, Itinerary) للغات الـ 5.
                </p>
              </div>

              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><X size={20} /></button>
            </div>

            {/* Tabs Header */}
            <div className="flex border-b border-slate-800 bg-[#0d1117] px-4 sm:px-6 gap-2 overflow-x-auto custom-scrollbar">
              <button onClick={() => setActiveTab('basic')} className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'basic' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}>1. البيانات الأساسية والسعر</button>
              <button onClick={() => setActiveTab('overview')} className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'overview' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}>2. الوصف والتوزيع الفندقي</button>
              <button onClick={() => setActiveTab('itinerary')} className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'itinerary' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}>3. البرنامج اليومي التفصيلي</button>
              <button onClick={() => setActiveTab('highlights')} className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'highlights' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}>4. المميزات والمشتملات</button>
              <button onClick={() => setActiveTab('images')} className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'images' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}>5. معرض الصور</button>
              <button onClick={() => setActiveTab('translations')} className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'translations' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}>
                <Languages size={15} />
                <span>6. إدارة الترجمات الـ 5 (الكل)</span>
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* TAB 1: BASIC & PRICING */}
              {activeTab === 'basic' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم الباكدج الرئيسي (Title)</label>
                      <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">العنوان الفرعي (Subtitle)</label>
                      <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">الرابط الفرعي (Slug)</label>
                      <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs" />
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
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">فئة الباكدج (Category)</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white">
                        <option value="classic">Classic (برنامج كلاسيكي)</option>
                        <option value="honeymoon">Honeymoon (شهر عسل)</option>
                        <option value="religious">Religious (برامج دينية)</option>
                        <option value="multi-country">Multi-Country (دول متعددة)</option>
                        <option value="extension">Extension (امتدادات وتوسيع)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">السعر ($)</label>
                      <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">مدة الباكدج (Duration)</label>
                      <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                    </div>

                    <div className="flex items-center pt-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} className="w-5 h-5 accent-blue-500 rounded" />
                        <span className="text-xs font-bold text-blue-400">باكدج الأكثر طلباً 🔥 (Popular Package)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: OVERVIEW & ACCOMMODATION */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">الوصف التفصيلي للباكدج (Overview)</label>
                    <textarea rows={4} value={form.overview || form.description} onChange={(e) => setForm({ ...form, overview: e.target.value, description: e.target.value })} placeholder="وصف كامل للباكدج..." className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-3 text-white" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <Bed size={16} className="text-blue-400" />
                        <span>توزيع الليالي والإقامة بالفنادق (Accommodation Breakdown)</span>
                      </h4>
                      <button type="button" onClick={handleAddAccom} className="text-xs text-blue-400 font-bold hover:underline">+ إضافة مدينة/فندق</button>
                    </div>

                    <div className="space-y-3">
                      {form.accommodation.map((acc, index) => (
                        <div key={index} className="flex items-center gap-3 bg-[#0d1117] border border-slate-800 rounded-xl p-3">
                          <input type="text" placeholder="المدينة (مثل: Cairo)" value={acc.destination || ''} onChange={e => handleUpdateAccom(index, 'destination', e.target.value)} className="flex-1 bg-[#161b22] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                          <input type="number" min="1" placeholder="عدد الليالي" value={acc.nights || 1} onChange={e => handleUpdateAccom(index, 'nights', parseInt(e.target.value) || 1)} className="w-24 bg-[#161b22] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                          <input type="text" placeholder="نظام الوجبات" value={acc.regime || ''} onChange={e => handleUpdateAccom(index, 'regime', e.target.value)} className="flex-1 bg-[#161b22] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                          <button type="button" onClick={() => handleRemoveAccom(index)} className="text-red-400 hover:text-white"><X size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ITINERARY */}
              {activeTab === 'itinerary' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">برنامج اليوم بيوم للباكدج</h4>
                    <button type="button" onClick={handleAddItineraryDay} className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/30">+ إضافة يوم جديد</button>
                  </div>

                  <div className="space-y-4">
                    {form.itinerary.map((item, index) => (
                      <div key={index} className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">اليوم {index + 1}</span>
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
                      <h4 className="font-bold text-white text-sm">أبرز المميزات (Key Highlights)</h4>
                      <button type="button" onClick={handleAddHighlight} className="text-xs text-blue-400 font-bold hover:underline">+ إضافة ميزة</button>
                    </div>

                    <div className="space-y-2">
                      {form.highlights.map((hl, index) => (
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
                        <button type="button" onClick={handleAddIncluded} className="text-xs text-blue-400 font-bold hover:underline">+ إضافة</button>
                      </div>
                      <div className="space-y-2">
                        {form.included.map((inc, index) => (
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
                        <button type="button" onClick={handleAddExcluded} className="text-xs text-blue-400 font-bold hover:underline">+ إضافة</button>
                      </div>
                      <div className="space-y-2">
                        {form.excluded.map((exc, index) => (
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
                    <h4 className="font-bold text-white text-sm">روابط ومعرض صور الباكدج (Gallery)</h4>
                    <button type="button" onClick={handleAddImage} className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/30">+ إضافة رابط صورة</button>
                  </div>

                  <div className="space-y-3">
                    {form.images.map((imgUrl, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                          {imgUrl ? <img src={imgUrl} alt={`preview-${index}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">لا يوجد</div>}
                        </div>
                        <input type="text" value={imgUrl} onChange={(e) => handleUpdateImage(index, e.target.value)} placeholder="https://..." className="flex-1 bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs" />
                        <button type="button" onClick={() => handleRemoveImage(index)} className="text-red-400 p-2"><X size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: MULTI-LANGUAGE TRANSLATION EDITOR FOR PACKAGES */}
              {activeTab === 'translations' && (
                <div className="space-y-6">
                  {/* Language Selector Bar */}
                  <div className="flex items-center justify-between bg-[#0d1117] border border-slate-800 rounded-2xl p-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">اختر اللغة للتعديل:</span>
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
                                  ? 'bg-blue-500 text-slate-950 border-blue-400 shadow-md scale-[1.03]' 
                                  : hasTrans 
                                    ? 'bg-slate-800 text-blue-400 border-slate-700' 
                                    : 'bg-slate-900 text-slate-500 border-slate-800'
                                }
                              `}
                            >
                              <span>{lang.flag}</span>
                              <span>{lang.code.toUpperCase()}</span>
                              {hasTrans && <Check size={12} className="text-blue-400" />}
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

                  {/* Complete Package Translation Sub-Editors */}
                  <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="font-bold text-blue-400 text-sm flex items-center gap-2">
                        <span>إدارة وترجمة محتوى الباكدج بالكامل لـ:</span>
                        <span className="text-white font-black text-base">{LANGUAGES_SUPPORTED.find(l => l.code === selectedLang)?.label}</span>
                      </h4>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-3">
                      <h5 className="font-bold text-xs text-slate-300 uppercase tracking-wider">1. اسم الباكدج والعنوان الفرعي (Title & Subtitle)</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">اسم الباكدج بـ ({selectedLang.toUpperCase()})</label>
                          <input type="text" placeholder={`العنوان بـ ${selectedLang}`} value={currentLangData.title || ''} onChange={(e) => handleUpdateTranslationField('title', e.target.value)} className="w-full bg-[#161b22] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">العنوان الفرعي بـ ({selectedLang.toUpperCase()})</label>
                          <input type="text" placeholder={`العنوان الفرعي بـ ${selectedLang}`} value={currentLangData.subtitle || ''} onChange={(e) => handleUpdateTranslationField('subtitle', e.target.value)} className="w-full bg-[#161b22] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Overview */}
                    <div className="space-y-3 pt-4 border-t border-slate-800/80">
                      <h5 className="font-bold text-xs text-slate-300 uppercase tracking-wider">2. الوصف الكامل (Overview)</h5>
                      <textarea rows={3} placeholder={`الوصف بـ ${selectedLang}`} value={currentLangData.overview || currentLangData.description || ''} onChange={(e) => { handleUpdateTranslationField('overview', e.target.value); handleUpdateTranslationField('description', e.target.value); }} className="w-full bg-[#161b22] border border-slate-800 rounded-xl p-3 text-white" />
                    </div>

                    {/* Key Highlights */}
                    <div className="space-y-3 pt-4 border-t border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-xs text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles size={14} />
                          <span>3. أبرز مميزات الباكدج بـ ({selectedLang.toUpperCase()}) - Key Highlights</span>
                        </h5>
                        <button type="button" onClick={handleAddTransHighlight} className="text-xs text-blue-400 font-bold hover:underline">+ إضافة ميزة بـ ({selectedLang.toUpperCase()})</button>
                      </div>

                      <div className="space-y-2">
                        {(currentLangData.highlights || []).map((hlItem, idx) => (
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
                      </div>
                    </div>

                    {/* Day-by-Day Itinerary */}
                    <div className="space-y-3 pt-4 border-t border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-xs text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>4. البرنامج اليومي للباكدج بـ ({selectedLang.toUpperCase()}) - Day-by-Day Itinerary</span>
                        </h5>
                        <button type="button" onClick={handleAddTransItineraryDay} className="text-xs text-blue-400 font-bold hover:underline">+ إضافة يوم بـ ({selectedLang.toUpperCase()})</button>
                      </div>

                      <div className="space-y-3">
                        {(currentLangData.itinerary || []).map((itinDay, idx) => (
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
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">تأكد من حفظ التعديلات بعد مراجعة التبويبات والترجمات.</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">إلغاء</button>
                  <button type="submit" className="px-6 py-2 rounded-xl bg-blue-500 text-slate-950 text-xs font-bold shadow-lg shadow-blue-500/20">حفظ كافة التعديلات والترجمات</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagesManager;
