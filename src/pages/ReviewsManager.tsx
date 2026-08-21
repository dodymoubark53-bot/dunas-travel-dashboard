import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { MessageSquare, Plus, Trash2, Edit, X, Star, Calendar, User } from 'lucide-react';

const ReviewsManager = () => {
  const { reviews, trips, addReview, updateReview, deleteReview, t } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    tripId: '',
    tripTitle: '',
    author: '',
    country: 'Brazil',
    rating: 5,
    comment: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    const firstTrip = trips[0];
    setForm({
      tripId: firstTrip ? firstTrip.id : 'eg-br-001',
      tripTitle: firstTrip ? firstTrip.title : 'Cairo Express',
      author: '',
      country: 'Brazil',
      rating: 5,
      comment: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (r: any) => {
    setEditingId(r.id);
    setForm({
      tripId: r.tripId || '',
      tripTitle: r.tripTitle || '',
      author: r.author || '',
      country: r.country || '',
      rating: r.rating || 5,
      comment: r.comment || '',
      date: r.date || new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author || !form.comment) return alert('يرجى أدخال اسم الكاتب والتعليق');

    if (editingId) {
      updateReview(editingId, form);
    } else {
      addReview(form);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <MessageSquare className="text-rose-400" />
            <span>{t('reviewsManagerTitle')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('reviewsManagerSubtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm transition-all shadow-lg shadow-rose-500/20 shrink-0"
        >
          <Plus size={18} />
          <span>{t('addReview')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev: any) => (
          <div key={rev.id} className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-rose-500/30 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold border border-slate-700">
                    <User size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{rev.author}</h4>
                    <span className="text-xs text-slate-400">{rev.country}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  <Star size={13} className="fill-amber-400" />
                  <span>{rev.rating}</span>
                </div>
              </div>

              <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-3.5 space-y-1">
                <span className="text-[11px] font-bold text-rose-400 block">الرحلة: {rev.tripTitle || rev.tripId}</span>
                <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.comment}"</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {rev.date}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenEdit(rev)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"><Edit size={14} /></button>
                <button onClick={() => deleteReview(rev.id)} className="p-1.5 rounded-lg bg-slate-800 text-red-400 hover:text-white"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">{editingId ? 'تعديل التعليق' : 'إضافة تعليق جديد'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">الرحلة</label>
                <select 
                  value={form.tripId} 
                  onChange={e => {
                    const selTrip = trips.find((t: any) => t.id === e.target.value);
                    setForm({ ...form, tripId: e.target.value, tripTitle: selTrip ? selTrip.title : '' });
                  }}
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  {trips.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.title} ({t.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">اسم العميل</label>
                  <input type="text" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">البلد</label>
                  <input type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">التقييم (1-5)</label>
                  <input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={e => setForm({ ...form, rating: parseFloat(e.target.value) || 5 })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">التاريخ</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">نص التعليق</label>
                <textarea rows={3} value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} required className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">إلغاء</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-500 text-white font-bold">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsManager;
