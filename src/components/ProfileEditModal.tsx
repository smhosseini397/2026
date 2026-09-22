import React, { useRef, useState } from 'react';
import { X, Check, Sparkles, Camera, Trash2, Crown, Star, Flower2, Circle } from 'lucide-react';
import { ChildProfile } from '../types';

interface Props {
  isOpen: boolean;
  profile: ChildProfile;
  onClose: () => void;
  onSave: (updated: Partial<ChildProfile>) => void;
}

const AVATAR_CHARACTERS = [
  { emoji: '👧', label: 'دختر ناز' },
  { emoji: '👸', label: 'پرنسس' },
  { emoji: '🧚‍♀️', label: 'فرشته' },
  { emoji: '🌸', label: 'شکوفه' },
  { emoji: '🦄', label: 'تک‌شاخ' },
  { emoji: '🐱', label: 'پیشی' },
  { emoji: '🐰', label: 'خرگوش' },
  { emoji: '🦋', label: 'پروانه' },
  { emoji: '🌟', label: 'ستاره' },
  { emoji: '🍓', label: 'توت‌فرنگی' },
  { emoji: '🎨', label: 'نقاش' },
  { emoji: '🎀', label: 'پاپیون' },
];

const TITLE_PRESETS = [
  'فرشته مهربان',
  'پرنسس پرتلاش',
  'ستاره درخشان خانه',
  'قهرمان مامان و بابا',
  'دختر دانا و مؤدب',
  'الگوی مهربانی',
];

export const ProfileEditModal: React.FC<Props> = ({
  isOpen,
  profile,
  onClose,
  onSave,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(profile.photoUrl);
  const [title, setTitle] = useState(profile.title || 'فرشته مهربان');
  const [frameStyle, setFrameStyle] = useState<'star' | 'flower' | 'crown' | 'circle'>(
    profile.frameStyle || 'crown'
  );
  const [currentPoints, setCurrentPoints] = useState(profile.currentPoints);

  if (!isOpen) return null;

  // Compress & read uploaded image
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Draw to small canvas to compress image size
        const canvas = document.createElement('canvas');
        const maxDim = 240;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPhotoUrl(compressedDataUrl);
        }
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      avatar,
      photoUrl,
      title: title.trim() || 'فرشته مهربان',
      frameStyle,
      currentPoints: Number(currentPoints) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-pink-200 overflow-hidden flex flex-col max-h-[90vh]"
        id="profile-customizer-modal"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-pink-500 via-rose-500 to-amber-500 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>شخصی‌سازی آواتار و مشخصات دخترم</span>
          </h2>
          <p className="text-xs text-white/90 mt-0.5">
            عکس واقعی، کاراکتر کارتونی، قاب و عنوان دلخواه دخترتان
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Avatar Live Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative group">
              {/* Frame badge based on frameStyle */}
              {frameStyle === 'crown' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl z-10 animate-bounce">
                  👑
                </div>
              )}
              {frameStyle === 'star' && (
                <div className="absolute -top-2 -right-1 text-xl z-10">
                  ⭐
                </div>
              )}
              {frameStyle === 'flower' && (
                <div className="absolute -top-2 -right-1 text-xl z-10">
                  🌸
                </div>
              )}

              {/* Avatar Image or Emoji */}
              <div className={`w-24 h-24 rounded-3xl overflow-hidden border-4 shadow-lg flex items-center justify-center bg-linear-to-tr from-pink-100 to-amber-100 ${
                frameStyle === 'crown' ? 'border-amber-400 ring-4 ring-amber-300/30' :
                frameStyle === 'star' ? 'border-yellow-400 ring-4 ring-yellow-300/30' :
                frameStyle === 'flower' ? 'border-pink-400 ring-4 ring-pink-300/30' :
                'border-slate-300'
              }`}>
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl select-none">{avatar}</span>
                )}
              </div>

              {/* Upload photo trigger button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-md active:scale-95 transition"
                title="بارگذاری عکس واقعی از گالری"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Photo controls */}
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-200 transition"
              >
                {photoUrl ? 'تغییر عکس دخترم' : 'بارگذاری عکس دخترم از گوشی 📷'}
              </button>
              {photoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-xs text-rose-600 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition"
                  title="حذف عکس و استفاده از کاراکتر"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Character / Emoji Choices */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              یا انتخاب کاراکتر کارتونی دوست‌داشتنی:
            </label>
            <div className="grid grid-cols-6 gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200">
              {AVATAR_CHARACTERS.map((char) => (
                <button
                  type="button"
                  key={char.emoji}
                  onClick={() => {
                    setAvatar(char.emoji);
                    setPhotoUrl(undefined); // Switch back to emoji if clicked
                  }}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center hover:bg-white transition ${
                    !photoUrl && avatar === char.emoji ? 'bg-pink-200 ring-2 ring-pink-500 shadow-xs' : ''
                  }`}
                  title={char.label}
                >
                  <span className="text-2xl">{char.emoji}</span>
                  <span className="text-[10px] text-slate-600 font-medium mt-0.5 truncate max-w-full">
                    {char.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Frame Style Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">استایل قاب دور آواتار:</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'crown', label: 'تاج پرنسس', icon: Crown },
                { id: 'star', label: 'ستاره طلایی', icon: Star },
                { id: 'flower', label: 'گل شکوفه', icon: Flower2 },
                { id: 'circle', label: 'ساده مدرن', icon: Circle },
              ].map((fr) => {
                const IconComponent = fr.icon;
                const isSelected = frameStyle === fr.id;
                return (
                  <button
                    type="button"
                    key={fr.id}
                    onClick={() => setFrameStyle(fr.id as typeof frameStyle)}
                    className={`py-2 px-1.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                      isSelected
                        ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-[10px]">{fr.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daughter Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">نام دخترم:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: سارا، باران، النا..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:border-pink-500 focus:outline-hidden transition"
              id="child-name-input"
            />
          </div>

          {/* Motivational Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">لقب و عنوان انگیزشی:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: فرشته مهربان، پرنسس پرتلاش..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-pink-500 focus:outline-hidden transition mb-2"
            />
            <div className="flex flex-wrap gap-1.5">
              {TITLE_PRESETS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTitle(t)}
                  className={`text-[11px] px-2 py-1 rounded-lg border transition ${
                    title === t
                      ? 'bg-pink-100 border-pink-300 text-pink-800 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Points Adjustment */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              تنظیم دستی موجودی ستاره‌ها:
            </label>
            <input
              type="number"
              min="0"
              max="99999"
              value={currentPoints}
              onChange={(e) => setCurrentPoints(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:border-pink-500 focus:outline-hidden transition"
              id="manual-points-input"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-linear-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-pink-500/25 transition cursor-pointer"
              id="save-profile-btn"
            >
              <Check className="w-4 h-4" />
              <span>ذخیره تغییرات آواتار</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
