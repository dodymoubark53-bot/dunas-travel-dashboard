import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  LayoutDashboard, 
  User,
  CalendarCheck,
  Globe, 
  Compass, 
  Package, 
  Film,
  Hotel,
  FileText,
  Bus, 
  MessageSquare, 
  Building2,
  Users,
  DollarSign,
  Wallet,
  Menu, 
  X, 
  Sparkles,
  Bell,
  Languages,
  Sun,
  Moon
} from 'lucide-react';

const LANGUAGES_LIST = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' }
];

const DashboardLayout = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { bookings, photos, videos, adminProfile, companies, agents, communications, notifications, theme, toggleTheme, dashboardLang, setDashboardLang, t } = useData();

  // Scroll to top automatically whenever route/pathname changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const totalMediaCount = (photos?.length || 0) + (videos?.length || 0);

  const mainNavItems = [
    { name: t('home'), path: '/', icon: LayoutDashboard, badge: t('home') },
    { name: t('bookings'), path: '/bookings', icon: CalendarCheck, badge: `${bookings?.length || 0}` },
    { name: t('destinations'), path: '/destinations', icon: Globe, badge: '8' },
    { name: t('trips'), path: '/trips', icon: Compass },
    { name: t('packages'), path: '/packages', icon: Package },
    { name: t('media'), path: '/media', icon: Film, badge: `${totalMediaCount}` },
    { name: t('hotels'), path: '/hotels', icon: Hotel },
    { name: t('contentManager'), path: '/content', icon: FileText, badge: 'CMS' },
    { name: t('communications'), path: '/communications', icon: MessageSquare, badge: `${communications?.length || 0}` },
    { name: t('notifications'), path: '/notifications', icon: Bell, badge: `${notifications?.filter((n: any) => n.status === 'Unread').length || 0}` },
    { name: t('transportation'), path: '/transportation', icon: Bus },
    { name: t('reviews'), path: '/reviews', icon: MessageSquare },
  ];

  const b2bNavItems = [
    { name: t('companies'), path: '/companies', icon: Building2, badge: `${companies?.length || 0}` },
    { name: t('agents'), path: '/agents', icon: Users, badge: `${agents?.length || 0}` },
    { name: t('commissions'), path: '/finance/commissions', icon: DollarSign },
    { name: t('wallets'), path: '/finance/wallet', icon: Wallet },
    { name: t('profile'), path: '/profile', icon: User, badge: 'Admin' },
  ];

  const isRtl = dashboardLang === 'ar';

  return (
    <div className={`min-h-screen bg-[#0d1117] text-slate-100 flex flex-col font-sans ${isRtl ? 'dir-rtl' : 'dir-ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Header Bar */}
      <header className="h-16 bg-[#161b22] border-b border-slate-800 px-3 sm:px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {/* OFFICIAL DUNAS TRAVEL LOGO IMAGE */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img 
              src="https://res.cloudinary.com/degbrq3ck/image/upload/v1783033035/dunas-travel-logo-removebg-preview_mjfl90.png" 
              alt="Dunas Travel" 
              className="h-8 sm:h-10 w-auto object-contain hover:scale-105 transition-transform" 
            />
            <span className="hidden md:inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {t('adminSuite')}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* THEME TOGGLE BUTTON (LIGHT/DARK MODE) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-amber-400 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shrink-0"
            title={theme === 'dark' ? 'التحويل للوضع الفاتح (Light Mode)' : 'التحويل للوضع الداكن (Dark Mode)'}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={17} className="text-amber-400 animate-pulse" />
                <span className="hidden md:inline text-slate-200 text-[11px]">الوضع الفاتح</span>
              </>
            ) : (
              <>
                <Moon size={17} className="text-indigo-400" />
                <span className="hidden md:inline text-slate-200 text-[11px]">الوضع الداكن</span>
              </>
            )}
          </button>

          {/* 5-LANGUAGE SWITCHER DROPDOWN */}
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-1.5 sm:px-2 py-1 shrink-0">
            <Languages size={15} className="text-amber-400 mx-0.5 sm:mx-1 shrink-0" />
            <select
              value={dashboardLang}
              onChange={(e) => setDashboardLang(e.target.value)}
              className="bg-transparent text-[11px] sm:text-xs font-bold text-slate-200 focus:outline-none cursor-pointer pr-1 max-w-[90px] sm:max-w-none"
            >
              {LANGUAGES_LIST.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-[#161b22] text-white">
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          <button className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 transition-colors shrink-0">
            <Bell size={17} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
          </button>

          {/* ADMIN PROFILE AVATAR & NAME */}
          <Link to="/profile" className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2 sm:px-3 py-1.5 rounded-xl hover:border-amber-500/40 transition-colors shrink-0">
            <img 
              src={adminProfile?.avatar || 'https://res.cloudinary.com/tibx70zb/image/upload/v1787135165/ef80aed2-87a9-410f-a561-9dd5e04370b3_xffzmg.jpg'} 
              alt={adminProfile?.name} 
              className="w-7 h-7 rounded-full object-cover border border-amber-500/50"
            />
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block leading-none">{adminProfile?.name || 'Attia Yamany'}</span>
              <span className="text-[10px] text-amber-400 font-semibold">{adminProfile?.role || 'Super Admin'}</span>
            </div>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside className={`
          fixed lg:static inset-y-0 ${isRtl ? 'right-0 border-l' : 'left-0 border-r'} z-50 w-72 bg-[#161b22] border-slate-800/80 
          transform ${sidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')} lg:translate-x-0 
          transition-transform duration-300 ease-in-out flex flex-col justify-between p-4 top-16 lg:top-0 h-[calc(100vh-4rem)] lg:h-auto overflow-y-auto custom-scrollbar
        `}>
          <div className="space-y-6">
            {/* Main Operations Group */}
            <div className="space-y-1.5">
              <div className="px-3 pt-2 pb-1">
                <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                  {t('adminSuite')}
                </p>
              </div>

              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      group flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/5 font-semibold' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'} />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${isActive ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* B2B Enterprise & Finance Group */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="px-3 py-1">
                <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                  {t('b2bSectionTitle')}
                </p>
              </div>

              {b2bNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      group flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/5 font-semibold' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'} />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${isActive ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2 mt-6">
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles size={16} />
              <span className="text-xs font-bold">Dunas Travel Suite</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Attia Yamany • General Director
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main ref={mainRef} className="flex-1 bg-[#0d1117] overflow-y-auto p-3 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
