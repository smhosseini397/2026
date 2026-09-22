import React from 'react';
import { X, Check, Palette, Sparkles } from 'lucide-react';
import { AppTheme } from '../types';
import { APP_THEMES, ThemeConfig } from '../utils/themes';

interface Props {
  isOpen: boolean;
  currentTheme: AppTheme;
  onClose: () => void;
  onSelectTheme: (theme: AppTheme) => void;
}

export const ThemeCustomizerModal: React.FC<Props> = ({
  isOpen,
  currentTheme,
  onClose,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-pink-200 overflow-hidden flex flex-col max-h-[90vh]"
        id="theme-customizer-modal"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-pink-500 via-purple-500 to-amber-500 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold">انتخاب تم رنگی شاد</h2>
              <p className="text-xs text-white/90">ظاهر برنامه را با رنگ‌های مورد علاقه دخترتان تغییر دهید</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {Object.values(APP_THEMES).map((th: ThemeConfig) => {
              const isSelected = currentTheme === th.id;

              return (
                <div
                  key={th.id}
                  onClick={() => onSelectTheme(th.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 relative select-none ${
                    isSelected
                      ? `${th.accentBorder} bg-slate-50/80 shadow-md scale-[1.01]`
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                  }`}
                  id={`theme-card-${th.id}`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Visual Color Preview Orb */}
                    <div className={`w-12 h-12 rounded-2xl bg-linear-to-tr ${th.scoreBannerGrad} flex items-center justify-center text-2xl shadow-sm text-white shrink-0`}>
                      {th.emoji}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                          {th.name}
                        </h3>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-yellow-300" />
                            تم فعال
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {th.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition"
            id="close-theme-modal-btn"
          >
            تایید و ذخیره تم
          </button>
        </div>
      </div>
    </div>
  );
};
