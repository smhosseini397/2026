import React from 'react';
import { Sparkles, Trophy, Gift, ArrowLeft, Target } from 'lucide-react';
import { ChildProfile, RewardItem } from '../types';
import { toPersianDigits, calculateLevel } from '../utils/storage';
import { ThemeConfig } from '../utils/themes';

interface Props {
  profile: ChildProfile;
  rewards: RewardItem[];
  themeConfig: ThemeConfig;
  onSelectRewardTab: () => void;
}

export const ScoreBanner: React.FC<Props> = ({ profile, rewards, themeConfig, onSelectRewardTab }) => {
  const level = calculateLevel(profile.totalEarned);

  // Find target reward: either pinned or next highest
  const pinnedReward = rewards.find(r => r.id === profile.pinnedRewardId);
  const sortedRewards = [...rewards].sort((a, b) => a.requiredPoints - b.requiredPoints);
  const targetReward = pinnedReward || sortedRewards.find(r => r.requiredPoints > profile.currentPoints) || sortedRewards[0];
  const reachableRewards = sortedRewards.filter(r => r.requiredPoints <= profile.currentPoints);

  const neededStars = targetReward ? Math.max(0, targetReward.requiredPoints - profile.currentPoints) : 0;
  const progressPercent = targetReward
    ? Math.min(100, Math.round((profile.currentPoints / targetReward.requiredPoints) * 100))
    : 100;
  const isTargetReady = targetReward ? profile.currentPoints >= targetReward.requiredPoints : false;

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-linear-to-br ${themeConfig.scoreBannerGrad} text-white p-5 sm:p-6 shadow-xl border border-white/20 transition-all duration-300`}>
      {/* Decorative stars/shapes */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/15 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-3 left-4 text-white/20 text-5xl font-black select-none pointer-events-none">
        ⭐
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-right">
        {/* Current Stars Card */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-4xl sm:text-5xl shadow-inner">
              ⭐
            </div>
            <div className="absolute -bottom-2 -right-1 bg-yellow-300 text-slate-900 font-black text-xs px-2 py-0.5 rounded-full shadow-xs">
              ستاره‌ها
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider block">
              موجودی ستاره‌های {profile.name}
            </span>
            <div className="flex items-baseline gap-2 justify-center sm:justify-start mt-0.5">
              <span className="text-4xl sm:text-5xl font-black tracking-tight" id="current-stars-display">
                {toPersianDigits(profile.currentPoints)}
              </span>
              <span className="text-white/90 font-bold text-sm">ستاره طلایی</span>
            </div>

            <div className="flex items-center gap-3 mt-1 text-xs text-white/90 justify-center sm:justify-start">
              <span className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                کل ستاره‌ها: {toPersianDigits(profile.totalEarned)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                {profile.title || level.title}
              </span>
            </div>
          </div>
        </div>

        {/* Motivational Goal Card */}
        <div 
          onClick={onSelectRewardTab}
          className="w-full sm:w-auto min-w-[240px] bg-black/20 hover:bg-black/25 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 cursor-pointer transition active:scale-98 text-right"
          id="next-reward-teaser"
          title="مشاهده همه پاداش‌ها و هدف‌ها"
        >
          {isTargetReady && targetReward ? (
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-yellow-200 mb-1">
                <span className="flex items-center gap-1">
                  <Gift className="w-4 h-4 text-yellow-300 animate-bounce" />
                  هدف آماده دریافت است!
                </span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-white font-bold line-clamp-1">
                {targetReward.icon} {targetReward.title}
              </p>
              <span className="mt-2 inline-block w-full py-1 text-center bg-white text-slate-900 font-black text-[11px] rounded-lg shadow-xs hover:bg-yellow-100 transition">
                تحویل جایزه به دخترم 🎁
              </span>
            </div>
          ) : targetReward ? (
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-yellow-300" />
                  <span className="line-clamp-1 font-bold">{targetReward.title}</span>
                </span>
                <span className="font-extrabold text-yellow-300">
                  {toPersianDigits(neededStars)} ستاره تا جایزه
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden mb-1.5">
                <div 
                  className="h-full bg-linear-to-r from-yellow-300 to-white rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-white/80 font-medium">
                <span>پیشرفت: {toPersianDigits(progressPercent)}٪</span>
                <span>هدف: {toPersianDigits(targetReward.requiredPoints)} ستاره</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
