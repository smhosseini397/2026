import React, { useState } from 'react';
import { History, Trash2, Filter } from 'lucide-react';
import { HistoryRecord, HistoryRecordType } from '../types';
import { formatPersianTime, toPersianDigits } from '../utils/storage';

interface Props {
  history: HistoryRecord[];
  isParentLocked: boolean;
  onDeleteRecord: (id: string) => void;
  onClearHistory: () => void;
}

export const HistorySection: React.FC<Props> = ({
  history,
  isParentLocked,
  onDeleteRecord,
  onClearHistory,
}) => {
  const [filter, setFilter] = useState<'all' | HistoryRecordType>('all');

  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <div className="space-y-4" id="history-section">
      {/* Header with Filters and Clear */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500" />
            <span>تاریخچه امتیازها و پاداش‌ها</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ثبت تمام تلاش‌ها، رفتارهای خوب و جایزه‌های دریافت شده
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter dropdown / pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
              id="filter-all-btn"
            >
              همه ({toPersianDigits(history.length)})
            </button>
            <button
              onClick={() => setFilter('good_behavior')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filter === 'good_behavior' ? 'bg-emerald-500 text-white shadow-xs' : 'hover:text-slate-900'
              }`}
              id="filter-good-btn"
            >
              خوب
            </button>
            <button
              onClick={() => setFilter('bad_behavior')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filter === 'bad_behavior' ? 'bg-rose-500 text-white shadow-xs' : 'hover:text-slate-900'
              }`}
              id="filter-bad-btn"
            >
              اصلاح
            </button>
            <button
              onClick={() => setFilter('reward_redeemed')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filter === 'reward_redeemed' ? 'bg-pink-500 text-white shadow-xs' : 'hover:text-slate-900'
              }`}
              id="filter-rewards-btn"
            >
              پاداش‌ها
            </button>
          </div>

          {!isParentLocked && history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1 transition"
              title="پاکسازی کامل تاریخچه"
              id="clear-all-history-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* History Items */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400">
          <History className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-medium">هیچ رکوردی در این بخش یافت نشد.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredHistory.map((item) => {
            const isGood = item.type === 'good_behavior';
            const isReward = item.type === 'reward_redeemed';
            const isBad = item.type === 'bad_behavior';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/70 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition"
                id={`history-row-${item.id}`}
              >
                {/* Right: Icon & Content */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                      isGood
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : isReward
                        ? 'bg-pink-50 text-pink-600 border border-pink-200'
                        : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <div className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                      <span>{item.title}</span>
                      {isReward && (
                        <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded-md font-semibold">
                          پاداش تحویل شد
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                      <span>{formatPersianTime(item.timestamp)}</span>
                      {item.note && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600 font-medium italic">{item.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Left: Points change & Delete button */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-0.5 ${
                      item.pointsChange > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : isReward
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    <span>{item.pointsChange > 0 ? '+' : ''}</span>
                    <span>{toPersianDigits(item.pointsChange)}</span>
                    <span className="text-[10px] font-normal">ستاره</span>
                  </span>

                  {!isParentLocked && (
                    <button
                      onClick={() => onDeleteRecord(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="حذف این مورد از تاریخچه"
                      id={`delete-history-${item.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
