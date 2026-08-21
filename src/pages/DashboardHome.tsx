import React, { useState } from 'react';
import { useData, DESTINATIONS_LIST } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Compass, 
  Package, 
  Hotel, 
  Bus, 
  MessageSquare, 
  Plus, 
  Eye, 
  Star, 
  Calendar, 
  Edit, 
  Award,
  CalendarCheck,
  Film,
  UserCheck,
  DollarSign,
  TrendingUp,
  Globe,
  Building2,
  Bell,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  ShieldCheck,
  FileText,
  BarChart3,
  ArrowUpRight,
  PieChart
} from 'lucide-react';

const DashboardHome: React.FC = () => {
  const { 
    trips, 
    packages, 
    hotels, 
    transportation, 
    reviews, 
    bookings, 
    photos, 
    videos, 
    communications, 
    notifications, 
    companies, 
    agents, 
    getPopularTrips, 
    t 
  } = useData();

  const [selectedYear, setSelectedYear] = useState('2026');

  const popularTrips = getPopularTrips().slice(0, 6);
  const recentBookings = bookings.slice(0, 5);
  const recentComms = communications.slice(0, 4);

  // Calculate Metrics
  const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.totalAmount || b.price || 0), 0);
  const unreadComms = communications.filter((c: any) => c.status === 'Unread').length;
  const unreadNotifs = notifications.filter((n: any) => n.status === 'Unread').length;

  // Monthly Revenue Chart Data
  const monthlyRevenueData = [
    { month: 'يناير', rev: 22400, bookings: 14, growth: '+8%' },
    { month: 'فبراير', rev: 28100, bookings: 18, growth: '+12%' },
    { month: 'مارس', rev: 34500, bookings: 22, growth: '+15%' },
    { month: 'أبريل', rev: 31000, bookings: 19, growth: '-4%' },
    { month: 'مايو', rev: 42800, bookings: 27, growth: '+24%' },
    { month: 'يونيو', rev: 46200, bookings: 30, growth: '+10%' },
    { month: 'يوليو', rev: 52000, bookings: 34, growth: '+18%' },
    { month: 'أغسطس', rev: 58400, bookings: 38, growth: '+22%', active: true }
  ];

  const maxRevenue = Math.max(...monthlyRevenueData.map(d => d.rev));

  const statsCards = [
    { 
      label: t('totalBookings'), 
      value: bookings.length, 
      subtext: `+12% ${t('thisMonthGrowth')}`, 
      icon: CalendarCheck, 
      color: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30', 
      link: '/bookings' 
    },
    { 
      label: t('totalBookingsRevenue'), 
      value: `$${totalRevenue.toLocaleString()}`, 
      subtext: t('ascendingGrowth'), 
      icon: DollarSign, 
      color: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30', 
      link: '/bookings' 
    },
    { 
      label: t('activeTrips'), 
      value: trips.length, 
      subtext: t('translated5Langs'), 
      icon: Compass, 
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30', 
      link: '/trips' 
    },
    { 
      label: t('specialPackages'), 
      value: packages.length, 
      subtext: t('egyptVipPrograms'), 
      icon: Package, 
      color: 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30', 
      link: '/packages' 
    },
    { 
      label: t('customerInquiries'), 
      value: communications.length, 
      subtext: `${unreadComms} ${t('unreadMessages')}`, 
      icon: MessageSquare, 
      color: 'from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/30', 
      link: '/communications' 
    },
    { 
      label: t('b2bSectionTitle'), 
      value: (companies.length + agents.length), 
      subtext: t('b2bPartnersNetwork'), 
      icon: Building2, 
      color: 'from-indigo-500/20 to-indigo-600/10 text-indigo-400 border-indigo-500/30', 
      link: '/companies' 
    },
    { 
      label: t('approvedHotels'), 
      value: hotels.length, 
      subtext: t('partnerHotelsStars'), 
      icon: Hotel, 
      color: 'from-teal-500/20 to-teal-600/10 text-teal-400 border-teal-500/30', 
      link: '/hotels' 
    },
    { 
      label: t('notifications'), 
      value: notifications.length, 
      subtext: `${unreadNotifs} ${t('newAlerts')}`, 
      icon: Bell, 
      color: 'from-amber-500/20 to-amber-600/10 text-amber-300 border-amber-500/30', 
      link: '/notifications' 
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="welcome-banner-card relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#161b22] to-[#161b22] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <ShieldCheck size={16} />
              <span>{t('welcomeUser')}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t('dashboardCentralTitle')}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {t('dashboardCentralDescription')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/content"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0d1117] hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-all shadow-md"
            >
              <FileText size={16} className="text-amber-400" />
              <span>إدارة المحتوى (CMS)</span>
            </Link>

            <Link
              to="/bookings"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0d1117] hover:bg-slate-800 text-emerald-400 border border-slate-700 font-bold text-xs transition-all shadow-md"
            >
              <CalendarCheck size={16} />
              <span>{t('bookings')} ({bookings.length})</span>
            </Link>

            <Link
              to="/trips"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus size={16} />
              <span>{t('addTrip')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.link}
              className="group bg-[#161b22] border border-slate-800 rounded-3xl p-5 hover:border-amber-500/40 transition-all duration-300 shadow-xl flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-semibold">{stat.label}</span>
                <p className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                  {stat.value}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">{stat.subtext}</p>
              </div>

              <div className={`w-12 h-12 rounded-2xl bg-[#0d1117] border flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform shrink-0`}>
                <Icon size={22} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Destinations Quick Bar (الواجهات الـ 8) */}
      <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <Globe className="text-amber-400" size={20} />
            <h2 className="text-base font-bold text-white">{t('destinationsApprovedTitle')}</h2>
          </div>
          <Link to="/destinations" className="text-xs font-bold text-amber-400 hover:underline">
            {t('viewAll')}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {DESTINATIONS_LIST.map((dest: any) => {
            const count = trips.filter((t: any) => (t.destination || '').toLowerCase() === dest.id.toLowerCase()).length;
            return (
              <Link
                key={dest.id}
                to={`/trips?dest=${dest.id}`}
                className="bg-[#0d1117] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-3 text-center space-y-1 transition-all group"
              >
                <div className="text-2xl group-hover:scale-110 transition-transform">{dest.flag}</div>
                <h4 className="font-bold text-white text-xs group-hover:text-amber-400 transition-colors">{dest.nameAr}</h4>
                <p className="text-[10px] text-slate-500 font-mono">{count} {t('toursCountLabel')}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* REVENUE TREND & MONTHLY ANALYTICS SECTION (اتجاه الإيرادات والنمو) */}
      <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <BarChart3 size={20} />
              </div>
              <h2 className="text-lg font-black text-white">{t('revenueTrendTitle')}</h2>
            </div>
            <p className="text-slate-400 text-xs">
              {t('revenueTrendSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {['2026', '2025', 'آخر 6 أشهر'].map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedYear === year
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105'
                    : 'bg-[#0d1117] text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Financial Highlights Sub-Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-slate-400 font-semibold">{t('monthlySalesRate')}</span>
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-black text-white">$39,425/شهر</h4>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-0.5">
                <ArrowUpRight size={14} />
                <span>+18.4%</span>
              </span>
            </div>
          </div>

          <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-slate-400 font-semibold">{t('avgBookingValue')}</span>
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-black text-amber-400">$1,850</h4>
              <span className="text-slate-400 text-[11px]">{t('perBooker')}</span>
            </div>
          </div>

          <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-slate-400 font-semibold">{t('topRevenueDest')}</span>
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-black text-white">🇪🇬 مصر (Egypt)</h4>
              <span className="text-amber-400 font-bold">48%</span>
            </div>
          </div>

          <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-slate-400 font-semibold">{t('bookingConversionRate')}</span>
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-black text-emerald-400">92.5%</h4>
              <span className="text-emerald-400 font-bold text-[11px]">{t('completedConfirmed')}</span>
            </div>
          </div>
        </div>

        {/* Main Interactive Bar Chart & Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Bar Chart Container (2 Columns) */}
          <div className="lg:col-span-2 bg-[#0d1117] border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" />
                <span className="font-bold text-slate-200">{t('revenueChartTitle')}</span>
              </div>
              <span className="text-slate-500 font-mono">{t('augustHighestGrowth')}</span>
            </div>

            {/* Bars Visualization */}
            <div className="h-64 pt-6 pb-2 flex items-end justify-between gap-2 sm:gap-4 border-b border-slate-800 px-2">
              {monthlyRevenueData.map((item, idx) => {
                const heightPercent = Math.round((item.rev / maxRevenue) * 100);
                const isPeak = item.active;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-slate-700 text-white px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold whitespace-nowrap shadow-xl z-20 pointer-events-none">
                      <div>${item.rev.toLocaleString()}</div>
                      <div className="text-amber-400 text-[9px]">{item.bookings} {t('bookingsCountSuffix')} ({item.growth})</div>
                    </div>

                    {/* Bar Line */}
                    <div className="w-full flex items-end justify-center h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[38px] rounded-t-xl transition-all duration-500 relative group-hover:scale-y-[1.05] ${
                          isPeak
                            ? 'bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 shadow-lg shadow-amber-500/30'
                            : 'bg-gradient-to-t from-slate-800 via-slate-700 to-slate-600 hover:from-amber-600/60 hover:to-amber-400/60'
                        }`}
                      >
                        {isPeak && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded border border-amber-500/30 whitespace-nowrap">
                            {t('peakLabel')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Month Label */}
                    <span className={`text-[11px] font-bold ${isPeak ? 'text-amber-400' : 'text-slate-400'}`}>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
              <span>$0</span>
              <span>$15,000</span>
              <span>$30,000</span>
              <span>$45,000</span>
              <span>$60,000 max</span>
            </div>
          </div>

          {/* Revenue Breakdown by Destination Side Panel (1 Column) */}
          <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <PieChart size={16} className="text-amber-400" />
              <h3 className="font-bold text-white text-xs">{t('revenueByDest8')}</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              {[
                { name: '🇪🇬 مصر والرحلات النيلية', percent: 48, amount: '$28,032', color: 'bg-amber-500' },
                { name: '🇹🇷 تركيا وكابادوكيا', percent: 22, amount: '$12,848', color: 'bg-blue-500' },
                { name: '🇯🇴 الأردن والبتراء', percent: 15, amount: '$8,760', color: 'bg-emerald-500' },
                { name: '🇲🇦 المغرب واليونان ودبي', percent: 10, amount: '$5,840', color: 'bg-purple-500' },
                { name: '🇹🇳 تونس والأرض المقدسة', percent: 5, amount: '$2,920', color: 'bg-rose-500' }
              ].map((dest, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-200 text-[11px]">{dest.name}</span>
                    <span className="font-mono text-amber-400 font-bold">{dest.amount} ({dest.percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${dest.color} rounded-full`} style={{ width: `${dest.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <Link
                to="/bookings"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
              >
                <span>{t('fullFinancialReports')}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout: Recent Bookings & Customer Communications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table (2 Columns) */}
        <div className="lg:col-span-2 bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CalendarCheck className="text-emerald-400" size={20} />
                <span>{t('recentBookings')}</span>
              </h2>
              <p className="text-slate-400 text-xs">{t('recentBookingsSubtitle')}</p>
            </div>

            <Link to="/bookings" className="text-xs font-bold text-emerald-400 hover:underline">
              {t('allBookingsLink')} ({bookings.length}) ←
            </Link>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[550px] text-right text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">{t('bookingCode')}</th>
                  <th className="py-3 px-4">{t('customerDetails')}</th>
                  <th className="py-3 px-4">{t('tripOrPackage')}</th>
                  <th className="py-3 px-4">{t('price')} ($)</th>
                  <th className="py-3 px-4">{t('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentBookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{b.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-white">{b.customerName || 'مسافر مجهول'}</p>
                        <p className="text-[10px] text-slate-500">{b.country || 'عام'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium line-clamp-1">{b.tripTitle || b.programName || 'برنامج سياحي'}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">${b.totalAmount || b.price || 0}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {b.status || t('confirmed')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Inquiries Sidebar (1 Column) */}
        <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="text-amber-400" size={20} />
              <span>{t('customerInquiries')}</span>
            </h2>

            <Link to="/communications" className="text-xs font-bold text-amber-400 hover:underline">
              {t('all')} ({communications.length}) ←
            </Link>
          </div>

          <div className="space-y-3">
            {recentComms.map((comm: any) => (
              <div key={comm.id} className="bg-[#0d1117] border border-slate-800 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs">{comm.customerName}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    comm.status === 'Unread' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {comm.status === 'Unread' ? t('unreadMessages') : t('answered')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-semibold line-clamp-1">{comm.subject}</p>
                <p className="text-[10px] text-slate-500 font-mono">{comm.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Trips Section */}
      <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="text-red-500 animate-pulse" size={22} />
              <span>{t('topPopularTrips')}</span>
            </h2>
            <p className="text-slate-400 text-xs">
              {t('popularSubtitle')}
            </p>
          </div>

          <Link
            to="/trips"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0"
          >
            <span>إدارة جميع الرحلات</span>
            <span>←</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTrips.map((trip: any, rank: number) => (
            <div 
              key={trip.id}
              className="bg-[#0d1117] border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="h-44 bg-slate-800 relative overflow-hidden">
                  <img 
                    src={trip.images?.[0] || 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80'} 
                    alt={trip.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 text-xs font-black px-3 py-1 rounded-full bg-slate-950/90 text-amber-400 border border-amber-500/40 backdrop-blur-sm shadow-md">
                    #{rank + 1} 🔥
                  </span>

                  <span className="absolute bottom-3 left-3 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-950/80 text-white border border-slate-700 uppercase">
                    {trip.destination || 'عام'}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{trip.duration || '4 Days'}</span>
                    <span className="font-bold text-amber-400 text-base">${trip.price}</span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-amber-400 transition-colors">
                    {trip.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80 text-slate-400">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star size={14} className="fill-amber-400" />
                      <span className="font-bold">{trip.rating || 5.0}</span>
                      <span className="text-slate-500">({trip.reviewCount || 0})</span>
                    </div>

                    <span>{trip.inquiries || 12} طلب استفسار</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">ID: {trip.id}</span>
                <Link
                  to={`/trips?edit=${trip.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-amber-400 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs transition-all border border-slate-700"
                >
                  <Edit size={14} />
                  <span>تعديل التفاصيل والترجمات</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
