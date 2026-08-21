import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  FileText, 
  Layout, 
  Info, 
  Newspaper, 
  HelpCircle, 
  Share2, 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Search, 
  Globe, 
  Image as ImageIcon, 
  Sparkles,
  Phone,
  Mail,
  MapPin,
  X
} from 'lucide-react';

const ContentManager = () => {
  const { 
    siteContent, 
    updateSiteContent, 
    blogs, 
    addBlog, 
    updateBlog, 
    deleteBlog, 
    faqs, 
    addFaq, 
    updateFaq, 
    deleteFaq,
    t
  } = useData();

  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'blogs' | 'faqs' | 'contact'>('hero');
  const [saveBanner, setSaveBanner] = useState(false);

  // Site Content Form
  const [heroForm, setHeroForm] = useState({ ...siteContent });

  // Blog Modal State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogSearch, setBlogSearch] = useState('');
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    category: 'دليل السفر',
    author: 'Attia Yamany',
    date: new Date().toISOString().split('T')[0],
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
    excerpt: '',
    content: ''
  });

  // FAQ Modal State
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'عام'
  });

  const handleSaveGeneralContent = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent(heroForm);
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2500);
  };

  // Blog Actions
  const handleOpenAddBlog = () => {
    setEditingBlogId(null);
    setBlogForm({
      title: '',
      slug: '',
      category: 'دليل السفر',
      author: 'Attia Yamany',
      date: new Date().toISOString().split('T')[0],
      image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
      excerpt: '',
      content: ''
    });
    setIsBlogModalOpen(true);
  };

  const handleOpenEditBlog = (b: any) => {
    setEditingBlogId(b.id);
    setBlogForm({
      title: b.title || '',
      slug: b.slug || '',
      category: b.category || 'دليل السفر',
      author: b.author || 'Attia Yamany',
      date: b.date || new Date().toISOString().split('T')[0],
      image: b.image || '',
      excerpt: b.excerpt || '',
      content: b.content || ''
    });
    setIsBlogModalOpen(true);
  };

  const handleSubmitBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title.trim()) return alert('يرجى كتابة عنوان المقال');
    
    if (editingBlogId) {
      updateBlog(editingBlogId, blogForm);
    } else {
      addBlog(blogForm);
    }
    setIsBlogModalOpen(false);
  };

  // FAQ Actions
  const handleOpenAddFaq = () => {
    setEditingFaqId(null);
    setFaqForm({ question: '', answer: '', category: 'عام' });
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (f: any) => {
    setEditingFaqId(f.id);
    setFaqForm({ question: f.question || '', answer: f.answer || '', category: f.category || 'عام' });
    setIsFaqModalOpen(true);
  };

  const handleSubmitFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question.trim()) return alert('يرجى إدخال السؤال');

    if (editingFaqId) {
      updateFaq(editingFaqId, faqForm);
    } else {
      addFaq(faqForm);
    }
    setIsFaqModalOpen(false);
  };

  const filteredBlogs = (blogs || []).filter((b: any) => 
    (b.title || '').toLowerCase().includes(blogSearch.toLowerCase()) ||
    (b.category || '').toLowerCase().includes(blogSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Success Notification Banner */}
      {saveBanner && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3 animate-bounce">
          <CheckCircle size={22} />
          <span>تم حفظ تحديثات محتوى الموقع بنجاح!</span>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <FileText className="text-emerald-400" size={28} />
            <span>{t('contentManagerTitle')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('contentManagerSubtitle')}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'hero', label: 'الواجهة والهيدر الرئيسي', icon: Layout },
          { id: 'about', label: 'عن الشركة والإحصائيات', icon: Info },
          { id: 'blogs', label: 'المدونة والمقالات السياحية', icon: Newspaper, badge: `${blogs?.length || 0}` },
          { id: 'faqs', label: 'الأسئلة الشائعة (FAQ)', icon: HelpCircle, badge: `${faqs?.length || 0}` },
          { id: 'contact', label: 'معلومات التواصل والفوتر', icon: Share2 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer
                ${isActive 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10' 
                  : 'bg-[#161b22] text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50'}
              `}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO & GENERAL */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveGeneralContent} className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layout className="text-emerald-400" size={20} />
              <span>محتوى الهيدر والواجهة الرئيسية (Hero Section)</span>
            </h2>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Save size={16} />
              <span>حفظ التعديلات</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold">عنوان الواجهة الرئيسي (Main Hero Title)</label>
              <input
                type="text"
                value={heroForm.heroTitle}
                onChange={e => setHeroForm({ ...heroForm, heroTitle: e.target.value })}
                className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold">الوصف الفرعي للترحيب (Hero Subtitle)</label>
              <textarea
                rows={3}
                value={heroForm.heroSubtitle}
                onChange={e => setHeroForm({ ...heroForm, heroSubtitle: e.target.value })}
                className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">الشعار الترويجي (Tagline Badge)</label>
                <input
                  type="text"
                  value={heroForm.tagline}
                  onChange={e => setHeroForm({ ...heroForm, tagline: e.target.value })}
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">نص زر الدعوة للإجراء (Call to Action Button)</label>
                <input
                  type="text"
                  value={heroForm.ctaText}
                  onChange={e => setHeroForm({ ...heroForm, ctaText: e.target.value })}
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: ABOUT US & STATS */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveGeneralContent} className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Info className="text-emerald-400" size={20} />
              <span>قسم من نحن والإحصائيات الرسمية (About & Stats)</span>
            </h2>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Save size={16} />
              <span>حفظ التغييرات</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold">عنوان قسم من نحن</label>
              <input
                type="text"
                value={heroForm.aboutTitle}
                onChange={e => setHeroForm({ ...heroForm, aboutTitle: e.target.value })}
                className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold">قصة الشركة والرؤية المستقبيلة</label>
              <textarea
                rows={4}
                value={heroForm.aboutStory}
                onChange={e => setHeroForm({ ...heroForm, aboutStory: e.target.value })}
                className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3">
              <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles size={16} />
                <span>إحصائيات النجاح وأرقام الشركة المميزة</span>
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">إجمالي الرحلات</label>
                  <input
                    type="text"
                    value={heroForm.statTrips}
                    onChange={e => setHeroForm({ ...heroForm, statTrips: e.target.value })}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">إجمالي المسافرين</label>
                  <input
                    type="text"
                    value={heroForm.statTravelers}
                    onChange={e => setHeroForm({ ...heroForm, statTravelers: e.target.value })}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">سنوات الخبرة</label>
                  <input
                    type="text"
                    value={heroForm.statYears}
                    onChange={e => setHeroForm({ ...heroForm, statYears: e.target.value })}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">نسبة الرضا والتقييم</label>
                  <input
                    type="text"
                    value={heroForm.statSatisfaction}
                    onChange={e => setHeroForm({ ...heroForm, statSatisfaction: e.target.value })}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: BLOGS & ARTICLES */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-2xl p-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={blogSearch}
                onChange={e => setBlogSearch(e.target.value)}
                placeholder="ابحث بعنوان المقال أو التصنيف..."
                className="w-full bg-[#0d1117] border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleOpenAddBlog}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Plus size={16} />
              <span>إضافة مقال جديد</span>
            </button>
          </div>

          {/* Blogs List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlogs.map((b: any) => (
              <div key={b.id} className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="h-44 bg-slate-800 relative">
                    <img src={b.image || 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80'} alt={b.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 bg-emerald-500/90 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {b.category}
                    </span>
                  </div>
                  <div className="p-5 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>بقلم: {b.author}</span>
                      <span>{b.date}</span>
                    </div>
                    <h3 className="font-bold text-white text-base leading-snug">{b.title}</h3>
                    <p className="text-slate-400 line-clamp-2 leading-relaxed">{b.excerpt}</p>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/40">
                  <span className="text-[11px] text-slate-500 font-mono">{b.slug}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenEditBlog(b)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"><Edit size={14} /></button>
                    <button onClick={() => deleteBlog(b.id)} className="p-1.5 rounded-lg bg-slate-800 text-red-400 hover:text-white"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FAQS */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[#161b22] border border-slate-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="text-amber-400" size={18} />
              <span>إدارة الأسئلة الشائعة ({faqs?.length || 0} سؤال)</span>
            </h3>
            <button
              onClick={handleOpenAddFaq}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Plus size={16} />
              <span>إضافة سؤال جديد</span>
            </button>
          </div>

          <div className="space-y-4">
            {(faqs || []).map((f: any) => (
              <div key={f.id} className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 space-y-2 flex items-start justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-500/20">
                      {f.category || 'عام'}
                    </span>
                    <h4 className="font-bold text-white text-sm">{f.question}</h4>
                  </div>
                  <p className="text-slate-400 leading-relaxed pt-1">{f.answer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleOpenEditFaq(f)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"><Edit size={14} /></button>
                  <button onClick={() => deleteFaq(f.id)} className="p-1.5 rounded-lg bg-slate-800 text-red-400 hover:text-white"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CONTACT & FOOTER */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveGeneralContent} className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Share2 className="text-emerald-400" size={20} />
              <span>بيانات الاتصال والتواصل الاجتماعي (Footer & Social Links)</span>
            </h2>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Save size={16} />
              <span>حفظ البيانات</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Phone size={14} className="text-emerald-400" />
                <span>رقم الهاتف الرئيسي</span>
              </label>
              <input
                type="text"
                value={heroForm.contactPhone}
                onChange={e => setHeroForm({ ...heroForm, contactPhone: e.target.value })}
                className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Mail size={14} className="text-emerald-400" />
                <span>البريد الإلكتروني</span>
              </label>
              <input
                type="email"
                value={heroForm.contactEmail}
                onChange={e => setHeroForm({ ...heroForm, contactEmail: e.target.value })}
                className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-400" />
                <span>العنوان الرسمي</span>
              </label>
              <input
                type="text"
                value={heroForm.contactAddress}
                onChange={e => setHeroForm({ ...heroForm, contactAddress: e.target.value })}
                className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl px-4 py-3 text-white font-medium"
              />
            </div>

            <div className="space-y-1.5 md:col-span-3 border-t border-slate-800 pt-4">
              <h3 className="text-xs font-bold text-amber-400 mb-3">روابط حسابات التواصل الاجتماعي</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">رابط الفيسبوك (Facebook)</label>
                  <input
                    type="url"
                    value={heroForm.facebook}
                    onChange={e => setHeroForm({ ...heroForm, facebook: e.target.value })}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">رابط إنستغرام (Instagram)</label>
                  <input
                    type="url"
                    value={heroForm.instagram}
                    onChange={e => setHeroForm({ ...heroForm, instagram: e.target.value })}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">رابط قناة اليوتيوب (YouTube)</label>
                  <input
                    type="url"
                    value={heroForm.youtube}
                    onChange={e => setHeroForm({ ...heroForm, youtube: e.target.value })}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* BLOG MODAL */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-xl w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">{editingBlogId ? 'تعديل المقال' : 'إضافة مقال جديد'}</h3>
              <button onClick={() => setIsBlogModalOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmitBlog} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">عنوان المقال *</label>
                <input type="text" value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} required className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">التصنيف</label>
                  <input type="text" value={blogForm.category} onChange={e => setBlogForm({ ...blogForm, category: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">الكاتب</label>
                  <input type="text" value={blogForm.author} onChange={e => setBlogForm({ ...blogForm, author: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">رابط صورة المقال</label>
                <input type="url" value={blogForm.image} onChange={e => setBlogForm({ ...blogForm, image: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">ملخص المقال (Excerpt)</label>
                <textarea rows={2} value={blogForm.excerpt} onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">محتوى المقال الكامل</label>
                <textarea rows={4} value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsBlogModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">إلغاء</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">حفظ المقال</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-md w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">{editingFaqId ? 'تعديل السؤال الشائع' : 'إضافة سؤال جديد'}</h3>
              <button onClick={() => setIsFaqModalOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmitFaq} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">السؤال *</label>
                <input type="text" value={faqForm.question} onChange={e => setFaqForm({ ...faqForm, question: e.target.value })} required className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">التصنيف</label>
                <input type="text" value={faqForm.category} onChange={e => setFaqForm({ ...faqForm, category: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">الإجابة التفصيلية</label>
                <textarea rows={4} value={faqForm.answer} onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })} required className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsFaqModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">إلغاء</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold">حفظ السؤال</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
