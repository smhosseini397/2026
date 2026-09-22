import React, { useState } from 'react';
import { Gift, Plus, Trash2, Check, Sparkles, Lock, Pin, Target, Trophy, CheckCircle2 } from 'lucide-react';
import { RewardItem } from '../types';
import { toPersianDigits } from '../utils/storage';

interface Props {
  rewards: RewardItem[];
  currentPoints: number;
  pinnedRewardId?: string;
  isParentLocked: boolean;
  onRedeemReward: (reward: RewardItem) => void;
  onAddNewReward: () => void;
  onDeleteReward: (id: string) => void;
  onPinReward: (id: string) => void;
}

export const RewardSection: React.FC<Props> = ({
  rewards,
  currentPoints,
  pinnedRewardId,
  isParentLocked,
  onRedeemReward,
  onAddNewReward,
  onDeleteReward,
  onPinReward,
}) => {
  const [filter, setFilter] = useState<'all' | 'ready' | 'progress' | 'claimed'>('all');

  // Find the pinned target reward
  const pinnedReward = rewards.find((r) => r.id === pinnedRewardId) || rewards[0];

  // Calculations for pinned target
  const pinnedIsReady = pinnedReward ? currentPoints >= pinnedReward.requiredPoints : false;
  const pinnedRemaining = pinnedReward ? Math.max(0, pinnedReward.requiredPoints - currentPoints) : 0;
  const pinnedPercent = pinnedReward
    ? Math.min(100, Math.round((currentPoints / pinnedReward.requiredPoints) * 100))
    : 0;

  // Filter rewards
  const filteredRewards = rewards.filter((r) => {
    const isReady = currentPoints >= r.requiredPoints;
    if (filter === 'ready') return isReady;
    if (filter === 'progress') return !isReady;
    if (filter === 'claimed') return r.redeemedCount > 0;
    return true;
  });

  const readyCount = rewards.filter((r) => currentPoints >= r.requiredPoints).length;

  return (
    <div className="space-y-5" id="rewards-section">
      {/* Top Target Reward Card (سیستم پیگیری هدف) */}
      {pinnedReward && (
        <div className={`relative overflow-hidden rounded-3xl p-5 border-2 shadow-lg transition-all ${
          pinnedIsReady
            ? 'bg-linear-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white border-emerald-300 ring-4 ring-emerald-400/20 shadow-emerald-500/15'
            : 'bg-linear-to-br from-indigo-900 via-purple-900 to-slate-900 text-white border-purple-500/40 shadow-purple-900/20'
        }`}>
          {/* Decorative glows */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-white/20 backdrop-blur-md text-yellow-300 shadow-xs">
                  <Target className="w-4 h-4" />
                </span>
                <span className="text-xs font-black text-white/90">
                  هدف اصلی انتخابی دخترم
                </span>
              </div>

              {pinnedIsReady ? (
                <span className="text-[11px] font-black bg-white text-emerald-800 px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                  امتیاز کافی کسب شد!
                </span>
              ) : (
                <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full text-purple-200">
                  {toPersianDigits(pinnedRemaining)} ستاره تا رسیدن
                </span>
              )}
            </div>

            {/* Target Content */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-4xl shadow-inner shrink-0">
                {pinnedReward.icon}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-black text-base sm:text-lg text-white truncate">
                  {pinnedReward.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                  {pinnedReward.description || 'پاداش انگیزشی هدف‌گذاری شده'}
                </p>

                <div className="flex items-center gap-2 mt-2 text-xs font-bold text-yellow-300">
                  <span>امتیاز مورد نیاز: {toPersianDigits(pinnedReward.requiredPoints)} ستاره</span>
                  <span>•</span>
                  <span>موجودی فعلی: {toPersianDigits(currentPoints)} ستاره</span>
                </div>
              </div>
            </div>

            {/* Target Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-white/90">
                <span>پیشرفت رسیدن به هدف:</span>
                <span className="font-mono text-yellow-300">
                  {toPersianDigits(pinnedPercent)}٪
                </span>
              </div>
              <div className="w-full h-3.5 bg-black/30 rounded-full p-0.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    pinnedIsReady
                      ? 'bg-linear-to-r from-yellow-300 via-amber-300 to-white shadow-md'
                      : 'bg-linear-to-r from-pink-400 via-purple-400 to-amber-300'
                  }`}
                  style={{ width: `${pinnedPercent}%` }}
                />
              </div>
            </div>

            {/* Target Action */}
            <div className="pt-1 flex items-center gap-2">
              {pinnedIsReady ? (
                <button
                  onClick={() => onRedeemReward(pinnedReward)}
                  className="w-full py-3 px-4 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-98 font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Gift className="w-5 h-5 text-pink-600 animate-bounce" />
                  <span>تحویل پاداش به دخترم 🎉</span>
                </button>
              ) : (
                <div className="w-full py-2 px-3 bg-white/10 rounded-xl text-center text-xs font-medium text-white/80 flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>با انجام کارهای خوب روزانه، {toPersianDigits(pinnedRemaining)} ستاره دیگر کسب کن!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-500" />
            <span>فهرست پاداش‌ها و جوایز انگیزشی</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            پاداش‌های مختلف را تعریف کنید تا دخترتان برای دستیابی به آن‌ها تشویق شود
          </p>
        </div>

        <button
          onClick={onAddNewReward}
          className="self-start sm:self-auto flex items-center gap-1.5 py-2.5 px-4 bg-linear-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-md shadow-pink-500/20"
          id="add-new-reward-btn"
        >
          <Plus className="w-4 h-4" />
          <span>تعریف پاداش جدید</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
        <button
          onClick={() => setFilter('all')}
          className={`py-1.5 px-3 rounded-xl transition whitespace-nowrap ${
            filter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          همه پاداش‌ها ({toPersianDigits(rewards.length)})
        </button>

        <button
          onClick={() => setFilter('ready')}
          className={`py-1.5 px-3 rounded-xl transition flex items-center gap-1 whitespace-nowrap ${
            filter === 'ready'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>آماده دریافت ({toPersianDigits(readyCount)})</span>
        </button>

        <button
          onClick={() => setFilter('progress')}
          className={`py-1.5 px-3 rounded-xl transition whitespace-nowrap ${
            filter === 'progress'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          در حال تلاش ({toPersianDigits(rewards.length - readyCount)})
        </button>

        <button
          onClick={() => setFilter('claimed')}
          className={`py-1.5 px-3 rounded-xl transition whitespace-nowrap ${
            filter === 'claimed'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
          }`}
        >
          تحویل شده‌ها
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredRewards.map((reward) => {
          const isEligible = currentPoints >= reward.requiredPoints;
          const isPinned = pinnedRewardId === reward.id;
          const progressPercent = Math.min(
            100,
            Math.round((currentPoints / reward.requiredPoints) * 100)
          );
          const remainingStars = Math.max(0, reward.requiredPoints - currentPoints);

          return (
            <div
              key={reward.id}
              className={`relative bg-white rounded-3xl p-4 sm:p-5 border transition-all duration-200 shadow-xs flex flex-col justify-between ${
                isEligible
                  ? 'border-emerald-300 ring-2 ring-emerald-400/20 bg-linear-to-b from-emerald-50/20 to-white'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              id={`reward-card-${reward.id}`}
            >
              {/* Top Controls: Pin Goal and Delete */}
              <div className="absolute left-3 top-3 flex items-center gap-1 z-10">
                <button
                  onClick={() => onPinReward(reward.id)}
                  className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    isPinned
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                  title={isPinned ? 'هدف اصلی انتخاب شده است' : 'تنظیم به عنوان هدف اصلی'}
                >
                  <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-amber-500 text-amber-500' : ''}`} />
                </button>

                {!isParentLocked && (
                  <button
                    onClick={() => onDeleteReward(reward.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="حذف این پاداش"
                    id={`delete-reward-${reward.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div>
                {/* Reward Info */}
                <div className="flex items-start gap-3 pl-16">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-pink-50 to-amber-50 border border-pink-200 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                    {reward.icon}
                  </div>

                  <div className="flex-1 pr-1">
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-snug">
                      {reward.title}
                    </h3>
                    {reward.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {reward.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        ⭐ {toPersianDigits(reward.requiredPoints)} ستاره
                      </span>

                      {reward.redeemedCount > 0 && (
                        <span className="text-[11px] text-slate-500 font-medium">
                          ({toPersianDigits(reward.redeemedCount)} بار دریافت شده)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className={isEligible ? 'text-emerald-600 flex items-center gap-1' : 'text-slate-500'}>
                      {isEligible ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          آماده دریافت!
                        </>
                      ) : (
                        `پیشرفت: ${toPersianDigits(progressPercent)}٪`
                      )}
                    </span>
                    <span className="text-slate-600">
                      {toPersianDigits(Math.min(currentPoints, reward.requiredPoints))} / {toPersianDigits(reward.requiredPoints)}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isEligible
                          ? 'bg-linear-to-r from-emerald-400 to-teal-500'
                          : 'bg-linear-to-r from-pink-400 to-amber-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                {isEligible ? (
                  <button
                    onClick={() => onRedeemReward(reward)}
                    className="w-full py-2.5 px-4 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-98 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition cursor-pointer"
                    id={`redeem-btn-${reward.id}`}
                  >
                    <Check className="w-4 h-4" />
                    <span>تحویل این پاداش 🎉</span>
                  </button>
                ) : (
                  <div className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs font-semibold text-slate-500 flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{toPersianDigits(remainingStars)} ستاره دیگر لازم است</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
