import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Percent, 
  Wallet,
  Building2,
  Phone,
  Mail
} from 'lucide-react';

const AgentsManager = () => {
  const { agents, companies, addAgent, updateAgent, deleteAgent, t } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<any>(null);

  const [form, setForm] = useState<any>({
    name: '',
    companyId: companies[0]?.id || 'COMP-001',
    companyName: companies[0]?.name || 'Latam Travel Brasil',
    email: '',
    phone: '',
    commissionRate: 10,
    walletBalance: 0,
    status: 'ACTIVE'
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      companyId: companies[0]?.id || 'COMP-001',
      companyName: companies[0]?.name || 'Latam Travel Brasil',
      email: '',
      phone: '',
      commissionRate: 10,
      walletBalance: 0,
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (agt: any) => {
    setEditingId(agt.id);
    setForm({
      name: agt.name || '',
      companyId: agt.companyId || '',
      companyName: agt.companyName || '',
      email: agt.email || '',
      phone: agt.phone || '',
      commissionRate: agt.commissionRate || 10,
      walletBalance: agt.walletBalance || 0,
      status: agt.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('يرجى أدخال اسم وكيل السفر');

    if (editingId) {
      updateAgent(editingId, form);
    } else {
      addAgent(form);
    }
    setIsModalOpen(false);
  };

  const filteredAgents = agents.filter((a: any) => {
    return (a.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
           (a.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
           (a.email || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalWalletBalances = agents.reduce((sum: number, a: any) => sum + Number(a.walletBalance || 0), 0);
  const avgCommission = agents.length > 0 ? (agents.reduce((sum: number, a: any) => sum + Number(a.commissionRate || 0), 0) / agents.length).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Users className="text-amber-500" />
            <span>{t('agentsManagerTitle')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('agentsManagerSubtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus size={18} />
          <span>{t('addTravelAgent')}</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('totalRegisteredAgents')}</span>
          <p className="text-3xl font-black text-white">{agents.length}</p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('avgCommissionRate')}</span>
          <p className="text-3xl font-black text-amber-400">{avgCommission}%</p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('totalWalletBalances')}</span>
          <p className="text-3xl font-black text-emerald-400">${totalWalletBalances.toLocaleString()}</p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('activeAccounts')}</span>
          <p className="text-3xl font-black text-blue-400">{agents.filter((a: any) => a.status === 'ACTIVE').length}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-4">
        <div className="relative w-full">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchAgentCompanyEmail')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* Agents Table View */}
      <div className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[750px] text-right text-sm">
            <thead className="bg-[#0d1117] text-slate-400 font-bold border-b border-slate-800 text-xs">
              <tr>
                <th className="p-4">{t('agentId')}</th>
                <th className="p-4">{t('agentName')}</th>
                <th className="p-4">{t('partnerCompany')}</th>
                <th className="p-4">{t('emailAndPhone')}</th>
                <th className="p-4">{t('commissionRate')}</th>
                <th className="p-4">{t('walletBalance')}</th>
                <th className="p-4">{t('status')}</th>
                <th className="p-4 text-center">{t('actions')}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80">
              {filteredAgents.map((agt: any) => (
                <tr key={agt.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-xs text-slate-400 font-bold">{agt.id}</td>

                  <td className="p-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-amber-400 shrink-0" />
                      <span>{agt.name}</span>
                    </div>
                  </td>

                  <td className="p-4 text-slate-300 font-semibold text-xs">
                    <span className="flex items-center gap-1">
                      <Building2 size={13} className="text-slate-400" />
                      <span>{agt.companyName}</span>
                    </span>
                  </td>

                  <td className="p-4 space-y-0.5">
                    <span className="text-xs text-slate-200 block">{agt.email}</span>
                    <span className="text-[11px] text-slate-400 font-mono block">{agt.phone}</span>
                  </td>

                  <td className="p-4 font-bold text-amber-400">{agt.commissionRate}%</td>

                  <td className="p-4 font-bold text-emerald-400">${Number(agt.walletBalance).toLocaleString()}</td>

                  <td className="p-4">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      agt.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {agt.status === 'ACTIVE' ? 'نشط (Active)' : 'موقوف (Suspended)'}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleOpenEdit(agt)} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-amber-500/20" title="تعديل">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => deleteAgent(agt.id)} className="p-2 rounded-xl bg-slate-800 text-red-400 hover:text-white hover:bg-red-500" title="حذف">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAgents.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    لا يوجد وكلاء سفر مسجلين تطابق البحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-lg w-full my-auto p-4 sm:p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">{editingId ? 'تعديل بيانات وكيل السفر' : 'إضافة وكيل سفر B2B جديد'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">اسم الوكيل (Agent Name)</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Carlos Eduardo" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">الشركة التابع لها</label>
                  <input type="text" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="CVC Viagens Brasil" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="carlos@company.com" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">رقم الهاتف / واتساب</label>
                  <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+55 11 99887-1122" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">نسبة العمولة (% Commission)</label>
                  <input type="number" value={form.commissionRate} onChange={e => setForm({ ...form, commissionRate: Number(e.target.value) })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">رصيد المحفظة ($ Wallet)</label>
                  <input type="number" value={form.walletBalance} onChange={e => setForm({ ...form, walletBalance: Number(e.target.value) })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">حالة الحساب</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white">
                  <option value="ACTIVE">نشط (ACTIVE)</option>
                  <option value="SUSPENDED">موقوف (SUSPENDED)</option>
                </select>
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

export default AgentsManager;
