import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Percent,
  CalendarCheck,
  Building2,
  Users
} from 'lucide-react';

const CommissionsManager = () => {
  const { commissions, addCommission, updateCommission, deleteCommission, agents, bookings, t } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<any>(null);

  const [form, setForm] = useState<any>({
    bookingId: 'DUNAS-BK-1001',
    agentName: 'Carlos Eduardo Santos',
    companyName: 'CVC Viagens Brasil',
    bookingAmount: 2670,
    rate: 12,
    earnedAmount: 320.40,
    status: 'APPROVED',
    payoutDate: '2026-08-30'
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      bookingId: bookings[0]?.id || 'DUNAS-BK-1001',
      agentName: agents[0]?.name || 'Carlos Eduardo Santos',
      companyName: agents[0]?.companyName || 'CVC Viagens Brasil',
      bookingAmount: 2670,
      rate: 12,
      earnedAmount: 320.40,
      status: 'APPROVED',
      payoutDate: '2026-08-30'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comm: any) => {
    setEditingId(comm.id);
    setForm({
      bookingId: comm.bookingId || '',
      agentName: comm.agentName || '',
      companyName: comm.companyName || '',
      bookingAmount: comm.bookingAmount || 0,
      rate: comm.rate || 10,
      earnedAmount: comm.earnedAmount || 0,
      status: comm.status || 'APPROVED',
      payoutDate: comm.payoutDate || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedEarned = (Number(form.bookingAmount) * Number(form.rate)) / 100;
    const finalForm = { ...form, earnedAmount: calculatedEarned };

    if (editingId) {
      updateCommission(editingId, finalForm);
    } else {
      addCommission(finalForm);
    }
    setIsModalOpen(false);
  };

  const filteredCommissions = commissions.filter((c: any) => {
    const matchesSearch = (c.agentName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (c.bookingId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.companyName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCommissions = commissions.reduce((sum: number, c: any) => sum + Number(c.earnedAmount || 0), 0);
  const pendingCommissions = commissions.filter((c: any) => c.status === 'PENDING').reduce((sum: number, c: any) => sum + Number(c.earnedAmount || 0), 0);
  const approvedCommissions = commissions.filter((c: any) => c.status === 'APPROVED' || c.status === 'PAID').reduce((sum: number, c: any) => sum + Number(c.earnedAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <DollarSign className="text-amber-500" />
            <span>{t('commissionsManagerTitle')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('commissionsManagerSubtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus size={18} />
          <span>{t('addCommissionRecord')}</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('totalDueCommissions')}</span>
          <p className="text-3xl font-black text-amber-400">${totalCommissions.toLocaleString()}</p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('pendingReviewCommissions')}</span>
          <p className="text-3xl font-black text-yellow-400">${pendingCommissions.toLocaleString()}</p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('approvedPaidCommissions')}</span>
          <p className="text-3xl font-black text-emerald-400">${approvedCommissions.toLocaleString()}</p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{t('nextPayoutCycle')}</span>
          <p className="text-2xl font-black text-blue-400">30 أغسطس 2026</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#161b22] border border-slate-800 rounded-2xl p-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="البحث باسم الوكيل، رقم الحجز، أو اسم الشركة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">الحالة:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 w-full sm:w-auto"
          >
            <option value="ALL">جميع الحالات</option>
            <option value="APPROVED">معتمدة ومصروفة (APPROVED)</option>
            <option value="PENDING">قيد المراجعة (PENDING)</option>
            <option value="REJECTED">مرفوضة (REJECTED)</option>
          </select>
        </div>
      </div>

      {/* Commissions Table View */}
      <div className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[750px] text-right text-sm">
            <thead className="bg-[#0d1117] text-slate-400 font-bold border-b border-slate-800 text-xs">
              <tr>
                <th className="p-4">{t('transactionId')}</th>
                <th className="p-4">{t('linkedBookingId')}</th>
                <th className="p-4">{t('agentAndCompany')}</th>
                <th className="p-4">{t('totalBookingAmount')}</th>
                <th className="p-4">{t('commissionRate')}</th>
                <th className="p-4">{t('commissionAmountUSD')}</th>
                <th className="p-4">{t('payoutStatus')}</th>
                <th className="p-4">{t('payoutDate')}</th>
                <th className="p-4 text-center">{t('actions')}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80">
              {filteredCommissions.map((comm: any) => (
                <tr key={comm.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-xs text-slate-400 font-bold">{comm.id}</td>

                  <td className="p-4 font-mono text-xs text-amber-400 font-bold">{comm.bookingId}</td>

                  <td className="p-4 space-y-0.5">
                    <span className="font-bold text-white block text-xs">{comm.agentName}</span>
                    <span className="text-[11px] text-slate-400 block">{comm.companyName}</span>
                  </td>

                  <td className="p-4 font-bold text-slate-200">${Number(comm.bookingAmount).toLocaleString()}</td>

                  <td className="p-4 font-bold text-blue-400">{comm.rate}%</td>

                  <td className="p-4 font-bold text-amber-400 text-base">${Number(comm.earnedAmount).toLocaleString()}</td>

                  <td className="p-4">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      comm.status === 'APPROVED' || comm.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      comm.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {comm.status}
                    </span>
                  </td>

                  <td className="p-4 text-xs text-slate-400 font-mono">{comm.payoutDate || '2026-08-30'}</td>

                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleOpenEdit(comm)} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-amber-500/20" title="تعديل">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => deleteCommission(comm.id)} className="p-2 rounded-xl bg-slate-800 text-red-400 hover:text-white hover:bg-red-500" title="حذف">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCommissions.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    لا توجد سجلات عمولات تطابق البحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Commission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-lg w-full my-auto p-4 sm:p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">{editingId ? 'تعديل بيانات العمولة' : 'إضافة سجل عمولة جديد'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">رقم الحجز المرتبط (Booking ID)</label>
                  <input type="text" value={form.bookingId} onChange={e => setForm({ ...form, bookingId: e.target.value })} required placeholder="DUNAS-BK-1001" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">اسم الوكيل المستحق</label>
                  <input type="text" value={form.agentName} onChange={e => setForm({ ...form, agentName: e.target.value })} required placeholder="Carlos Eduardo" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">اسم الشركة الشريكة</label>
                  <input type="text" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="CVC Viagens" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">إجمالي الحجز ($)</label>
                  <input type="number" value={form.bookingAmount} onChange={e => setForm({ ...form, bookingAmount: Number(e.target.value) })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">نسبة العمولة (%)</label>
                  <input type="number" value={form.rate} onChange={e => setForm({ ...form, rate: Number(e.target.value) })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">تاريخ الصرف</label>
                  <input type="date" value={form.payoutDate} onChange={e => setForm({ ...form, payoutDate: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">حالة الصرف</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white">
                  <option value="APPROVED">معتمدة ومصروفة (APPROVED)</option>
                  <option value="PENDING">قيد المراجعة والصرف (PENDING)</option>
                  <option value="REJECTED">مرفوضة (REJECTED)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">إلغاء</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20">حفظ العمولة</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionsManager;
