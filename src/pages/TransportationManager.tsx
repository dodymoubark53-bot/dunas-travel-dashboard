import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Bus, Plus, Trash2, Edit, X, Users } from 'lucide-react';

const TransportationManager = () => {
  const { transportation, addTransport, updateTransport, deleteTransport, t } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: 'bus',
    seats: 50,
    rating: 5.0,
    pricePerDay: 0,
    image: '',
    features: ['تكييف كامل', 'واي فاي مجاني', 'سائق محترف']
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      category: 'bus',
      seats: 50,
      rating: 5.0,
      pricePerDay: 0,
      image: '/imgs/transportation/bus1.jpeg',
      features: ['تكييف كامل', 'واي فاي مجاني', 'سائق محترف', 'شاشات عرض']
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      name: item.name || '',
      category: item.category || 'bus',
      seats: item.seats || 4,
      rating: item.rating || 5.0,
      pricePerDay: item.pricePerDay || 0,
      image: item.image || '',
      features: item.features ? [...item.features] : []
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return alert('يرجى أدخال اسم المركبة');

    if (editingId) {
      updateTransport(editingId, form);
    } else {
      addTransport(form);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Bus className="text-purple-400" />
            <span>{t('transportationTitle')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('transportationSubtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-purple-500/20 shrink-0"
        >
          <Plus size={18} />
          <span>{t('addVehicle')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transportation.map((item: any) => (
          <div key={item.id} className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="h-44 bg-slate-800 relative">
                <img src={item.image || '/imgs/transportation/bus1.jpeg'} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-purple-400 border border-purple-500/30 uppercase">{item.category}</span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{item.name}</h3>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Users size={14} className="text-amber-400" />
                    <span>{item.seats} مقعد</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.features?.map((f: any, i: number) => (
                    <span key={i} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">{f}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/40">
              <span className="text-[11px] text-slate-500 font-mono">{item.id}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenEdit(item)} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"><Edit size={16} /></button>
                <button onClick={() => deleteTransport(item.id)} className="p-2 rounded-xl bg-slate-800 text-red-400 hover:text-white"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">{editingId ? 'تعديل المركبة' : 'إضافة مركبة جديدة'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">اسم المركبة</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">النوع (bus, coaster, private)</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white">
                    <option value="bus">حافلة فاخرة (Bus)</option>
                    <option value="coaster">كوستر (Coaster)</option>
                    <option value="private">سيارة خاصة (Private)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">عدد المقاعد</label>
                  <input type="number" value={form.seats} onChange={e => setForm({ ...form, seats: parseInt(e.target.value) || 4 })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">رابط الصورة</label>
                <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">إلغاء</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-500 text-slate-950 font-bold">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportationManager;
