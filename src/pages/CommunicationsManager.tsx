import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  Mail, 
  Phone, 
  Globe, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Send, 
  X, 
  Filter, 
  UserCheck, 
  ExternalLink,
  MessageCircle,
  Inbox
} from 'lucide-react';

const CommunicationsManager: React.FC = () => {
  const { communications, updateCommunication, deleteCommunication, addCommunication, t } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const [selectedComm, setSelectedComm] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [assignedAgent, setAssignedAgent] = useState('فريق خدمة المبيعات');
  const [newCommModal, setNewCommModal] = useState(false);

  // New manual inquiry form
  const [newForm, setNewForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    country: 'Egypt 🇪🇬',
    subject: '',
    message: '',
    source: 'Website Contact Form',
    status: 'Unread',
    assignedTo: 'فريق خدمة المبيعات'
  });

  // Calculate Metrics
  const totalCount = communications.length;
  const unreadCount = communications.filter((c: any) => c.status === 'Unread').length;
  const inProgressCount = communications.filter((c: any) => c.status === 'In Progress').length;
  const resolvedCount = communications.filter((c: any) => c.status === 'Resolved').length;

  // Filtered Communications
  const filteredComms = communications.filter((c: any) => {
    const matchesSearch = 
      (c.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.country || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || c.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleOpenDetail = (comm: any) => {
    setSelectedComm(comm);
    setReplyText('');
    setAssignedAgent(comm.assignedTo || 'فريق خدمة المبيعات');
    if (comm.status === 'Unread') {
      updateCommunication(comm.id, { status: 'In Progress' });
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComm) return;
    updateCommunication(selectedComm.id, {
      status: 'Resolved',
      replySent: replyText,
      assignedTo: assignedAgent,
      resolvedAt: new Date().toLocaleString()
    });
    alert('تم حفظ الرد وتحديث حالة الرسالة إلى "مكتمل ومجاب" بنجاح!');
    setSelectedComm(null);
  };

  const handleCreateCommunication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.customerName || !newForm.message) return alert('يرجى ملء البيانات الرئيسية');
    addCommunication(newForm);
    setNewCommModal(false);
    setNewForm({
      customerName: '',
      email: '',
      phone: '',
      country: 'Brasil 🇧🇷',
      subject: 'استفسار جديد',
      message: '',
      source: 'Website Contact Form',
      status: 'Unread',
      assignedTo: 'فريق خدمة المبيعات'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Mail className="text-amber-500" size={28} />
            <span>{t('communicationsTitle')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('communicationsSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setNewCommModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
        >
          <MessageCircle size={18} />
          <span>{t('addManualInquiry')}</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">{t('totalMessagesInquiries')}</p>
            <h3 className="text-2xl font-black text-white mt-1">{totalCount}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Inbox size={22} />
          </div>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">{t('unreadMessagesCount')}</p>
            <h3 className="text-2xl font-black text-rose-400 mt-1">{unreadCount}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle size={22} />
          </div>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">{t('inProgressPreparing')}</p>
            <h3 className="text-2xl font-black text-amber-400 mt-1">{inProgressCount}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">{t('completedAndAnswered')}</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{resolvedCount}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle size={22} />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#161b22] border border-slate-800 rounded-2xl p-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchNameEmailSubject')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter size={14} />
            <span>{t('status')}:</span>
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
          >
            <option value="all">جميع الحالات</option>
            <option value="Unread">🔴 غير مقروء (Unread)</option>
            <option value="In Progress">🟡 قيد المتابعة (In Progress)</option>
            <option value="Resolved">🟢 مكتمل ومجاب (Resolved)</option>
          </select>

          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
          >
            <option value="all">كل المصادر</option>
            <option value="Website Contact Form">🌐 نموذج الموقع</option>
            <option value="WhatsApp">💬 واتساب مباشر</option>
            <option value="Email Direct">✉️ بريد مباشر</option>
          </select>
        </div>
      </div>

      {/* Communications Table */}
      <div className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[700px] text-right text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-[11px] uppercase font-semibold">
              <tr>
                <th className="py-4 px-6">{t('customerAndSource')}</th>
                <th className="py-4 px-4">{t('subjectAndMessage')}</th>
                <th className="py-4 px-4">{t('assignedAndFollowup')}</th>
                <th className="py-4 px-4">{t('dateTime')}</th>
                <th className="py-4 px-4">{t('status')}</th>
                <th className="py-4 px-6 text-left">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredComms.map((comm: any) => (
                <tr key={comm.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm hover:text-amber-400 transition-colors">
                        {comm.customerName}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{comm.country || 'عام'}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-amber-400/90 font-medium">{comm.source}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">{comm.email}</p>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="space-y-1 max-w-sm">
                      <p className="font-bold text-slate-200 line-clamp-1">{comm.subject}</p>
                      <p className="text-slate-400 line-clamp-2 text-[11px]">{comm.message}</p>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-[11px]">
                      <UserCheck size={12} className="text-amber-400" />
                      <span>{comm.assignedTo || 'غير محدد'}</span>
                    </span>
                  </td>

                  <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                    {comm.date}
                  </td>

                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${
                      comm.status === 'Unread' 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                        : comm.status === 'In Progress'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        comm.status === 'Unread' ? 'bg-rose-400 animate-pulse' : comm.status === 'In Progress' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                      <span>{comm.status === 'Unread' ? t('unreadMessages') : comm.status === 'In Progress' ? t('inProgressStatus') : t('completedAndAnswered')}</span>
                    </span>
                  </td>

                  <td className="py-4 px-6 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenDetail(comm)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
                      >
                        <MessageSquare size={14} />
                        <span>{t('previewAndReply')}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('هل أنت متاكد من حذف هذا الاستفسار نهائياً؟')) deleteCommunication(comm.id);
                        }}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-500 text-slate-400 hover:text-white transition-colors border border-slate-700 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredComms.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    لا توجد استفسارات أو رسائل مطابقة لخيارات البحث المحددة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL & QUICK REPLY MODAL */}
      {selectedComm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedComm.subject}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">تفاصيل الاستفسار والرد الفوري من خدمة العملاء</p>
                </div>
              </div>
              <button onClick={() => setSelectedComm(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {/* Customer Info Card */}
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div>
                  <h4 className="font-extrabold text-white text-sm">{selectedComm.customerName}</h4>
                  <span className="text-xs text-amber-400">{selectedComm.country}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{selectedComm.date}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail size={14} className="text-amber-400" />
                  <a href={`mailto:${selectedComm.email}`} className="hover:underline font-mono text-amber-400">{selectedComm.email}</a>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone size={14} className="text-amber-400" />
                  <a href={`https://wa.me/${(selectedComm.phone || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:underline font-mono text-emerald-400 flex items-center gap-1">
                    <span>{selectedComm.phone}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* Original Message Box */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs font-bold">نص الرسالة والاستفسار الأصلي:</label>
              <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 leading-relaxed font-sans">
                {selectedComm.message}
              </div>
            </div>

            {/* Previous Reply if exists */}
            {selectedComm.replySent && (
              <div className="space-y-1.5">
                <label className="text-emerald-400 text-xs font-bold">الرد الصادر السابق ({selectedComm.resolvedAt}):</label>
                <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-4 text-xs text-emerald-200 leading-relaxed">
                  {selectedComm.replySent}
                </div>
              </div>
            )}

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">تحديد الموظف المتابع (Assign Agent)</label>
                  <select
                    value={assignedAgent}
                    onChange={e => setAssignedAgent(e.target.value)}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="فريق خدمة المبيعات">فريق خدمة المبيعات</option>
                    <option value="Attia Yamany">Attia Yamany - المدير العام</option>
                    <option value="قسم الحسابات والمالية">قسم الحسابات والمالية</option>
                    <option value="خدمة العملاء واللغات">خدمة العملاء واللغات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">تحديث حالة الاستفسار</label>
                  <select
                    value={selectedComm.status}
                    onChange={e => setSelectedComm({ ...selectedComm, status: e.target.value })}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Unread">🔴 غير مقروء (Unread)</option>
                    <option value="In Progress">🟡 قيد المتابعة (In Progress)</option>
                    <option value="Resolved">🟢 مكتمل ومجاب (Resolved)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-bold mb-1">صياغة الرد الرسمي وإرساله للعميل:</label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="اكتب ردك التفصيلي هنا لإرساله وتوثيقه في السجل..."
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl p-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedComm(null)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  إغلاق
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Send size={15} />
                  <span>إرسال وتوثيق الرد</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW MANUAL INQUIRY MODAL */}
      {newCommModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-lg text-white">تسجيل استفسار أو اتصال جديد يدوي</h3>
              <button onClick={() => setNewCommModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCommunication} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">اسم العميل *</label>
                <input type="text" required value={newForm.customerName} onChange={e => setNewForm({ ...newForm, customerName: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2.5 text-white" placeholder="اسم العميل الكامل" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">البريد الإلكتروني</label>
                  <input type="email" value={newForm.email} onChange={e => setNewForm({ ...newForm, email: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2.5 text-white" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">رقم الهاتف/الواتساب</label>
                  <input type="text" value={newForm.phone} onChange={e => setNewForm({ ...newForm, phone: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2.5 text-white" placeholder="+20 100 123 4567" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الدولة/البلد</label>
                  <input type="text" value={newForm.country} onChange={e => setNewForm({ ...newForm, country: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2.5 text-white" placeholder="Spain 🇪🇸" />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">مصدر الاتصال</label>
                  <select value={newForm.source} onChange={e => setNewForm({ ...newForm, source: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2.5 text-white">
                    <option value="Website Contact Form">🌐 نموذج الموقع</option>
                    <option value="WhatsApp">💬 واتساب</option>
                    <option value="Email Direct">✉️ بريد مباشر</option>
                    <option value="Phone Call">📞 مكالمة هاتفية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">موضوع الاستفسار *</label>
                <input type="text" required value={newForm.subject} onChange={e => setNewForm({ ...newForm, subject: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2.5 text-white" placeholder="مثال: حجز برنامج الأهرامات لـ 3 أشخاص" />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">تفاصيل الرسالة *</label>
                <textarea rows={3} required value={newForm.message} onChange={e => setNewForm({ ...newForm, message: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-3 text-white" placeholder="نص استفسار العميل..." />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setNewCommModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">إلغاء</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20">حفظ الاستفسار</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationsManager;
