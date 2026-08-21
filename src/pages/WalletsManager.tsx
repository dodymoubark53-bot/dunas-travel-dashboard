import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Wallet, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Building2,
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const WalletsManager = () => {
  const { wallets, addWallet, updateWallet, deleteWallet, topUpWallet, withdrawWallet, agents, t } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<any>(null);

  // Top Up & Withdraw Modal States
  const [topUpModal, setTopUpModal] = useState<any>(null); // wallet obj
  const [topUpAmount, setTopUpAmount] = useState<number | string>(500);

  const [withdrawModal, setWithdrawModal] = useState<any>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<number | string>(200);

  const [form, setForm] = useState<any>({
    agentName: agents[0]?.name || 'Carlos Eduardo Santos',
    companyName: agents[0]?.companyName || 'CVC Viagens Brasil',
    balance: 1000,
    totalDeposited: 1000,
    totalWithdrawn: 0,
    status: 'ACTIVE'
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      agentName: agents[0]?.name || 'Carlos Eduardo Santos',
      companyName: agents[0]?.companyName || 'CVC Viagens Brasil',
      balance: 1000,
      totalDeposited: 1000,
      totalWithdrawn: 0,
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (wlt: any) => {
    setEditingId(wlt.id);
    setForm({
      agentName: wlt.agentName || '',
      companyName: wlt.companyName || '',
      balance: wlt.balance || 0,
      totalDeposited: wlt.totalDeposited || 0,
      totalWithdrawn: wlt.totalWithdrawn || 0,
      status: wlt.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agentName.trim()) return alert('يرجى أدخال اسم صاحب المحفظة');

    if (editingId) {
      updateWallet(editingId, form);
    } else {
      addWallet(form);
    }
    setIsModalOpen(false);
  };

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpModal) return;
    const num = Number(topUpAmount);
    if (isNaN(num) || num <= 0) return alert('يرجى أدخال مبلغ شحن صحيح');

    topUpWallet(topUpModal.id, num);
    setTopUpModal(null);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawModal) return;
    const num = Number(withdrawAmount);
    if (isNaN(num) || num <= 0) return alert('يرجى أدخال مبلغ سحب صحيح');
    if (num > Number(withdrawModal.balance)) return alert('مبلغ السحب أكبر من الرصيد المتاح!');

    withdrawWallet(withdrawModal.id, num);
    setWithdrawModal(null);
  };

  const filteredWallets = wallets.filter((w: any) => {
    return (w.agentName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
           (w.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
           (w.id || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalBalance = wallets.reduce((sum: number, w: any) => sum + Number(w.balance || 0), 0);
  const totalDeposited = wallets.reduce((sum: number, w: any) => sum + Number(w.totalDeposited || 0), 0);
  const totalWithdrawn = wallets.reduce((sum: number, w: any) => sum + Number(w.totalWithdrawn || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Wallet className="text-amber-500" />
            <span>{t('walletsManagerTitle')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('walletsManagerSubtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus size={18} />
          <span>{t('addDigitalWallet')}</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('totalWalletBalances')}</span>
          <p className="text-3xl font-black text-emerald-400">${totalBalance.toLocaleString()}</p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('totalTopupsCommissions')}</span>
          <p className="text-3xl font-black text-blue-400">${totalDeposited.toLocaleString()}</p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('totalWithdrawnAmounts')}</span>
          <p className="text-3xl font-black text-amber-400">${totalWithdrawn.toLocaleString()}</p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('activeOpenWallets')}</span>
          <p className="text-3xl font-black text-purple-400">{wallets.filter((w: any) => w.status === 'ACTIVE').length}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-4">
        <div className="relative w-full">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchAgentCompanyWallet')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* Wallets Table View */}
      <div className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[750px] text-right text-sm">
            <thead className="bg-[#0d1117] text-slate-400 font-bold border-b border-slate-800 text-xs">
              <tr>
                <th className="p-4">{t('walletCode')}</th>
                <th className="p-4">{t('agentName')}</th>
                <th className="p-4">{t('partnerCompany')}</th>
                <th className="p-4">{t('availableBalanceUSD')}</th>
                <th className="p-4">{t('totalTopupUSD')}</th>
                <th className="p-4">{t('totalWithdrawalsUSD')}</th>
                <th className="p-4">{t('status')}</th>
                <th className="p-4 text-center">{t('actions')}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80">
              {filteredWallets.map((wlt: any) => (
                <tr key={wlt.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-xs text-slate-400 font-bold">{wlt.id}</td>

                  <td className="p-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <Wallet size={16} className="text-emerald-400 shrink-0" />
                      <span>{wlt.agentName}</span>
                    </div>
                  </td>

                  <td className="p-4 text-slate-300 font-semibold text-xs">{wlt.companyName}</td>

                  <td className="p-4 font-black text-emerald-400 text-base">
                    ${Number(wlt.balance).toLocaleString()}
                  </td>

                  <td className="p-4 font-bold text-blue-400">
                    <span className="flex items-center gap-1">
                      <ArrowDownLeft size={14} className="text-blue-400" />
                      <span>${Number(wlt.totalDeposited).toLocaleString()}</span>
                    </span>
                  </td>

                  <td className="p-4 font-bold text-amber-400">
                    <span className="flex items-center gap-1">
                      <ArrowUpRight size={14} className="text-amber-400" />
                      <span>${Number(wlt.totalWithdrawn).toLocaleString()}</span>
                    </span>
                  </td>

                  <td className="p-4">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      wlt.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {wlt.status === 'ACTIVE' ? 'نشطة (ACTIVE)' : 'موقوفة (SUSPENDED)'}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setTopUpModal(wlt)} 
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 text-xs font-bold hover:text-slate-950 transition-all flex items-center gap-1"
                        title="شحن محفظة"
                      >
                        <Plus size={14} />
                        <span>{t('topUpBtn')}</span>
                      </button>
                      <button onClick={() => handleOpenEdit(wlt)} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-amber-500/20" title="تعديل">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => deleteWallet(wlt.id)} className="p-2 rounded-xl bg-slate-800 text-red-400 hover:text-white hover:bg-red-500" title="حذف">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredWallets.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    لا توجد محافظ شريكة تطابق محددات البحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Up Wallet Modal */}
      {topUpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-md w-full p-4 sm:p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">شحن رصيد المحفظة المالية</h3>
              <button onClick={() => setTopUpModal(null)} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleTopUpSubmit} className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-[11px] text-slate-400 block">المحفظة المستهدفة</span>
                <p className="font-bold text-white text-sm">{topUpModal.agentName}</p>
                <span className="text-xs text-emerald-400 font-bold">الرصيد الحالي: ${Number(topUpModal.balance).toLocaleString()}</span>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">المبلغ المراد شحنه ($ Amount)</label>
                <input 
                  type="number" 
                  value={topUpAmount} 
                  onChange={e => setTopUpAmount(e.target.value)} 
                  required 
                  min={1} 
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-3 text-white font-mono text-base font-bold" 
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setTopUpModal(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">إلغاء</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20">تأكيد شحن الرصيد</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Wallet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-lg w-full my-auto p-4 sm:p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">{editingId ? 'تعديل المحفظة المالية' : 'إضافة محفظة رقمية جديدة'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">اسم الوكيل صاحب المحفظة</label>
                  <input type="text" value={form.agentName} onChange={e => setForm({ ...form, agentName: e.target.value })} required placeholder="Carlos Eduardo" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">اسم الشركة الشريكة</label>
                  <input type="text" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="CVC Viagens" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">الرصيد المتاح ($)</label>
                  <input type="number" value={form.balance} onChange={e => setForm({ ...form, balance: Number(e.target.value) })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">إجمالي الشحن ($)</label>
                  <input type="number" value={form.totalDeposited} onChange={e => setForm({ ...form, totalDeposited: Number(e.target.value) })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">المسحوبات ($)</label>
                  <input type="number" value={form.totalWithdrawn} onChange={e => setForm({ ...form, totalWithdrawn: Number(e.target.value) })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">حالة المحفظة</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white">
                  <option value="ACTIVE">نشطة (ACTIVE)</option>
                  <option value="SUSPENDED">موقوفة (SUSPENDED)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">إلغاء</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20">حفظ المحفظة</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletsManager;
