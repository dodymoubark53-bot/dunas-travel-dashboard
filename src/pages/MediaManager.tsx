import React, { useState } from 'react';
import { useData, DESTINATIONS_LIST } from '../context/DataContext';
import { 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Play, 
  Eye, 
  X, 
  AlertTriangle,
  Globe,
  Tag,
  Film,
  Sparkles
} from 'lucide-react';

const MediaManager = () => {
  const { 
    photos, addPhoto, updatePhoto, deletePhoto,
    videos, addVideo, updateVideo, deleteVideo,
    t 
  } = useData();

  const [activeTab, setActiveTab] = useState('photos'); // 'photos' | 'videos'
  const [searchQuery, setSearchQuery] = useState('');
  const [destFilter, setDestFilter] = useState('all');

  // Modal States
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [photoForm, setPhotoForm] = useState({ title: '', src: '', dest: 'egypt', tag: 'Photo' });

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [videoForm, setVideoForm] = useState({ title: '', description: '', publicId: '', dest: 'egypt', thumbnail: '' });

  const [deleteConfirmObj, setDeleteConfirmObj] = useState<any>(null); // { id, type: 'photo' | 'video' }
  const [previewMedia, setPreviewMedia] = useState<any>(null); // { type: 'photo' | 'video', url, title }

  // --- PHOTO HANDLERS ---
  const handleOpenAddPhoto = () => {
    setEditingPhotoId(null);
    setPhotoForm({
      title: '',
      src: '',
      dest: 'egypt',
      tag: 'Photo'
    });
    setIsPhotoModalOpen(true);
  };

  const handleOpenEditPhoto = (photo: any) => {
    setEditingPhotoId(photo.id);
    setPhotoForm({
      title: photo.title || '',
      src: photo.src || '',
      dest: photo.dest || 'egypt',
      tag: photo.tag || 'Photo'
    });
    setIsPhotoModalOpen(true);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title.trim() || !photoForm.src.trim()) return alert('يرجى كتابة عنوان الصورة ورابطها');

    if (editingPhotoId) {
      updatePhoto(editingPhotoId, photoForm);
    } else {
      addPhoto(photoForm);
    }
    setIsPhotoModalOpen(false);
  };

  // --- VIDEO HANDLERS ---
  const handleOpenAddVideo = () => {
    setEditingVideoId(null);
    setVideoForm({
      title: '',
      description: '',
      publicId: '',
      dest: 'egypt',
      thumbnail: ''
    });
    setIsVideoModalOpen(true);
  };

  const handleOpenEditVideo = (video: any) => {
    setEditingVideoId(video.id);
    setVideoForm({
      title: video.title || '',
      description: video.description || '',
      publicId: video.publicId || '',
      dest: video.dest || 'egypt',
      thumbnail: video.thumbnail || ''
    });
    setIsVideoModalOpen(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title.trim()) return alert('يرجى كتابة عنوان الفيديو');

    if (editingVideoId) {
      updateVideo(editingVideoId, videoForm);
    } else {
      addVideo(videoForm);
    }
    setIsVideoModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmObj) return;
    if (deleteConfirmObj.type === 'photo') {
      deletePhoto(deleteConfirmObj.id);
    } else {
      deleteVideo(deleteConfirmObj.id);
    }
    setDeleteConfirmObj(null);
  };

  // Filter Photos & Videos
  const filteredPhotos = photos.filter((p: any) => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.src || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDest = destFilter === 'all' || (p.dest || '').toLowerCase() === destFilter.toLowerCase();
    return matchesSearch && matchesDest;
  });

  const filteredVideos = videos.filter((v: any) => {
    const matchesSearch = (v.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (v.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDest = destFilter === 'all' || (v.dest || '').toLowerCase() === destFilter.toLowerCase();
    return matchesSearch && matchesDest;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Film className="text-purple-400" />
            <span>{t('mediaLibraryTitle')}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {t('mediaLibrarySubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'photos' ? (
            <button
              onClick={handleOpenAddPhoto}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 shrink-0"
            >
              <Plus size={18} />
              <span>{t('addPhoto')}</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddVideo}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm transition-all shadow-lg shadow-purple-500/20 shrink-0"
            >
              <Plus size={18} />
              <span>{t('addVideo')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Bar (Photos vs Videos) */}
      <div className="flex items-center justify-between bg-[#161b22] border border-slate-800 rounded-2xl p-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('photos')}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all
              ${activeTab === 'photos'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }
            `}
          >
            <ImageIcon size={16} />
            <span>{t('photosTab')}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-900/60 text-[10px]">{photos.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all
              ${activeTab === 'videos'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }
            `}
          >
            <VideoIcon size={16} />
            <span>{t('videosTab')}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-900/60 text-[10px]">{videos.length}</span>
          </button>
        </div>
      </div>

      {/* Search & Destination Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#161b22] border border-slate-800 rounded-2xl p-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchPhotoOrUrl')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">الوجهة:</span>
          <select
            value={destFilter}
            onChange={(e) => setDestFilter(e.target.value)}
            className="bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 w-full sm:w-auto"
          >
            <option value="all">كل الوجهات والأنواع</option>
            <option value="egypt">🇪🇬 مصر (Egypt)</option>
            <option value="turkey">🇹🇷 تركيا (Turkey)</option>
            <option value="jordan">🇯🇴 الأردن (Jordan)</option>
            <option value="morocco">🇲🇦 المغرب (Morocco)</option>
            <option value="greece">🇬🇷 اليونان (Greece)</option>
            <option value="dubai">🇦🇪 دبي (Dubai)</option>
            <option value="tunisia">🇹🇳 تونس (Tunisia)</option>
            <option value="holyland">🕊️ الأرض المقدسة (Holy Land)</option>
            <option value="colombia">🇨🇴 كولومبيا (Colombia)</option>
            <option value="gallery">معرض عام (Gallery)</option>
          </select>
        </div>
      </div>

      {/* PHOTOS TAB CONTENT */}
      {activeTab === 'photos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo: any) => (
            <div 
              key={photo.id}
              className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden group hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-48 bg-slate-900 relative overflow-hidden">
                  <img 
                    src={photo.src} 
                    alt={photo.title || 'Photo'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-amber-400 border border-amber-500/30 uppercase">
                    {photo.dest || 'Gallery'}
                  </span>
                  
                  <button 
                    onClick={() => setPreviewMedia({ type: 'photo', url: photo.src, title: photo.title })}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                  >
                    <Eye size={24} />
                  </button>
                </div>

                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-white text-sm line-clamp-1">{photo.title || 'صورة بدون عنوان'}</h4>
                  <span className="text-[11px] text-slate-400 block font-mono truncate">{photo.src}</span>
                </div>
              </div>

              <div className="p-3 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/40">
                <span className="text-[10px] text-slate-500 font-mono">{photo.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditPhoto(photo)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-amber-500/20"
                    title="تعديل الصورة"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmObj({ id: photo.id, type: 'photo' })}
                    className="p-2 rounded-xl bg-slate-800 text-red-400 hover:text-white hover:bg-red-500"
                    title="حذف الصورة"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredPhotos.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-[#161b22] border border-slate-800 rounded-3xl">
              لا توجد صور مضافة تطابق البحث. يمكنك إضافة صورة جديدة.
            </div>
          )}
        </div>
      )}

      {/* VIDEOS TAB CONTENT */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video: any) => (
            <div 
              key={video.id}
              className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden group hover:border-purple-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  <img 
                    src={video.thumbnail || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button 
                      onClick={() => setPreviewMedia({ type: 'video', url: video.publicId, title: video.title })}
                      className="w-12 h-12 rounded-full bg-purple-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                    >
                      <Play size={20} className="mr-0.5" />
                    </button>
                  </div>
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-purple-400 border border-purple-500/30 uppercase">
                    {video.dest || 'VIDEO'}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h4 className="font-bold text-white text-base leading-snug">{video.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{video.description}</p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/40">
                <span className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">{video.publicId}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditVideo(video)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-purple-500/20"
                    title="تعديل الفيديو"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmObj({ id: video.id, type: 'video' })}
                    className="p-2 rounded-xl bg-slate-800 text-red-400 hover:text-white hover:bg-red-500"
                    title="حذف الفيديو"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredVideos.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-[#161b22] border border-slate-800 rounded-3xl">
              لا توجد فيديوهات مضافة تطابق البحث.
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmObj && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle size={24} />
              <h3 className="font-bold text-lg text-white">تأكيد الحذف</h3>
            </div>
            <p className="text-xs text-slate-300">
              هل أنت متاكد من حذف هذا العنصر ({deleteConfirmObj.type === 'photo' ? 'الصورة' : 'الفيديو'}) نهائياً من معرض الوسائط؟
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirmObj(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-bold">إلغاء</button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold">حذف نهائياً</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PHOTO MODAL */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-md w-full my-auto shadow-2xl p-4 sm:p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">{editingPhotoId ? 'تعديل بيانات الصورة' : 'إضافة صورة جديدة للمعرض'}</h3>
              <button onClick={() => setIsPhotoModalOpen(false)} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">عنوان الصورة (Title)</label>
                <input type="text" value={photoForm.title} onChange={e => setPhotoForm({ ...photoForm, title: e.target.value })} placeholder="مثال: أهرامات الجيزة العظيمة" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">رابط الصورة (Image URL)</label>
                <input type="text" value={photoForm.src} onChange={e => setPhotoForm({ ...photoForm, src: e.target.value })} required placeholder="https://res.cloudinary.com/..." className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">الوجهة (Destination)</label>
                  <select value={photoForm.dest} onChange={e => setPhotoForm({ ...photoForm, dest: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white">
                    <option value="egypt">🇪🇬 مصر (Egypt)</option>
                    <option value="turkey">🇹🇷 تركيا (Turkey)</option>
                    <option value="jordan">🇯🇴 الأردن (Jordan)</option>
                    <option value="morocco">🇲🇦 المغرب (Morocco)</option>
                    <option value="greece">🇬🇷 اليونان (Greece)</option>
                    <option value="dubai">🇦🇪 دبي (Dubai)</option>
                    <option value="tunisia">🇹🇳 تونس (Tunisia)</option>
                    <option value="holyland">🕊️ الأرض المقدسة (Holy Land)</option>
                    <option value="gallery">معرض عام (Gallery)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">الوسم (Tag)</label>
                  <input type="text" value={photoForm.tag} onChange={e => setPhotoForm({ ...photoForm, tag: e.target.value })} placeholder="Photo / Luxury" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
                </div>
              </div>

              {photoForm.src && (
                <div className="h-36 bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                  <img src={photoForm.src} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsPhotoModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">إلغاء</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20">حفظ الصورة</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT VIDEO MODAL */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#161b22] border border-slate-800 rounded-3xl max-w-md w-full my-auto shadow-2xl p-4 sm:p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">{editingVideoId ? 'تعديل بيانات الفيديو' : 'إضافة فيديو جديد للمكتبة'}</h3>
              <button onClick={() => setIsVideoModalOpen(false)} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">عنوان الفيديو (Video Title)</label>
                <input type="text" value={videoForm.title} onChange={e => setVideoForm({ ...videoForm, title: e.target.value })} required placeholder="مثال: Dinner with Partners in Bogotá" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white" />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">معرف الفيديو أو الرابط (Cloudinary Public ID / URL)</label>
                <input type="text" value={videoForm.publicId} onChange={e => setVideoForm({ ...videoForm, publicId: e.target.value })} required placeholder="Public ID / URL" className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs" />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">الوصف التفصيلي للفيديو (Description)</label>
                <textarea rows={3} value={videoForm.description} onChange={e => setVideoForm({ ...videoForm, description: e.target.value })} placeholder="وصف محتوى الفيديو..." className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-3 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">الوجهة (Destination)</label>
                  <select value={videoForm.dest} onChange={e => setVideoForm({ ...videoForm, dest: e.target.value })} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white">
                    <option value="egypt">🇪🇬 مصر (Egypt)</option>
                    <option value="turkey">🇹🇷 تركيا (Turkey)</option>
                    <option value="jordan">🇯🇴 الأردن (Jordan)</option>
                    <option value="morocco">🇲🇦 المغرب (Morocco)</option>
                    <option value="greece">🇬🇷 اليونان (Greece)</option>
                    <option value="dubai">🇦🇪 دبي (Dubai)</option>
                    <option value="tunisia">🇹🇳 تونس (Tunisia)</option>
                    <option value="holyland">🕊️ الأرض المقدسة (Holy Land)</option>
                    <option value="colombia">🇨🇴 كولومبيا (Colombia)</option>
                    <option value="global">عام (Global)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">رابط صورة الغلاف (Thumbnail)</label>
                  <input type="text" value={videoForm.thumbnail} onChange={e => setVideoForm({ ...videoForm, thumbnail: e.target.value })} placeholder="https://..." className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs" />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsVideoModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">إلغاء</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-500 text-white font-bold shadow-lg shadow-purple-500/20">حفظ الفيديو</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEDIA PREVIEW LIGHTBOX */}
      {previewMedia && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setPreviewMedia(null)}>
          <div className="relative max-w-4xl w-full bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">{previewMedia.title || 'معاينة الوسائط'}</h3>
              <button onClick={() => setPreviewMedia(null)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <div className="p-4 flex items-center justify-center bg-black min-h-[300px]">
              {previewMedia.type === 'photo' ? (
                <img src={previewMedia.url} alt={previewMedia.title} className="max-h-[70vh] object-contain rounded-xl" />
              ) : (
                <div className="text-center p-8 space-y-4">
                  <Play size={48} className="text-purple-400 mx-auto" />
                  <p className="text-sm font-bold text-white">{previewMedia.title}</p>
                  <p className="text-xs text-slate-400 font-mono bg-slate-900 p-3 rounded-xl border border-slate-800">Public ID: {previewMedia.url}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManager;
