import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  X, 
  ShieldCheck, 
  Award,
  CreditCard,
  Mail,
  Phone,
  Globe
} from 'lucide-react';

const CompaniesManager = () => {
  const { companies, addCompany, updateCompany, deleteCompany, t } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    taxId: '',
    tier: 'GOLD',
    country: 'Brasil 🇧🇷',
    representative: '',
    email: '',
    phone: '',
    creditLimit: 10000,
    status: 'ACTIVE'
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      taxId: '',
      tier: 'GOLD',
      country: 'Brasil 🇧🇷',
      representative: '',
      email: '',
      phone: '',
      creditLimit: 10000,
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp: any) => {
    setEditingId(comp.id);
    setForm({
      name: comp.name || '',
      taxId: comp.taxId || '',
      tier: comp.tier || 'GOLD',
      country: comp.country || '',
      representative: comp.representative || '',
      email: comp.email || '',
      phone: comp.phone || '',
      creditLimit: comp.creditLimit || 0,
      status: comp.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('يرجى أدخال اسم الشركة');

    if (editingId) {
      updateCompany(editingId, form);
    } else {
      addCompany(form);
    }
    setIsModalOpen(false);
  };

  const filteredCompanies = companies.filter((c: any) => {
    const matchesSearch = (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (c.taxId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.representative || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'ALL' || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const totalCreditLimit = companies.reduce((sum: number, c: any) => sum + Number(c.creditLimit || 0), 0);
  const activeCompanies = companies.filter((c: any) => c.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Building2 className="text-amber-500" />
            <span>{t('companiesManagerTitle')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('companiesManagerSubtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus size={18} />
          <span>{t('addPartnerCompany')}</span>
        </button>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('totalRegisteredCompanies')}</span>
          <p className="text-3xl font-black text-white">{companies.length}</p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('activeActivatedContracts')}</span>
          <p className="text-3xl font-black text-emerald-400">{activeCompanies}</p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('vipCompanies')}</span>
          <p className="text-3xl font-black text-amber-400">
            {companies.filter((c: any) => c.tier === 'VIP' || c.tier === 'PLATINUM').length}
          </p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('totalCreditLimits')}</span>
          <p className="text-3xl font-black text-blue-400">${totalCreditLimit.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#161b22] border border-slate-800 rounded-2xl p-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="البحث باسم الشركة، الرقم الضريبي، أو ممثل الشركة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">الفئة:</span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 w-full sm:w-auto"
          >
            <option value="ALL">جميع الفئات</option>
            <option value="VIP">👑 VIP Enterprise</option>
            <option value="PLATINUM">💎 Platinum</option>
            <option value="GOLD">🥇 Gold</option>
            <option value="SILVER">🥈 Silver</option>
          </select>
        </div>
      </div>

      {/* Companies Table View */}
      <div className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[750px] text-right text-sm">
            <thead className="bg-[#0d1117] text-slate-400 font-bold border-b border-slate-800 text-xs">
              <tr>
                <th className="p-4">كود الشركة</th>
                <th className="p-4">اسم الشركة الشريكة</th>
                <th className="p-4">الرقم الضريبي</th>
                <th className="p-4">فئة الشراكة</th>
                <th className="p-4">ممثل الشركة</th>
                <th className="p-4">الحد الائتماني</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80">
              {filteredCompanies.map((comp: any) => (
                <tr key={comp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-xs text-slate-400 font-bold">{comp.id}</td>

                  <td className="p-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-amber-400 shrink-0" />
                      <span>{comp.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block font-normal">{comp.country}</span>
                  </td>

                  <td className="p-4 font-mono text-xs text-slate-300">{comp.taxId || 'N/A'}</td>

                  <td className="p-4">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                      comp.tier === 'VIP' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                      comp.tier === 'PLATINUM' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                      'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {comp.tier}
                    </span>
                  </td>

                  <td className="p-4 space-y-0.5">
                    <span className="font-bold text-slate-200 block text-xs">{comp.representative}</span>
                    <span className="text-[11px] text-slate-400 block">{comp.email}</span>
                  </td>

                  <td className="p-4 font-bold text-amber-400">${Number(comp.creditLimit).toLocaleString()}</td>

                  <td className="p-4">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      comp.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {comp.status === 'ACTIVE' ? 'نشط (Active)' : 'موقوف (Suspended)'}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleOpenEdit(comp)} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-amber-500/20" title="تعديل">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => deleteCompany(comp.id)} className="p-2 rounded-xl bg-slate-800 text-red-400 hover:text-white hover:bg-red-500" title="حذف">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    لا توجد شركات شريكة تطابق محددات البحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-lg w-full my-auto p-4 sm:p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">{editingId ? 'تعديل بيانات الشركة الشريكة' : 'إضافة شركة سياحية شريكة جديد'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">اسم الشركة (Company Name)</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="CVC Viagens" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">الرقم الضريبي (Tax ID)</label>
                  <input type="text" value={form.taxId} onChange={e => setForm({ ...form, taxId: e.target.value })} placeholder="BR-98745612" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">فئة الشراكة (Tier)</label>
                  <select value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white">
                    <option value="VIP">👑 VIP Enterprise</option>
                    <option value="PLATINUM">💎 Platinum</option>
                    <option value="GOLD">🥇 Gold</option>
                    <option value="SILVER">🥈 Silver</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">الدولة والمنطقة</label>
                  <input type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="Brasil 🇧🇷" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">اسم الممثل القانوني</label>
                  <input type="text" value={form.representative} onChange={e => setForm({ ...form, representative: e.target.value })} placeholder="اسم ممثل الشركة" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">البريد الإلكتروني B2B</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="b2b@company.com" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">الحد الائتماني ($ Credit Limit)</label>
                  <input type="number" value={form.creditLimit} onChange={e => setForm({ ...form, creditLimit: Number(e.target.value) })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">حالة العقد (Status)</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white">
                    <option value="ACTIVE">نشط (ACTIVE)</option>
                    <option value="SUSPENDED">موقوف (SUSPENDED)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">إلغاء</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20">حفظ البيانات</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesManager;
