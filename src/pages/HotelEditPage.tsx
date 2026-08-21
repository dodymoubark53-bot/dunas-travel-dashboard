import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData, DESTINATIONS_LIST } from '../context/DataContext';
import { 
  Hotel, 
  ArrowRight, 
  Save, 
  X, 
  Star, 
  MapPin, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Building, 
  Globe, 
  Phone, 
  Mail, 
  ExternalLink,
  Wifi,
  Waves,
  Sparkles,
  Utensils,
  Dumbbell,
  ShieldCheck,
  Bed,
  Clock,
  AlertCircle,
  Check,
  Languages
} from 'lucide-react';

const AMENITIES_OPTIONS = [
  { id: 'wifi', label: 'واي فاي مجاني', icon: Wifi },
  { id: 'pool', label: 'حمام سباحة', icon: Waves },
  { id: 'spa', label: 'مركز سبا وعافية', icon: Sparkles },
  { id: 'restaurant', label: 'مطاعم فاخرة', icon: Utensils },
  { id: 'gym', label: 'صالة رياضية (Gym)', icon: Dumbbell },
  { id: 'roomService', label: 'خدمة غرف 24 ساعة', icon: ShieldCheck },
  { id: 'nileView', label: 'إطلالة على النيل', icon: Waves },
  { id: 'seaView', label: 'إطلالة على البحر', icon: Waves },
  { id: 'beachfront', label: 'شاطئ خاص', icon: MapPin },
  { id: 'aquaPark', label: 'ألعاب مائية (Aqua Park)', icon: Waves },
  { id: 'airportShuttle', label: 'توصيل للمطار', icon: Globe },
  { id: 'parking', label: 'موقف سيارات', icon: Building },
  { id: 'ac', label: 'تكييف هواء كامل', icon: Sparkles },
  { id: 'allInclusive', label: 'نظام الوجبات الشامل (All Inclusive)', icon: Utensils }
];

const LANGUAGES_SUPPORTED = [
  { code: 'ar', label: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'en', label: 'الإنجليزية (English)', flag: '🇬🇧' },
  { code: 'es', label: 'الإسبانية (Spanish)', flag: '🇪🇸' },
  { code: 'pt', label: 'البرتغالية (Portuguese)', flag: '🇵🇹' },
  { code: 'it', label: 'الإيطالية (Italian)', flag: '🇮🇹' }
];

const HotelEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hotels, addHotel, updateHotel, dashboardLang } = useData();

  const isNew = id === 'new';
  const existingHotel = hotels.find((h: any) => h.id === id);

  const [activeTab, setActiveTab] = useState<'basic' | 'gallery' | 'amenities' | 'rooms' | 'policies' | 'translations'>('basic');
  const [selectedLang, setSelectedLang] = useState('ar');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Main Hotel Form State
  const [form, setForm] = useState({
    name: '',
    destination: 'egypt',
    city: 'Cairo',
    stars: 5,
    rating: 4.8,
    pricePerNight: 180,
    status: 'ACTIVE',
    image: '',
    gallery: [] as string[],
    description: '',
    address: '',
    mapUrl: '',
    phone: '',
    email: '',
    website: '',
    amenities: [] as string[],
    roomTypes: [] as Array<{ id: string; name: string; price: number; mealPlan: string; maxOccupancy: number }>,
    policies: {
      checkIn: '14:00',
      checkOut: '12:00',
      cancellation: 'إلغاء مجاني حتى 48 ساعة قبل موعد الوصول.',
      childPolicy: 'الأطفال أقل من 6 سنوات مجاناً.'
    },
    translations: {
      ar: { name: '', description: '' },
      en: { name: '', description: '' },
      es: { name: '', description: '' },
      pt: { name: '', description: '' },
      it: { name: '', description: '' }
    }
  });

  // New gallery image input URL
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // New room type temp state
  const [newRoom, setNewRoom] = useState({
    name: '',
    price: 150,
    mealPlan: 'Bed & Breakfast',
    maxOccupancy: 2
  });

  useEffect(() => {
    if (!isNew && existingHotel) {
      setForm({
        name: existingHotel.name || '',
        destination: existingHotel.destination || 'egypt',
        city: existingHotel.city || 'Cairo',
        stars: existingHotel.stars || 5,
        rating: existingHotel.rating || 4.8,
        pricePerNight: existingHotel.pricePerNight || 150,
        status: existingHotel.status || 'ACTIVE',
        image: existingHotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        gallery: Array.isArray(existingHotel.gallery) && existingHotel.gallery.length > 0
          ? existingHotel.gallery
          : [existingHotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
        description: existingHotel.description || '',
        address: existingHotel.address || '',
        mapUrl: existingHotel.mapUrl || '',
        phone: existingHotel.phone || '',
        email: existingHotel.email || '',
        website: existingHotel.website || '',
        amenities: existingHotel.amenities || ['wifi', 'pool', 'restaurant', 'ac'],
        roomTypes: existingHotel.roomTypes || [
          { id: 'r1', name: 'Standard Room', price: existingHotel.pricePerNight || 150, mealPlan: 'Bed & Breakfast', maxOccupancy: 2 }
        ],
        policies: {
          checkIn: existingHotel.policies?.checkIn || '14:00',
          checkOut: existingHotel.policies?.checkOut || '12:00',
          cancellation: existingHotel.policies?.cancellation || 'إلغاء مجاني حتى 48 ساعة قبل موعد الوصول.',
          childPolicy: existingHotel.policies?.childPolicy || 'الأطفال حتى سن 6 سنوات مجاناً.'
        },
        translations: {
          ar: existingHotel.translations?.ar || { name: existingHotel.name || '', description: existingHotel.description || '' },
          en: existingHotel.translations?.en || { name: '', description: '' },
          es: existingHotel.translations?.es || { name: '', description: '' },
          pt: existingHotel.translations?.pt || { name: '', description: '' },
          it: existingHotel.translations?.it || { name: '', description: '' }
        }
      });
    } else if (isNew) {
      setForm({
        name: '',
        destination: 'egypt',
        city: 'Cairo',
        stars: 5,
        rating: 4.8,
        pricePerNight: 200,
        status: 'ACTIVE',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        gallery: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
        description: 'فندق فاخر يتميز بإطلالة ساحرة وخدمات متميزة للنزلاء والضيوف.',
        address: 'شارع النيل، القاهرة، مصر',
        mapUrl: '',
        phone: '+20 2 12345678',
        email: 'info@hotel.com',
        website: 'https://www.hotel.com',
        amenities: ['wifi', 'pool', 'restaurant', 'ac'],
        roomTypes: [
          { id: 'r1', name: 'Standard Deluxe Room', price: 200, mealPlan: 'Bed & Breakfast', maxOccupancy: 2 }
        ],
        policies: {
          checkIn: '14:00',
          checkOut: '12:00',
          cancellation: 'إلغاء مجاني حتى 48 ساعة قبل موعد الوصول.',
          childPolicy: 'الأطفال أقل من 6 سنوات مجاناً.'
        },
        translations: {
          ar: { name: '', description: '' },
          en: { name: '', description: '' },
          es: { name: '', description: '' },
          pt: { name: '', description: '' },
          it: { name: '', description: '' }
        }
      });
    }
  }, [id, isNew, existingHotel]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('يرجى أدخال اسم الفندق الرئيسي');
      return;
    }

    if (isNew) {
      addHotel(form);
    } else if (id) {
      updateHotel(id, form);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      navigate('/hotels');
    }, 1200);
  };

  const toggleAmenity = (amenityId: string) => {
    setForm(prev => {
      const exists = prev.amenities.includes(amenityId);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter(a => a !== amenityId)
          : [...prev.amenities, amenityId]
      };
    });
  };

  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setForm(prev => ({
      ...prev,
      gallery: [...prev.gallery, newGalleryUrl.trim()]
    }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleAddRoom = () => {
    if (!newRoom.name.trim()) return;
    setForm(prev => ({
      ...prev,
      roomTypes: [
        ...prev.roomTypes,
        {
          id: `room-${Date.now()}`,
          name: newRoom.name,
          price: Number(newRoom.price) || 100,
          mealPlan: newRoom.mealPlan,
          maxOccupancy: Number(newRoom.maxOccupancy) || 2
        }
      ]
    }));
    setNewRoom({ name: '', price: 150, mealPlan: 'Bed & Breakfast', maxOccupancy: 2 });
  };

  const handleRemoveRoom = (roomId: string) => {
    setForm(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.filter(r => r.id !== roomId)
    }));
  };

  const updateTranslationField = (lang: string, field: 'name' | 'description', value: string) => {
    setForm(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...(prev.translations as any)[lang],
          [field]: value
        }
      }
    }));
  };

  const isRtl = dashboardLang === 'ar';

  return (
    <div className="space-y-6 pb-12">
      {/* Save Success Alert Banner */}
      {saveSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3 animate-bounce">
          <CheckCircle size={22} />
          <span>تم حفظ كافة بيانات الفندق بنجاح! جاري التوجيه لقائمة الفنادق...</span>
        </div>
      )}

      {/* Top Header Sticky Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-16 z-30 backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/hotels')}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shrink-0"
            title="العودة"
          >
            <ArrowRight size={20} className={isRtl ? '' : 'rotate-180'} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                {isNew ? 'إضافة فندق جديد' : 'تعديل فندق'}
              </span>
              {form.name && (
                <span className="text-slate-400 text-xs font-semibold">• {form.city}</span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white mt-1 flex items-center gap-2">
              <Hotel className="text-emerald-400" size={24} />
              <span>{form.name || (isNew ? 'فندق جديد' : 'تعديل بيانات الفندق')}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/hotels')}
            className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20"
          >
            <Save size={16} />
            <span>حفظ كافة التغييرات</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'basic', label: 'البيانات الأساسية', icon: Building },
          { id: 'gallery', label: 'معرض الصور والوسائط', icon: ImageIcon },
          { id: 'amenities', label: 'المرافق والخدمات', icon: Sparkles },
          { id: 'rooms', label: 'أنواع الغرف والأسعار', icon: Bed },
          { id: 'policies', label: 'الشروط والسياسات', icon: Clock },
          { id: 'translations', label: 'الترجمات واللغات', icon: Languages }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 whitespace-nowrap
                ${isActive 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10' 
                  : 'bg-[#161b22] text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50'}
              `}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: BASIC INFO */}
        {activeTab === 'basic' && (
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Building className="text-emerald-400" size={20} />
              <span>المعلومات والبيانات الأساسية للفندق</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-slate-300 font-semibold">اسم الفندق بالكامل *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="مثال: Steigenberger Hotel El Tahrir"
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">حالة الفندق</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="ACTIVE" className="bg-[#161b22]">نشط ومتاح (Active)</option>
                  <option value="VIP" className="bg-[#161b22]">VIP فاخر (VIP Feature)</option>
                  <option value="RECOMMENDED" className="bg-[#161b22]">موصى به (Recommended)</option>
                  <option value="INACTIVE" className="bg-[#161b22]">غير متاح حالياً (Inactive)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">الوجهة / الدولة</label>
                <select
                  value={form.destination}
                  onChange={e => setForm({ ...form, destination: e.target.value })}
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none cursor-pointer"
                >
                  {DESTINATIONS_LIST.map(d => (
                    <option key={d.id} value={d.id} className="bg-[#161b22]">
                      {d.flag} {d.nameAr} ({d.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">المدينة / المنطقة</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder="مثال: القاهرة / Cairo"
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">عدد النجوم (1 - 5)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.stars}
                    onChange={e => setForm({ ...form, stars: parseInt(e.target.value) || 5 })}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none"
                  />
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-3 py-2.5 rounded-2xl shrink-0 text-amber-400">
                    <Star size={16} className="fill-amber-400" />
                    <span className="font-bold">{form.stars} نجوم</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">التقييم العام (من 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={form.rating}
                  onChange={e => setForm({ ...form, rating: parseFloat(e.target.value) || 4.5 })}
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">سعر الليلة الابتدائي ($ USD)</label>
                <input
                  type="number"
                  min="0"
                  value={form.pricePerNight}
                  onChange={e => setForm({ ...form, pricePerNight: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-slate-300 font-semibold">العنوان التفصيلي</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="مثال: ميدان التحرير، وسط البلد، القاهرة، مصر"
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-3">
                <label className="block text-slate-300 font-semibold">الوصف العام ونبذة عن الفندق</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="اكتب وصفاً شاملاً عن موقع الفندق والمميزات التي يقدمها للنزلاء..."
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Contact Information Sub-section */}
              <div className="md:col-span-3 border-t border-slate-800 pt-4 space-y-4">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <Phone size={16} />
                  <span>معلومات الاتصال ورابط الموقع والخريطة</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[11px]">رقم الهاتف</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+20 2 25750000"
                      className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 text-[11px]">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="reservations@hotel.com"
                      className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 text-[11px]">رابط الموقع الرسمي</label>
                    <input
                      type="url"
                      value={form.website}
                      onChange={e => setForm({ ...form, website: e.target.value })}
                      placeholder="https://www.hotelwebsite.com"
                      className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 text-[11px]">رابط الموقع على الخريطة (Map URL)</label>
                    <input
                      type="url"
                      value={form.mapUrl}
                      onChange={e => setForm({ ...form, mapUrl: e.target.value })}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GALLERY & MEDIA */}
        {activeTab === 'gallery' && (
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <ImageIcon className="text-emerald-400" size={20} />
              <span>معرض الصور والوسائط الخاصة بالفندق</span>
            </h2>

            <div className="space-y-6 text-xs">
              {/* Featured Image */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold">رابط الصورة الرئيسية للفندق (Featured Main Image)</label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <input
                    type="url"
                    value={form.image}
                    onChange={e => setForm({ ...form, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                  {form.image && (
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-700 shrink-0 bg-slate-900">
                      <img src={form.image} alt="Featured Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images List */}
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">صور معرض الفندق ({form.gallery.length} صورة)</h3>
                    <p className="text-slate-400 text-[11px]">أضف صوراً إضافية لاستعراض الغرف، المطاعم، وحمامات السباحة.</p>
                  </div>
                </div>

                {/* Add new image form */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newGalleryUrl}
                    onChange={e => setNewGalleryUrl(e.target.value)}
                    placeholder="ضع رابط صورة جديد المعرض (https://...)"
                    className="flex-1 bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-2.5 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <Plus size={16} />
                    <span>إضافة للمعرض</span>
                  </button>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
                  {form.gallery.map((imgUrl, index) => (
                    <div key={index} className="group relative h-36 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
                      <img src={imgUrl} alt={`Gallery ${index}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="absolute top-2 right-2 p-1.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white transition-colors shadow-lg"
                        title="حذف الصورة"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AMENITIES & SERVICES */}
        {activeTab === 'amenities' && (
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="text-emerald-400" size={20} />
                <span>مرافق وخدمات الفندق (Hotel Amenities & Services)</span>
              </h2>
              <p className="text-slate-400 text-xs mt-1">حدد الخدمات والميزات المتاحة للنزلاء لتظهر في قائمة تفاصيل الفندق.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AMENITIES_OPTIONS.map(opt => {
                const Icon = opt.icon;
                const isSelected = form.amenities.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleAmenity(opt.id)}
                    className={`
                      cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between select-none
                      ${isSelected 
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/5' 
                        : 'bg-[#0d1117] border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon size={18} />
                      </div>
                      <span className="text-xs font-bold">{opt.label}</span>
                    </div>

                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${isSelected ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700'}`}>
                      {isSelected && <Check size={14} className="stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ROOM TYPES & PRICING */}
        {activeTab === 'rooms' && (
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bed className="text-emerald-400" size={20} />
                <span>إدارة انواع الغرف وفئات الإقامة والأسعار</span>
              </h2>
              <p className="text-slate-400 text-xs mt-1">حدد أسعار فئات الغرف ونظام وجبات الطعام المتاحة بالبرامج الفندقية.</p>
            </div>

            <div className="space-y-6 text-xs">
              {/* Add Room Type Form */}
              <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 space-y-4">
                <h3 className="font-bold text-white text-xs flex items-center gap-2">
                  <Plus size={16} className="text-emerald-400" />
                  <span>إضافة نوع غرفة جديد</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">اسم الغرفة / الفئة</label>
                    <input
                      type="text"
                      value={newRoom.name}
                      onChange={e => setNewRoom({ ...newRoom, name: e.target.value })}
                      placeholder="مثال: Deluxe Nile View Suite"
                      className="w-full bg-[#161b22] border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">سعر الغرفة / ليلة ($)</label>
                    <input
                      type="number"
                      value={newRoom.price}
                      onChange={e => setNewRoom({ ...newRoom, price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#161b22] border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">نظام الوجبات (Meal Plan)</label>
                    <select
                      value={newRoom.mealPlan}
                      onChange={e => setNewRoom({ ...newRoom, mealPlan: e.target.value })}
                      className="w-full bg-[#161b22] border border-slate-800 rounded-xl px-3 py-2 text-white font-medium cursor-pointer"
                    >
                      <option value="Bed & Breakfast">Bed & Breakfast (إفطار)</option>
                      <option value="Half Board">Half Board (إفطار وعشاء)</option>
                      <option value="Full Board">Full Board (ثلاث وجبات)</option>
                      <option value="All Inclusive">All Inclusive (وجبات ومشروبات)</option>
                      <option value="Room Only">Room Only (بدون وجبات)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">أقصى عدد نزلاء</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={newRoom.maxOccupancy}
                        onChange={e => setNewRoom({ ...newRoom, maxOccupancy: parseInt(e.target.value) || 2 })}
                        className="w-full bg-[#161b22] border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                      />
                      <button
                        type="button"
                        onClick={handleAddRoom}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shrink-0"
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Types Table */}
              <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-800">
                <table className="w-full min-w-[600px] text-right text-xs">
                  <thead className="bg-[#0d1117] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">اسم الغرفة</th>
                      <th className="p-3">السعر/ليلة</th>
                      <th className="p-3">نظام الوجبات</th>
                      <th className="p-3">السعة القصوى</th>
                      <th className="p-3 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-[#161b22]">
                    {form.roomTypes.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-900/40">
                        <td className="p-3 font-bold text-white">{r.name}</td>
                        <td className="p-3 font-black text-amber-400">${r.price}</td>
                        <td className="p-3 text-slate-300">{r.mealPlan}</td>
                        <td className="p-3 text-slate-400">{r.maxOccupancy} أفراد</td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveRoom(r.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="حذف الفئة"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {form.roomTypes.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500">
                          لا يوجد فئات غرف مضافة حالياً.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: POLICIES */}
        {activeTab === 'policies' && (
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Clock className="text-emerald-400" size={20} />
              <span>سياسات الفندق ومواعيد التسكين والشروط</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">موعد تسجيل الوصول (Check-in)</label>
                <input
                  type="text"
                  value={form.policies.checkIn}
                  onChange={e => setForm({ ...form, policies: { ...form.policies, checkIn: e.target.value } })}
                  placeholder="14:00"
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">موعد تسجيل المغادرة (Check-out)</label>
                <input
                  type="text"
                  value={form.policies.checkOut}
                  onChange={e => setForm({ ...form, policies: { ...form.policies, checkOut: e.target.value } })}
                  placeholder="12:00"
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-slate-300 font-semibold">سياسة الإلغاء والاسترداد</label>
                <textarea
                  rows={3}
                  value={form.policies.cancellation}
                  onChange={e => setForm({ ...form, policies: { ...form.policies, cancellation: e.target.value } })}
                  placeholder="مثال: إلغاء مجاني حتى 48 ساعة قبل موعد الوصول..."
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-slate-300 font-semibold">سياسة تسكين الأطفال والشغار</label>
                <textarea
                  rows={3}
                  value={form.policies.childPolicy}
                  onChange={e => setForm({ ...form, policies: { ...form.policies, childPolicy: e.target.value } })}
                  placeholder="مثال: الأطفال أقل من 6 سنوات مجاناً بدون سرير إضافي..."
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MULTI-LANGUAGE TRANSLATIONS */}
        {activeTab === 'translations' && (
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Languages className="text-emerald-400" size={20} />
                <span>إدارة ترجمات اسم ووصف الفندق باللغات متعددة</span>
              </h2>
              <p className="text-slate-400 text-xs mt-1">توفير بيانات الفندق باللغات اللاتينية والعربية لدعم العملاء الأجانب وبوابات الـ B2B.</p>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              {LANGUAGES_SUPPORTED.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLang(lang.code)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all
                    ${selectedLang === lang.code 
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                      : 'bg-[#0d1117] text-slate-400 hover:text-white'}
                  `}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">
                  اسم الفندق بلغـة ({LANGUAGES_SUPPORTED.find(l => l.code === selectedLang)?.label})
                </label>
                <input
                  type="text"
                  value={(form.translations as any)[selectedLang]?.name || ''}
                  onChange={e => updateTranslationField(selectedLang, 'name', e.target.value)}
                  placeholder="Enter translated hotel name..."
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">
                  وصف الفندق بلغـة ({LANGUAGES_SUPPORTED.find(l => l.code === selectedLang)?.label})
                </label>
                <textarea
                  rows={5}
                  value={(form.translations as any)[selectedLang]?.description || ''}
                  onChange={e => updateTranslationField(selectedLang, 'description', e.target.value)}
                  placeholder="Enter translated overview..."
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default HotelEditPage;
