import React, { useState } from 'react';
import { X, Gift, Plus, Sparkles } from 'lucide-react';
import { RewardItem } from '../types';
import { toPersianDigits } from '../utils/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reward: Omit<RewardItem, 'id' | 'redeemedCount'>) => void;
}

const REWARD_PRESETS = [
  {
    title: 'زمان بیشتر برای بازی (تبلت یا کنسول)',
    points: 40,
    icon: '🎮',
    desc: 'یک ساعت بازی ویدئویی یا تبلت بیشتر در روز تعطیل',
  },
  {
    title: 'خرید یک اسباب‌بازی کوچک یا فیگور دلخواه',
    points: 80,
    icon: '🧸',
    desc: 'خرید فیگور کارتونی، عروسک بندانگشتی یا اسباب‌بازی فکری',
  },
  {
    title: 'یک وعده غذایی مورد علاقه (پیتزا، ماکارونی یا ساندویچ)',
    points: 50,
    icon: '🍕',
    desc: 'انتخاب ناهار یا شام دلخواه همراه با خانواده',
  },
  {
    title: 'رفتن به شهربازی، خانه بازی یا استخر توپ',
    points: 120,
    icon: '🎡',
    desc: 'یک تفریح هیجان‌انگیز دو ساعته در شهربازی',
  },
  {
    title: 'خرید کتاب داستان یا دفتر نقاشی و برچسب فانتزی',
    points: 60,
    icon: '🎨',
    desc: 'کتاب کودک جذاب یا مدادرنگی و ماژیک جدید',
  },
  {
    title: 'خرید بستنی اسکوپی میوه‌ای یا آبمیوه طبیعی',
    points: 30,
    icon: '🍦',
    desc: 'یک عصرانه خوشمزه به سلیقه دخترم',
  },
];

const REWARD_EMOJIS = [
  '🎮', '🧸', '🍕', '🎡', '🍦', '🎨', '📺', '🎁',
  '🎠', '👗', '🎂', '🏊‍♀️', '⛺', '🍿', '🚲', '🛹',
  '🍫', '🧃', '🎢', '🩰', '🎈', '🍰', '🍟', '🦄'
];

export const AddRewardModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [requiredPoints, setRequiredPoints] = useState<number>(50);
  const [icon, setIcon] = useState('🎁');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof REWARD_PRESETS[0]) => {
    setTitle(preset.title);
    setRequiredPoints(preset.points);
    setIcon(preset.icon);
    setDescription(preset.desc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      requiredPoints: Math.max(5, Number(requiredPoints) || 50),
      icon: icon || '🎁',
      description: description.trim() || undefined,
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-200 overflow-hidden flex flex-col max-h-[90vh]"
        id="add-reward-modal"
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
            <Gift className="w-5 h-5" />
            <span>تعریف پاداش و جایزه انگیزشی</span>
          </h2>
          <p className="text-xs text-white/90 mt-1">
            پاداش‌های جذاب مثل بازی بیشتر، خرید اسباب‌بازی یا غذای مورد علاقه را تعریف کنید
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Quick Presets */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>پیشنهادهای آماده و محبوب (کلیک کنید):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REWARD_PRESETS.map((pr) => (
                <button
                  type="button"
                  key={pr.title}
                  onClick={() => handleApplyPreset(pr)}
                  className="p-2.5 rounded-xl border border-pink-100 hover:border-pink-300 bg-pink-50/40 hover:bg-pink-50 text-right flex items-center justify-between gap-2 transition group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl shrink-0">{pr.icon}</span>
                    <span className="text-xs font-bold text-slate-800 truncate group-hover:text-pink-600">
                      {pr.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-amber-600 shrink-0 bg-white px-1.5 py-0.5 rounded-md border border-amber-200">
                    {toPersianDigits(pr.points)} ⭐
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                عنوان پاداش یا جایزه <span className="text-rose-500">*</span>:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: زمان بیشتر برای بازی، خرید اسباب‌بازی یا غذای دلخواه"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-pink-500 focus:outline-hidden transition"
                id="new-reward-title-input"
              />
            </div>
          </div>

          {/* Required Points */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              امتیاز (ستاره‌های) مورد نیاز برای دریافت:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[30, 40, 60, 100].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setRequiredPoints(p)}
                  className={`py-2 rounded-xl text-xs font-black border transition ${
                    requiredPoints === p
                      ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
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
                min="5"
                max="1000"
                step="5"
                value={requiredPoints}
                onChange={(e) => setRequiredPoints(Math.max(5, parseInt(e.target.value) || 5))}
                className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center font-bold"
              />
              <span className="text-xs text-slate-500">ستاره</span>
            </div>
          </div>

          {/* Emoji selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              آیکون یا شکلک پاداش:
            </label>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-12 h-12 rounded-xl bg-pink-50 border-2 border-pink-300 flex items-center justify-center text-2xl shrink-0">
                {icon}
              </div>
              <span className="text-xs text-slate-500">یکی از گزینه‌های زیر را انتخاب کنید:</span>
            </div>
            <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
              {REWARD_EMOJIS.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setIcon(em)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg hover:bg-white transition ${
                    icon === em ? 'bg-pink-200 ring-2 ring-pink-400' : ''
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
              توضیحات تکمیلی (اختیاری):
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثلاً: در تعطیلات آخر هفته یا به انتخاب خودش"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-pink-500 focus:outline-hidden transition"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-linear-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-pink-500/25 transition cursor-pointer"
              id="save-new-reward-btn"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن به لیست جوایز</span>
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
