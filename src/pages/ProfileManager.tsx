import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  User, 
  ShieldCheck, 
  KeyRound, 
  Bell, 
  Globe, 
  Camera, 
  CheckCircle, 
  Mail, 
  Phone, 
  Sparkles,
  Lock,
  Smartphone,
  Laptop,
  Save,
  Check
} from 'lucide-react';

const ProfileManager = () => {
  const { adminProfile, updateProfile, t } = useData();

  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'security' | 'notifications'
  const [successMessage, setSuccessMessage] = useState('');

  const defaultAvatar = 'https://res.cloudinary.com/tibx70zb/image/upload/v1787135165/ef80aed2-87a9-410f-a561-9dd5e04370b3_xffzmg.jpg';

  // Personal Info Form State
  const [infoForm, setInfoForm] = useState<any>({
    name: adminProfile.name || 'Attia Yamany',
    email: adminProfile.email || 'attia@dunastravel.com',
    phone: adminProfile.phone || '+20 100 123 4567',
    role: adminProfile.role || 'المدير العام (Super Admin)',
    avatar: adminProfile.avatar || defaultAvatar,
    language: adminProfile.language || 'ar',
    timezone: adminProfile.timezone || 'Africa/Cairo (GMT+3)',
    bio: adminProfile.bio || ''
  });

  // Password Security Form State
  const [passForm, setPassForm] = useState<any>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: adminProfile.twoFactor ?? true
  });

  // Notifications Form State
  const [notifForm, setNotifForm] = useState<any>({
    emailNotifications: adminProfile.emailNotifications ?? true,
    systemAlerts: adminProfile.systemAlerts ?? true
  });

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(infoForm);
    setSuccessMessage('تم تحديث البيانات الشخصية بنجاح!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword && passForm.newPassword !== passForm.confirmPassword) {
      return alert('كلمتا المرور الجديدة والتأكيد غير متطابقتين!');
    }
    updateProfile({ twoFactor: passForm.twoFactor });
    setSuccessMessage('تم تحديث إعدادات الأمان وكلمة المرور بنجاح!');
    setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactor: passForm.twoFactor });
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(notifForm);
    setSuccessMessage('تم حفظ تفضيلات الإشعارات بنجاح!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <User className="text-amber-500" />
            <span>{t('adminProfileTitle')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('adminProfileSubtitle')}
          </p>
        </div>

        {successMessage && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-2 rounded-2xl animate-fade-in">
            <CheckCircle size={16} />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Admin Profile Overview Hero Card */}
      <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500 shadow-xl bg-slate-900">
              <img 
                src={infoForm.avatar || defaultAvatar} 
                alt={infoForm.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <button 
              onClick={() => {
                const newUrl = prompt('أدخل رابط الصورة الشخصية الجديدة (URL):', infoForm.avatar);
                if (newUrl) setInfoForm({ ...infoForm, avatar: newUrl });
              }}
              className="absolute bottom-0 left-0 p-2 rounded-full bg-amber-500 text-slate-950 shadow-lg hover:bg-amber-400 transition-transform hover:scale-110"
              title="تغيير الصورة الشخصية"
            >
              <Camera size={14} />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-white">{infoForm.name}</h2>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {infoForm.role}
              </span>
            </div>

            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-2">
              <Mail size={13} className="text-amber-500" />
              <span>{infoForm.email}</span>
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <ShieldCheck size={13} />
                <span>{t('verifiedAccount')}</span>
              </span>
              <span>•</span>
              <span>{t('timezoneLabel')} {infoForm.timezone}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-semibold">{t('accountStatusLabel')}</span>
            <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('activeAndEnabled')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center bg-[#161b22] border border-slate-800 rounded-2xl p-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('info')}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap
            ${activeTab === 'info' 
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }
          `}
        >
          <User size={16} />
          <span>{t('tabPersonalInfo')}</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap
            ${activeTab === 'security' 
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }
          `}
        >
          <KeyRound size={16} />
          <span>{t('tabSecurity')}</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap
            ${activeTab === 'notifications' 
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }
          `}
        >
          <Bell size={16} />
          <span>{t('tabNotificationPreferences')}</span>
        </button>
      </div>

      {/* TAB 1: PERSONAL INFO */}
      {activeTab === 'info' && (
        <form onSubmit={handleSaveInfo} className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6 text-xs">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
            <User size={18} className="text-amber-400" />
            <span>{t('editPersonalInfoTitle')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">{t('fullNameLabel')}</label>
              <input 
                type="text" 
                value={infoForm.name} 
                onChange={e => setInfoForm({ ...infoForm, name: e.target.value })} 
                required 
                className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" 
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">{t('emailAddressLabel')}</label>
              <input 
                type="email" 
                value={infoForm.email} 
                onChange={e => setInfoForm({ ...infoForm, email: e.target.value })} 
                required 
                className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">{t('phoneNumberLabel')}</label>
              <input 
                type="text" 
                value={infoForm.phone} 
                onChange={e => setInfoForm({ ...infoForm, phone: e.target.value })} 
                className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" 
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">{t('roleAndTitleLabel')}</label>
              <input 
                type="text" 
                value={infoForm.role} 
                onChange={e => setInfoForm({ ...infoForm, role: e.target.value })} 
                className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">{t('preferredLanguageLabel')}</label>
              <select 
                value={infoForm.language} 
                onChange={e => setInfoForm({ ...infoForm, language: e.target.value })} 
                className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              >
                <option value="ar">🇸🇦 العربية (Arabic)</option>
                <option value="pt">🇵🇹 البرتغالية (Português)</option>
                <option value="es">🇪🇸 الإسبانية (Español)</option>
                <option value="en">🇬🇧 الإنجليزية (English)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">{t('timezoneAndRegionLabel')}</label>
              <select 
                value={infoForm.timezone} 
                onChange={e => setInfoForm({ ...infoForm, timezone: e.target.value })} 
                className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              >
                <option value="Africa/Cairo (GMT+3)">Africa/Cairo (القاهرة GMT+3)</option>
                <option value="Europe/Madrid (GMT+2)">Europe/Madrid (مدريد GMT+2)</option>
                <option value="America/Sao_Paulo (GMT-3)">America/Sao_Paulo (ساو باولو GMT-3)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">{t('bioAndNotesLabel')}</label>
            <textarea 
              rows={3} 
              value={infoForm.bio} 
              onChange={e => setInfoForm({ ...infoForm, bio: e.target.value })} 
              className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-3 text-white" 
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button 
              type="submit" 
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 shadow-lg shadow-amber-500/20"
            >
              <Save size={16} />
              <span>{t('saveChangesBtn')}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <form onSubmit={handleSaveSecurity} className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6 text-xs">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
            <KeyRound size={18} className="text-amber-400" />
            <span>تحديث كلمة المرور وإعدادات الأمان</span>
          </h3>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">كلمة المرور الحالية</label>
              <input 
                type="password" 
                value={passForm.currentPassword} 
                onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })} 
                placeholder="••••••••" 
                className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" 
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">كلمة المرور الجديدة</label>
              <input 
                type="password" 
                value={passForm.newPassword} 
                onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} 
                placeholder="••••••••" 
                className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" 
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">تأكيد كلمة المرور الجديدة</label>
              <input 
                type="password" 
                value={passForm.confirmPassword} 
                onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })} 
                placeholder="••••••••" 
                className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm">المصادقة الثنائية والجلسات النشطة</h4>
            
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-white block">تفعيل المصادقة الثنائية (2FA Security)</span>
                <p className="text-slate-400 text-[11px]">حماية إضافية للحساب عبر إرسال كود التحقق عند تسجيل الدخول.</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={passForm.twoFactor} 
                  onChange={e => setPassForm({ ...passForm, twoFactor: e.target.checked })} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 space-y-3">
              <span className="font-bold text-white block">الجلسات المتصلة حالياً (Active Sessions)</span>
              
              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <Laptop size={18} className="text-amber-400" />
                  <div>
                    <span className="font-bold text-white block">Chrome on Windows (هذا الجهاز)</span>
                    <span className="text-[10px] text-slate-500">Cairo, Egypt • 192.168.1.10</span>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-bold">نشط الآن</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button 
              type="submit" 
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 shadow-lg shadow-amber-500/20"
            >
              <Save size={16} />
              <span>تحديث كلمة المرور والأمان</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: NOTIFICATIONS & PREFERENCES */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6 text-xs">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
            <Bell size={18} className="text-amber-400" />
            <span>تفضيلات الإشعارات والتنبيهات</span>
          </h3>

          <div className="space-y-4">
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">تنبيهات الحجوزات الجديدة بالبريد (Email Alerts)</span>
                <p className="text-slate-400 text-[11px]">إرسال إيميل فوري عند إتمام أي حجز جديد بواسطة عميل.</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifForm.emailNotifications} 
                  onChange={e => setNotifForm({ ...notifForm, emailNotifications: e.target.checked })} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">تنبيهات النظام والاستفسارات (System Alerts)</span>
                <p className="text-slate-400 text-[11px]">عرض الإشعارات الصوتية والفورية داخل لوحة التحكم.</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifForm.systemAlerts} 
                  onChange={e => setNotifForm({ ...notifForm, systemAlerts: e.target.checked })} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button 
              type="submit" 
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 shadow-lg shadow-amber-500/20"
            >
              <Save size={16} />
              <span>حفظ تفضيلات الإشعارات</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileManager;
