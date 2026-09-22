import React, { useState } from 'react';
import { X, Plus, Sparkles, AlertTriangle } from 'lucide-react';
import { BehaviorCategory, BehaviorItem } from '../types';
import { toPersianDigits } from '../utils/storage';

interface Props {
  isOpen: boolean;
  initialCategory: BehaviorCategory;
  onClose: () => void;
  onSave: (item: Omit<BehaviorItem, 'id'>) => void;
}

const COMMON_EMOJIS = [
  '🪥', '🧸', '📚', '🌙', '🤝', '🍎', '💖', '📖',
  '🎨', '👗', '🧼', '🚴‍♀️', '🎵', '🧩', '🧹', '🥗',
  '😤', '📱', '🌪️', '⏰', '🥦', '⚠️', '💤', '🛑'
];

export const AddBehaviorModal: React.FC<Props> = ({
  isOpen,
  initialCategory,
  onClose,
  onSave,
}) => {
  const [category, setCategory] = useState<BehaviorCategory>(initialCategory);
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState<number>(10);
  const [icon, setIcon] = useState('🌟');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      category,
      points: Number(points) || 5,
      icon: icon || (category === 'good' ? '⭐' : '⚠️'),
      description: description.trim() || undefined,
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[90vh]"
        id="add-behavior-modal"
      >
        {/* Header */}
        <div className={`p-5 text-white relative ${
          category === 'good'
            ? 'bg-linear-to-r from-emerald-500 to-teal-500'
            : 'bg-linear-to-r from-rose-500 to-red-500'
        }`}>
          <button
            onClick={onClose}
            className="absolute left-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            {category === 'good' ? <Sparkles className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>تعریف کار یا رفتار جدید</span>
          </h2>
          <p className="text-xs text-white/80 mt-1">
            یک رفتار جدید برای امتیازدهی و انگیزش به لیست اضافه کنید
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Category Switcher */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">نوع رفتار:</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setCategory('good');
                  if (icon === '⚠️' || icon === '😤') setIcon('🌟');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  category === 'good'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                کار خوب (+ امتیاز)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('bad');
                  if (icon === '🌟' || icon === '🧸') setIcon('😤');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  category === 'bad'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                نیازمند اصلاح (- کسر)
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              عنوان کار یا رفتار <span className="text-rose-500">*</span>:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={category === 'good' ? 'مثلاً: تمیز کردن کشو لباس‌ها' : 'مثلاً: لجبازی برای نخوردن سبزیجات'}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:outline-hidden transition"
              id="new-behavior-title-input"
            />
          </div>

          {/* Points selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              تعداد امتیاز ({category === 'good' ? 'افزایش' : 'کسر'}):
            </label>
            <div className="flex items-center gap-2">
              {[5, 10, 15, 20].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPoints(p)}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition ${
                    points === p
                      ? category === 'good'
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                        : 'bg-rose-500 text-white border-rose-500 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {toPersianDigits(p)} ستاره
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-slate-500">یا عدد دلخواه:</span>
              <input
                type="number"
                min="1"
                max="100"
                value={points}
                onChange={(e) => setPoints(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center font-bold"
              />
            </div>
          </div>

          {/* Emoji selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              آیکون یا شکلک انتخابی:
            </label>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-2xl shrink-0">
                {icon}
              </div>
              <span className="text-xs text-slate-500">یکی از شکلک‌های زیر را لمس کنید:</span>
            </div>
            <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
              {COMMON_EMOJIS.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setIcon(em)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg hover:bg-white transition ${
                    icon === em ? 'bg-amber-200 ring-2 ring-amber-400' : ''
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              توضیح کوتاه یا راهنمایی (اختیاری):
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثلاً: هر وقت اتاق خود را مرتب کرد"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:outline-hidden transition"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className={`flex-1 py-3 px-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition ${
                category === 'good'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              }`}
              id="save-new-behavior-btn"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت و ذخیره رفتار جدید</span>
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
