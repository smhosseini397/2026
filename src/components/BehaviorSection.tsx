import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, AlertTriangle, Sparkles, HeartHandshake } from 'lucide-react';
import { BehaviorItem, BehaviorCategory } from '../types';
import { toPersianDigits } from '../utils/storage';

interface Props {
  behaviors: BehaviorItem[];
  isParentLocked: boolean;
  onApplyBehavior: (item: BehaviorItem) => void;
  onAddNewBehavior: (category: BehaviorCategory) => void;
  onDeleteBehavior: (id: string) => void;
}

export const BehaviorSection: React.FC<Props> = ({
  behaviors,
  isParentLocked,
  onApplyBehavior,
  onAddNewBehavior,
  onDeleteBehavior,
}) => {
  const [activeTab, setActiveTab] = useState<BehaviorCategory>('good');

  const filteredItems = behaviors.filter((item) => item.category === activeTab);
  const goodCount = behaviors.filter((item) => item.category === 'good').length;
  const badCount = behaviors.filter((item) => item.category === 'bad').length;

  return (
    <div className="space-y-4" id="behavior-section">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex p-1 bg-slate-100 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('good')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'good'
                ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="tab-good-behaviors-btn"
          >
            <Sparkles className="w-4 h-4" />
            <span>کارهای خوب و تشویقی</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'good' ? 'bg-emerald-700/60 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {toPersianDigits(goodCount)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bad')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'bad'
                ? 'bg-rose-500 text-white shadow-xs shadow-rose-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="tab-bad-behaviors-btn"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>نیاز به تلاش و اصلاح</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'bad' ? 'bg-rose-700/60 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {toPersianDigits(badCount)}
            </span>
          </button>
        </div>

        {/* Add custom behavior button */}
        <button
          onClick={() => onAddNewBehavior(activeTab)}
          className="hidden sm:flex items-center gap-1.5 py-2 px-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-xs"
          id="add-behavior-desktop-btn"
        >
          <Plus className="w-4 h-4" />
          <span>تعریف کار جدید</span>
        </button>
      </div>

      {/* Helpful educational hint */}
      <div className={`p-3 rounded-2xl text-xs border flex items-start gap-2.5 ${
        activeTab === 'good'
          ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
          : 'bg-rose-50/70 border-rose-200/80 text-rose-900'
      }`}>
        {activeTab === 'good' ? (
          <>
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">تشویق فوری: </span>
              با لمس هر کار خوب، بلافاصله ستاره به کیف پول دخترتان اضافه می‌شود و صدای تشویق پخش می‌گردد.
            </div>
          </>
        ) : (
          <>
            <HeartHandshake className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">رویکرد تربیتی سازنده: </span>
              کسر ملایم امتیاز به کودک می‌آموزد هر رفتار نتیجه‌ای دارد. هدف تنبیه نیست، بلکه تقویت حس مسئولیت‌پذیری است.
            </div>
          </>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {filteredItems.map((item) => {
          const isGood = item.category === 'good';

          return (
            <div
              key={item.id}
              onClick={() => onApplyBehavior(item)}
              className={`group relative p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] select-none shadow-xs hover:shadow-md flex items-center justify-between gap-3 ${
                isGood
                  ? 'bg-white hover:bg-emerald-50/40 border-slate-200/80 hover:border-emerald-300'
                  : 'bg-white hover:bg-rose-50/40 border-slate-200/80 hover:border-rose-300'
              }`}
              id={`behavior-item-${item.id}`}
            >
              {/* Left: Delete button (only when parent unlocked) */}
              {!isParentLocked && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBehavior(item.id);
                  }}
                  className="absolute left-2.5 top-2.5 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-80 hover:opacity-100 transition z-10"
                  title="حذف این مورد"
                  id={`delete-behavior-${item.id}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Icon & Title */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110 ${
                  isGood ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'
                }`}>
                  {item.icon}
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-slate-900 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Point Badge Button */}
              <div className="shrink-0 flex items-center">
                <span className={`px-2.5 py-1.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1 shadow-xs group-hover:shadow-sm transition ${
                  isGood
                    ? 'bg-emerald-500 group-hover:bg-emerald-600 text-white'
                    : 'bg-rose-500 group-hover:bg-rose-600 text-white'
                }`}>
                  <span>{isGood ? '+' : '-'}</span>
                  <span>{toPersianDigits(item.points)}</span>
                  <span className="text-[11px] font-normal">ستاره</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Button on mobile */}
      <div className="sm:hidden pt-1">
        <button
          onClick={() => onAddNewBehavior(activeTab)}
          className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 border border-dashed border-amber-300 rounded-2xl text-xs font-bold text-amber-800 flex items-center justify-center gap-2 transition"
          id="add-behavior-mobile-btn"
        >
          <Plus className="w-4 h-4 text-amber-600" />
          <span>افزودن کار {activeTab === 'good' ? 'خوب' : 'نیازمند اصلاح'} جدید</span>
        </button>
      </div>
    </div>
  );
};
