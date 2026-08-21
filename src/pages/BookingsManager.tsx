import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  CalendarCheck, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle, 
  DollarSign, 
  User, 
  Globe, 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  X, 
  AlertTriangle,
  FileText,
  Printer
} from 'lucide-react';

const BookingsManager = () => {
  const { bookings, trips, packages, addBooking, updateBooking, deleteBooking, t } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<any>(null);
  const [viewingBooking, setViewingBooking] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<any>(null);

  const [form, setForm] = useState<any>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerCountry: 'Brasil 🇧🇷',
    tripTitle: 'Cairo Express & Pyramids',
    tripId: 'eg-001',
    destination: 'egypt',
    travelDate: '2026-10-01',
    adults: 2,
    children: 0,
    totalAmount: 1500,
    paymentStatus: 'PAID',
    bookingStatus: 'CONFIRMED',
    specialRequests: ''
  });

  const allToursList = [
    ...trips.map((t: any) => ({ id: t.id, title: t.title, destination: t.destination, price: t.price })),
    ...packages.map((p: any) => ({ id: p.id, title: p.title, destination: p.destination, price: p.price }))
  ];

  const handleOpenAdd = () => {
    setEditingBookingId(null);
    setForm({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerCountry: 'Brasil 🇧🇷',
      tripTitle: allToursList[0]?.title || 'Cairo Express & Pyramids',
      tripId: allToursList[0]?.id || 'eg-001',
      destination: allToursList[0]?.destination || 'egypt',
      travelDate: new Date().toISOString().split('T')[0],
      adults: 2,
      children: 0,
      totalAmount: allToursList[0]?.price || 1200,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      specialRequests: ''
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (booking: any) => {
    setEditingBookingId(booking.id);
    setForm({
      customerName: booking.customerName || '',
      customerEmail: booking.customerEmail || '',
      customerPhone: booking.customerPhone || '',
      customerCountry: booking.customerCountry || 'Brasil 🇧🇷',
      tripTitle: booking.tripTitle || '',
      tripId: booking.tripId || '',
      destination: booking.destination || 'egypt',
      travelDate: booking.travelDate || '',
      adults: booking.guests?.adults || 2,
      children: booking.guests?.children || 0,
      totalAmount: booking.totalAmount || 0,
      paymentStatus: booking.paymentStatus || 'PAID',
      bookingStatus: booking.bookingStatus || 'CONFIRMED',
      specialRequests: booking.specialRequests || ''
    });
    setIsFormModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim()) return alert('يرجى أدخال اسم العميل');

    const bookingPayload = {
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      customerCountry: form.customerCountry,
      tripTitle: form.tripTitle,
      tripId: form.tripId,
      destination: form.destination,
      travelDate: form.travelDate,
      guests: { adults: parseInt(String(form.adults)) || 1, children: parseInt(String(form.children)) || 0 },
      totalAmount: parseFloat(String(form.totalAmount)) || 0,
      paymentStatus: form.paymentStatus,
      bookingStatus: form.bookingStatus,
      specialRequests: form.specialRequests
    };

    if (editingBookingId) {
      updateBooking(editingBookingId, bookingPayload);
    } else {
      addBooking(bookingPayload);
    }

    setIsFormModalOpen(false);
  };

  const handleDelete = (id: any) => {
    deleteBooking(id);
    setDeleteConfirmId(null);
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b: any) => {
    const matchesSearch = 
      b.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tripTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || b.bookingStatus === statusFilter || b.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalBookingsCount = bookings.length;
  const confirmedCount = bookings.filter((b: any) => b.bookingStatus === 'CONFIRMED').length;
  const pendingCount = bookings.filter((b: any) => b.bookingStatus === 'PENDING').length;
  const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);

  const getStatusBadge = (status: any) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"><CheckCircle size={12} /> {t('confirmed')}</span>;
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30"><Clock size={12} /> {t('pending')}</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">{t('completed')}</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30"><XCircle size={12} /> {t('cancelled')}</span>;
      default:
        return <span className="text-xs text-slate-400">{status}</span>;
    }
  };

  const getPaymentBadge = (payStatus: any) => {
    switch (payStatus) {
      case 'PAID':
        return <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">{t('paid')}</span>;
      case 'PARTIAL':
        return <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">{t('partial')}</span>;
      default:
        return <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">{t('unpaid')}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <CalendarCheck className="text-emerald-400" />
            <span>{t('bookingsManagerTitle')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('bookingsManagerSubtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus size={18} />
          <span>{t('addBooking')}</span>
        </button>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs font-semibold text-slate-400">{t('totalBookings')}</span>
          <p className="text-2xl font-black text-white">{totalBookingsCount}</p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs font-semibold text-slate-400">{t('confirmedBookings')}</span>
          <p className="text-2xl font-black text-emerald-400">{confirmedCount}</p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs font-semibold text-slate-400">{t('pendingBookings')}</span>
          <p className="text-2xl font-black text-amber-400">{pendingCount}</p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs font-semibold text-slate-400">{t('totalRevenue')}</span>
          <p className="text-2xl font-black text-amber-400">${totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#161b22] border border-slate-800 rounded-2xl p-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">{t('status')}:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 w-full sm:w-auto"
          >
            <option value="all">{t('all')} ({bookings.length})</option>
            <option value="CONFIRMED">{t('confirmed')}</option>
            <option value="PENDING">{t('pending')}</option>
            <option value="PAID">{t('paid')}</option>
            <option value="CANCELLED">{t('cancelled')}</option>
          </select>
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[750px] text-right text-sm">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="py-4 px-6">{t('bookingCode')}</th>
                <th className="py-4 px-4">{t('customerDetails')}</th>
                <th className="py-4 px-4">{t('tripOrPackage')}</th>
                <th className="py-4 px-4">{t('travelDateAndGuests')}</th>
                <th className="py-4 px-4">{t('amountAndPayment')}</th>
                <th className="py-4 px-4">{t('bookingStatus')}</th>
                <th className="py-4 px-6 text-left">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBookings.map((bk: any) => (
                <tr key={bk.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-amber-400 text-xs">
                    {bk.id}
                  </td>

                  <td className="py-4 px-4">
                    <div>
                      <h4 className="font-bold text-white text-sm">{bk.customerName}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail size={12} className="text-slate-500" />
                        <span>{bk.customerEmail}</span>
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 inline-block">{bk.customerCountry}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div>
                      <h4 className="font-semibold text-slate-200 text-xs leading-snug">{bk.tripTitle}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 uppercase mt-1 inline-block font-mono">
                        {bk.destination}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Calendar size={13} className="text-amber-500" />
                        <span>{bk.travelDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Users size={13} className="text-slate-500" />
                        <span>{bk.guests?.adults || 1} بالغين {bk.guests?.children ? `, ${bk.guests.children} أطفال` : ''}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <span className="text-sm font-black text-amber-400">${bk.totalAmount?.toLocaleString()}</span>
                      <div>{getPaymentBadge(bk.paymentStatus)}</div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    {getStatusBadge(bk.bookingStatus)}
                  </td>

                  <td className="py-4 px-6 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingBooking(bk)}
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-amber-500/20"
                        title="عرض تفاصيل الحجز والفاتورة"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(bk)}
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-amber-500/20"
                        title="تعديل الحجز"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(bk.id)}
                        className="p-2 rounded-xl bg-slate-800 text-red-400 hover:text-white hover:bg-red-500"
                        title="حذف الحجز"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    لم يتم العثور على أي حجوزات تطابق خيارات البحث الحالية.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle size={24} />
              <h3 className="font-bold text-lg text-white">تأكيد حذف الحجز</h3>
            </div>
            <p className="text-xs text-slate-300">هل أنت متاكد من حذف رقم الحجز هذا نهائياً من النظام؟</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-bold">إلغاء</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold">حذف نهائياً</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW BOOKING VOUCHER / INVOICE MODAL */}
      {viewingBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-2xl w-full my-auto shadow-2xl overflow-hidden p-4 sm:p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black">
                  DT
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">قسيمة الحجز الفاخرة (Booking Voucher)</h3>
                  <span className="text-xs font-mono text-amber-400">{viewingBooking.id}</span>
                </div>
              </div>

              <button onClick={() => setViewingBooking(null)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <div className="space-y-4 bg-[#0d1117] border border-slate-800 rounded-2xl p-5 text-sm">
              <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-slate-400 block">اسم العميل:</span>
                  <span className="font-bold text-white text-base">{viewingBooking.customerName}</span>
                  <p className="text-xs text-slate-400 mt-0.5">{viewingBooking.customerEmail}</p>
                  <p className="text-xs text-slate-400">{viewingBooking.customerPhone}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">الجنسية / البلد:</span>
                  <span className="font-bold text-amber-400">{viewingBooking.customerCountry}</span>
                </div>
              </div>

              <div className="space-y-2 border-b border-slate-800 pb-4">
                <span className="text-xs text-slate-400 block">الرحلة المحجوزة:</span>
                <h4 className="font-bold text-white text-base">{viewingBooking.tripTitle}</h4>
                <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
                  <span>تاريخ السفر: <strong className="text-amber-400">{viewingBooking.travelDate}</strong></span>
                  <span>الركاب: <strong>{viewingBooking.guests?.adults || 1} بالغين, {viewingBooking.guests?.children || 0} أطفال</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs text-slate-400 block">المبلغ الإجمالي:</span>
                  <span className="text-xl font-black text-amber-400">${viewingBooking.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="text-left space-y-1">
                  <div>{getStatusBadge(viewingBooking.bookingStatus)}</div>
                  <div>{getPaymentBadge(viewingBooking.paymentStatus)}</div>
                </div>
              </div>

              {viewingBooking.specialRequests && (
                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-xs font-bold text-slate-400 block mb-1">الطلبات والملاحظات الخاصة:</span>
                  <p className="text-xs text-slate-300 bg-[#161b22] p-3 rounded-xl border border-slate-800">{viewingBooking.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">تاريخ إنشاء الحجز: {viewingBooking.createdAt}</span>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                <Printer size={15} />
                <span>طباعة القسيمة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT BOOKING MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-2xl w-full my-auto shadow-2xl overflow-hidden p-4 sm:p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-white text-lg">{editingBookingId ? 'تعديل بيانت الحجز' : 'إنشاء حجز جديد'}</h3>
                <p className="text-xs text-slate-400 mt-0.5">إدخال تفاصيل العميل، الرحلة، والمدفوعات.</p>
              </div>

              <button onClick={() => setIsFormModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">اسم العميل (Customer Name)</label>
                  <input type="text" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" placeholder="مثال: Carlos Eduardo" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">البريد الإلكتروني (Email)</label>
                  <input type="email" value={form.customerEmail} onChange={e => setForm({ ...form, customerEmail: e.target.value })} required className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" placeholder="carlos@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">رقم الهاتف (Phone)</label>
                  <input type="text" value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" placeholder="+55 11 99999-9999" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">البلد / الجنسية (Country)</label>
                  <input type="text" value={form.customerCountry} onChange={e => setForm({ ...form, customerCountry: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" placeholder="Brasil 🇧🇷" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">الرحلة أو الباكدج المحجوز (Select Tour)</label>
                <select
                  value={form.tripId}
                  onChange={e => {
                    const sel = allToursList.find(t => t.id === e.target.value);
                    if (sel) {
                      setForm({ ...form, tripId: sel.id, tripTitle: sel.title, destination: sel.destination, totalAmount: sel.price });
                    }
                  }}
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                >
                  {allToursList.map(t => (
                    <option key={t.id} value={t.id}>{t.title} - ${t.price}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">تاريخ السفر (Date)</label>
                  <input type="date" value={form.travelDate} onChange={e => setForm({ ...form, travelDate: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">عدد البالغين (Adults)</label>
                  <input type="number" min="1" value={form.adults} onChange={e => setForm({ ...form, adults: parseInt(e.target.value) || 1 })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">عدد الأطفال (Children)</label>
                  <input type="number" min="0" value={form.children} onChange={e => setForm({ ...form, children: parseInt(e.target.value) || 0 })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">المبلغ الإجمالي ($)</label>
                  <input type="number" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">حالة الدفع (Payment Status)</label>
                  <select value={form.paymentStatus} onChange={e => setForm({ ...form, paymentStatus: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white">
                    <option value="PAID">مدفوع بالكامل (PAID)</option>
                    <option value="PARTIAL">مدفوع جزئياً (PARTIAL)</option>
                    <option value="PENDING">قيد الدفع (PENDING)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">حالة الحجز (Booking Status)</label>
                  <select value={form.bookingStatus} onChange={e => setForm({ ...form, bookingStatus: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white">
                    <option value="CONFIRMED">مؤكد (CONFIRMED)</option>
                    <option value="PENDING">قيد الانتظار (PENDING)</option>
                    <option value="COMPLETED">مكتمل (COMPLETED)</option>
                    <option value="CANCELLED">ملغي (CANCELLED)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">طلبات خاصة وملاحظات (Special Requests)</label>
                <textarea rows={3} value={form.specialRequests} onChange={e => setForm({ ...form, specialRequests: e.target.value })} placeholder="ملاحظات العميل أو ترتيبات إضافية..." className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-3 text-white" />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">إلغاء</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20">حفظ الحجز</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManager;
