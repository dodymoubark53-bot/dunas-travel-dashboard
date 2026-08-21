import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Bell, 
  Send, 
  Trash2, 
  CheckCheck, 
  Calendar, 
  Sparkles, 
  Building, 
  AlertCircle, 
  Check, 
  Users, 
  Filter, 
  X,
  Eye,
  ExternalLink,
  CheckCircle2,
  Tag,
  Briefcase,
  Info
} from 'lucide-react';

const NotificationsManager: React.FC = () => {
  const { notifications, addNotification, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, t } = useData();

  const [typeFilter, setTypeFilter] = useState('all');
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const [sendForm, setSendForm] = useState({
    title: '',
    message: '',
    type: 'Offer',
    targetAudience: 'الجميع (All Users)',
    actionLink: '/trips'
  });

  const handleOpenNotificationDetail = (notif: any) => {
    setSelectedNotification(notif);
    if (notif.status === 'Unread') {
      markNotificationAsRead(notif.id);
    }
  };

  const handleSendNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendForm.title.trim() || !sendForm.message.trim()) return alert('يرجى ملء العنوان وتفاصيل الرسالة');

    addNotification({
      title: sendForm.title,
      message: sendForm.message,
      type: sendForm.type,
      targetAudience: sendForm.targetAudience,
      actionLink: sendForm.actionLink || '/notifications'
    });

    setShowSendModal(false);
    setSendForm({
      title: '',
      message: '',
      type: 'Offer',
      targetAudience: 'الجميع (All Users)',
      actionLink: '/trips'
    });
  };

  const handleDeleteNotification = (id: string) => {
    if (confirm('هل أنت متاكد من حذف هذا التنبيه؟')) {
      deleteNotification(id);
      setSelectedNotification(null);
    }
  };

  const unreadCount = notifications.filter((n: any) => n.status === 'Unread').length;

  const filteredNotifs = notifications.filter((n: any) => {
    if (typeFilter === 'all') return true;
    return n.type === typeFilter;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Booking':
        return { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: t('newBookingLabel'), icon: <CheckCircle2 size={16} /> };
      case 'Offer':
        return { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', label: t('specialOfferLabel'), icon: <Tag size={16} /> };
      case 'B2B':
        return { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30', label: t('categoryB2b'), icon: <Briefcase size={16} /> };
      case 'System':
        return { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', label: t('categorySystem'), icon: <Info size={16} /> };
      default:
        return { bg: 'bg-slate-800 text-slate-400 border-slate-700', label: type, icon: <Bell size={16} /> };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Bell size={26} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{t('notificationsTitle')}</h1>
            <p className="text-slate-400 text-xs mt-1">
              {t('notificationsSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={markAllNotificationsAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-slate-700 cursor-pointer"
          >
            <CheckCheck size={16} className="text-emerald-400" />
            <span>{t('markAllAsRead')}</span>
          </button>

          <button
            onClick={() => setShowSendModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Send size={16} />
            <span>{t('sendNewAlert')}</span>
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex items-center justify-between bg-[#161b22] border border-slate-800 rounded-2xl p-4 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter size={15} />
          <span>{t('filterByCategory')}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: t('all') },
            { id: 'Booking', label: t('categoryBookings') },
            { id: 'Offer', label: t('categoryOffers') },
            { id: 'B2B', label: t('categoryB2b') },
            { id: 'System', label: t('categorySystem') }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all border cursor-pointer ${
                typeFilter === f.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-[#0d1117] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.map((notif: any) => {
          const badge = getTypeBadge(notif.type);
          const isUnread = notif.status === 'Unread';

          return (
            <div
              key={notif.id}
              onClick={() => handleOpenNotificationDetail(notif)}
              className={`bg-[#161b22] border rounded-3xl p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group hover:border-amber-500/60 ${
                isUnread ? 'border-amber-500/40 bg-slate-900/70 shadow-lg' : 'border-slate-800/80 opacity-90 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl border shrink-0 group-hover:scale-105 transition-transform ${badge.bg}`}>
                  {badge.icon}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-white text-sm group-hover:text-amber-400 transition-colors">
                      {notif.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1">
                      <Users size={10} />
                      <span>{notif.targetAudience || 'الجميع'}</span>
                    </span>
                    {isUnread && (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                        جديد
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl line-clamp-2">{notif.message}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{notif.date}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => handleOpenNotificationDetail(notif)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
                >
                  <Eye size={14} />
                  <span>{t('viewDetails')}</span>
                </button>

                {isUnread && (
                  <button
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 text-xs font-bold transition-all border border-emerald-500/20 cursor-pointer"
                  >
                    <Check size={14} />
                    <span>{t('readStatus')}</span>
                  </button>
                )}

                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-red-500 text-slate-400 hover:text-white transition-colors border border-slate-700 cursor-pointer"
                  title={t('deleteNotification')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredNotifs.length === 0 && (
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
            <Bell size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs font-semibold">لا توجد إشعارات أو تنبيهات مطابقة لهذه الفئة.</p>
          </div>
        )}
      </div>

      {/* NOTIFICATION DETAIL MODAL */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-xl w-full p-4 sm:p-6 space-y-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl border shrink-0 ${getTypeBadge(selectedNotification.type).bg}`}>
                  {getTypeBadge(selectedNotification.type).icon}
                </div>
                <div>
                  <h3 className="font-black text-base text-white leading-snug">{selectedNotification.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{t('notificationDetailsTitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Badges & Meta Info Row */}
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getTypeBadge(selectedNotification.type).bg}`}>
                  {getTypeBadge(selectedNotification.type).label}
                </span>
                <span className="text-xs text-slate-300 font-semibold px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                  <Users size={13} className="text-amber-400" />
                  <span>{t('targetAudienceLabel')} {selectedNotification.targetAudience || 'الجميع'}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-[11px]">{selectedNotification.date}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedNotification.status === 'Unread' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {selectedNotification.status === 'Unread' ? t('unreadMessages') : t('readStatus')}
                </span>
              </div>
            </div>

            {/* Full Message Box */}
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold block">{t('detailedNotificationContent')}</label>
              <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 text-xs text-slate-100 leading-relaxed font-sans whitespace-pre-wrap">
                {selectedNotification.message}
              </div>
            </div>

            {/* Quick Navigation Action based on Type */}
            {selectedNotification.type === 'Booking' && (
              <div className="bg-blue-950/20 border border-blue-800/40 rounded-2xl p-4 flex items-center justify-between text-xs">
                <span className="text-blue-300 font-semibold">{t('goToBookingsPrompt')}</span>
                <a
                  href="/bookings"
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold transition-all shrink-0"
                >
                  <span>{t('goToBookingsBtn')}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}

            {selectedNotification.type === 'B2B' && (
              <div className="bg-purple-950/20 border border-purple-800/40 rounded-2xl p-4 flex items-center justify-between text-xs">
                <span className="text-purple-300 font-semibold">الانتقال إلى صفحة شركات وكلاء B2B للاستعراض والتأكيد</span>
                <a
                  href="/companies"
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition-all shrink-0"
                >
                  <span>{t('goToCompaniesBtn')}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  deleteNotification(selectedNotification.id);
                  setSelectedNotification(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-xs font-bold border border-red-500/20 transition-all cursor-pointer"
              >
                <Trash2 size={14} />
                <span>{t('deleteNotification')}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                {t('closeBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEND PUSH NOTIFICATION MODAL */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-lg w-full p-4 sm:p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Send size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">إرسال إشعار وتنبيه جديد</h3>
                  <p className="text-xs text-slate-400 mt-0.5">بث التنبيه للجمهور المستهدف فوراً</p>
                </div>
              </div>
              <button onClick={() => setShowSendModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendNotificationSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">عنوان الإشعار والتنبيه *</label>
                <input
                  type="text"
                  required
                  value={sendForm.title}
                  onChange={e => setSendForm({ ...sendForm, title: e.target.value })}
                  placeholder="مثال: خصم 20% لفترة محدودة على رحلات الأقصر وأسوان"
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نوع والتصنيف</label>
                  <select
                    value={sendForm.type}
                    onChange={e => setSendForm({ ...sendForm, type: e.target.value })}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  >
                    <option value="Offer">✨ عرض خاص (Offer)</option>
                    <option value="Booking">📅 تنبيه حجز (Booking)</option>
                    <option value="B2B">🏢 شركاء B2B (B2B Partner)</option>
                    <option value="System">⚙️ تنبيه إداري (System)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الجمهور المستهدف</label>
                  <select
                    value={sendForm.targetAudience}
                    onChange={e => setSendForm({ ...sendForm, targetAudience: e.target.value })}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  >
                    <option value="All Travelers">جميع العملاء والمسافرين</option>
                    <option value="B2B Partners">شركاء الأعمال والوكلاء فقط</option>
                    <option value="Admins & Agents">فريق الإدارة والمدراء</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">نص التنبيه والإشعار التفصيلي *</label>
                <textarea
                  rows={4}
                  required
                  value={sendForm.message}
                  onChange={e => setSendForm({ ...sendForm, message: e.target.value })}
                  placeholder="اكتب تفاصيل الرسالة الإشعارية التي ستصل للمستخدمين..."
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl p-3 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Send size={15} />
                  <span>إرسال وبث الإشعار</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsManager;
