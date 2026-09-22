/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Gift, History, Star, Download, Smartphone } from 'lucide-react';
import {
  ChildProfile,
  BehaviorItem,
  RewardItem,
  HistoryRecord,
  AppSettings,
  BehaviorCategory,
  AppTheme,
} from './types';
import {
  DEFAULT_PROFILE,
  DEFAULT_BEHAVIORS,
  DEFAULT_REWARDS,
  DEFAULT_HISTORY,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
  toPersianDigits,
} from './utils/storage';
import { APP_THEMES } from './utils/themes';
import { soundFX } from './utils/audio';
import { triggerStarConfetti, triggerRewardCelebration } from './utils/confetti';
import { usePWAInstall } from './hooks/usePWAInstall';

// Components
import { Header } from './components/Header';
import { ScoreBanner } from './components/ScoreBanner';
import { BehaviorSection } from './components/BehaviorSection';
import { RewardSection } from './components/RewardSection';
import { HistorySection } from './components/HistorySection';
import { InstallModal } from './components/InstallModal';
import { AddBehaviorModal } from './components/AddBehaviorModal';
import { AddRewardModal } from './components/AddRewardModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { ParentPinModal } from './components/ParentPinModal';
import { SettingsModal } from './components/SettingsModal';
import { ActionConfirmModal } from './components/ActionConfirmModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';

export default function App() {
  // State from LocalStorage
  const [profile, setProfile] = useState<ChildProfile>(() =>
    loadFromStorage(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE)
  );
  const [behaviors, setBehaviors] = useState<BehaviorItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.BEHAVIORS, DEFAULT_BEHAVIORS)
  );
  const [rewards, setRewards] = useState<RewardItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.REWARDS, DEFAULT_REWARDS)
  );
  const [history, setHistory] = useState<HistoryRecord[]>(() =>
    loadFromStorage(STORAGE_KEYS.HISTORY, DEFAULT_HISTORY)
  );
  const [settings, setSettings] = useState<AppSettings>(() =>
    loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'behaviors' | 'rewards' | 'history'>('behaviors');

  // Modals state
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isAddBehaviorOpen, setIsAddBehaviorOpen] = useState(false);
  const [addBehaviorCategory, setAddBehaviorCategory] = useState<BehaviorCategory>('good');
  const [isAddRewardOpen, setIsAddRewardOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isParentPinOpen, setIsParentPinOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Target for action confirmation
  const [confirmTarget, setConfirmTarget] = useState<
    | { type: 'behavior'; item: BehaviorItem }
    | { type: 'reward'; item: RewardItem }
    | null
  >(null);

  // Toast / Floating Celebration message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // PWA Install hook
  const { isInstallable, isInstalled } = usePWAInstall();

  // Active theme configuration
  const currentThemeConfig = APP_THEMES[settings.theme] || APP_THEMES.pink;

  // Keep soundFX sync with settings
  useEffect(() => {
    soundFX.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  // Sync to LocalStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROFILE, profile);
  }, [profile]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BEHAVIORS, behaviors);
  }, [behaviors]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.REWARDS, rewards);
  }, [rewards]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.HISTORY, history);
  }, [history]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handle Behavior Click -> opens confirmation modal
  const handleApplyBehavior = (item: BehaviorItem) => {
    setConfirmTarget({ type: 'behavior', item });
  };

  // Handle Reward Click -> opens confirmation modal
  const handleRedeemReward = (item: RewardItem) => {
    setConfirmTarget({ type: 'reward', item });
  };

  // Pin target reward
  const handlePinReward = (rewardId: string) => {
    setProfile((prev) => ({ ...prev, pinnedRewardId: rewardId }));
    const found = rewards.find((r) => r.id === rewardId);
    showToast(`«${found?.title || 'پاداش'}» به عنوان هدف اصلی انتخاب شد 🎯`);
  };

  // Confirm Action Handler
  const handleExecuteAction = (note?: string) => {
    if (!confirmTarget) return;

    if (confirmTarget.type === 'behavior') {
      const item = confirmTarget.item;
      const isGood = item.category === 'good';
      const points = item.points;

      if (isGood) {
        const newCurrent = profile.currentPoints + points;
        const newTotal = profile.totalEarned + points;

        // Check if any reward was just unlocked!
        const pinnedTarget = rewards.find((r) => r.id === profile.pinnedRewardId);
        const wasBelowPinned = pinnedTarget ? profile.currentPoints < pinnedTarget.requiredPoints : false;
        const isNowAbovePinned = pinnedTarget ? newCurrent >= pinnedTarget.requiredPoints : false;

        setProfile((prev) => ({
          ...prev,
          currentPoints: newCurrent,
          totalEarned: newTotal,
        }));

        soundFX.playStarEarned();
        triggerStarConfetti();

        if (wasBelowPinned && isNowAbovePinned && pinnedTarget) {
          triggerRewardCelebration();
          showToast(`🎉 هورااا! امتیاز لازم برای هدف «${pinnedTarget.title}» کسب شد! آماده دریافت هستی!`);
        } else {
          showToast(`آفرین! ${toPersianDigits(points)} ستاره طلایی به ${profile.name} اضافه شد ⭐`);
        }

        const newRecord: HistoryRecord = {
          id: `rec-${Date.now()}`,
          timestamp: Date.now(),
          type: 'good_behavior',
          title: item.title,
          pointsChange: points,
          icon: item.icon,
          note,
        };
        setHistory((prev) => [newRecord, ...prev]);
      } else {
        // Bad behavior: deduct points from current (not dropping below 0)
        setProfile((prev) => ({
          ...prev,
          currentPoints: Math.max(0, prev.currentPoints - points),
        }));

        soundFX.playPointDeduction();
        showToast(`کسر ${toPersianDigits(points)} ستاره از موجودی`);

        const newRecord: HistoryRecord = {
          id: `rec-${Date.now()}`,
          timestamp: Date.now(),
          type: 'bad_behavior',
          title: item.title,
          pointsChange: -points,
          icon: item.icon,
          note,
        };
        setHistory((prev) => [newRecord, ...prev]);
      }
    } else if (confirmTarget.type === 'reward') {
      const reward = confirmTarget.item;

      // Deduct reward points
      setProfile((prev) => ({
        ...prev,
        currentPoints: Math.max(0, prev.currentPoints - reward.requiredPoints),
      }));

      // Increment reward count
      setRewards((prev) =>
        prev.map((r) =>
          r.id === reward.id ? { ...r, redeemedCount: r.redeemedCount + 1 } : r
        )
      );

      soundFX.playRewardRedeemed();
      triggerRewardCelebration();
      showToast(`مبارکه! پاداش «${reward.title}» تحویل داده شد 🎁`);

      const newRecord: HistoryRecord = {
        id: `rec-${Date.now()}`,
        timestamp: Date.now(),
        type: 'reward_redeemed',
        title: reward.title,
        pointsChange: -reward.requiredPoints,
        icon: reward.icon,
        note: note || 'پاداش با موفقیت تحویل شد',
      };
      setHistory((prev) => [newRecord, ...prev]);
    }

    setConfirmTarget(null);
  };

  // Add new behavior
  const handleSaveBehavior = (newItem: Omit<BehaviorItem, 'id'>) => {
    const itemWithId: BehaviorItem = {
      ...newItem,
      id: `beh-${Date.now()}`,
    };
    setBehaviors((prev) => [itemWithId, ...prev]);
    showToast('کار جدید با موفقیت اضافه شد');
  };

  // Delete behavior
  const handleDeleteBehavior = (id: string) => {
    setBehaviors((prev) => prev.filter((b) => b.id !== id));
    showToast('مورد حذف شد');
  };

  // Add new reward
  const handleSaveReward = (newReward: Omit<RewardItem, 'id' | 'redeemedCount'>) => {
    const rewardWithId: RewardItem = {
      ...newReward,
      id: `rew-${Date.now()}`,
      redeemedCount: 0,
    };
    setRewards((prev) => [rewardWithId, ...prev]);
    showToast('پاداش جدید با موفقیت تعریف شد');
  };

  // Delete reward
  const handleDeleteReward = (id: string) => {
    setRewards((prev) => prev.filter((r) => r.id !== id));
    showToast('پاداش حذف شد');
  };

  // Delete single history item
  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    showToast('رکورد از تاریخچه حذف شد');
  };

  // Clear all history
  const handleClearHistory = () => {
    if (window.confirm('آیا مایل به پاکسازی تاریخچه هستید؟')) {
      setHistory([]);
      showToast('تاریخچه پاکسازی شد');
    }
  };

  // Restore data from backup
  const handleRestoreData = (data: {
    profile: ChildProfile;
    behaviors: BehaviorItem[];
    rewards: RewardItem[];
    history: HistoryRecord[];
    settings: AppSettings;
  }) => {
    setProfile(data.profile);
    setBehaviors(data.behaviors);
    setRewards(data.rewards);
    setHistory(data.history);
    setSettings(data.settings);
  };

  return (
    <div className={`min-h-screen bg-linear-to-b ${currentThemeConfig.bgGrad} flex flex-col justify-between transition-colors duration-500`} dir="rtl">
      {/* Top Header */}
      <div>
        <Header
          profile={profile}
          settings={settings}
          onToggleSound={() =>
            setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
          }
          onToggleParentLock={() => setIsParentPinOpen(true)}
          onOpenEditProfile={() => setIsProfileEditOpen(true)}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
        />

        {/* In-App Samsung Install Banner (if installable and not installed) */}
        {isInstallable && !isInstalled && (
          <div className="bg-linear-to-r from-amber-500 via-amber-600 to-yellow-500 text-white px-4 py-2 text-xs font-bold shadow-xs">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-yellow-200 shrink-0" />
                <span>برای دسترسی سریع، برنامه را روی گوشی سامسونگ خود نصب کنید</span>
              </div>
              <button
                onClick={() => setIsInstallModalOpen(true)}
                className="py-1 px-3 bg-white text-amber-800 rounded-lg text-xs font-black shadow-xs hover:bg-amber-100 transition active:scale-95 shrink-0 cursor-pointer"
                id="header-install-banner-btn"
              >
                نصب فوری 📲
              </button>
            </div>
          </div>
        )}

        {/* Main Content Container */}
        <main className="max-w-2xl mx-auto px-4 py-5 space-y-5">
          {/* Score Banner */}
          <ScoreBanner
            profile={profile}
            rewards={rewards}
            themeConfig={currentThemeConfig}
            onSelectRewardTab={() => setActiveTab('rewards')}
          />

          {/* Navigation Tabs */}
          <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setActiveTab('behaviors')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                activeTab === 'behaviors'
                  ? currentThemeConfig.pillActive
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="main-tab-behaviors-btn"
            >
              <Star className="w-4 h-4" />
              <span>امتیازدهی کارها</span>
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition relative ${
                activeTab === 'rewards'
                  ? 'bg-pink-500 text-white shadow-xs shadow-pink-500/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="main-tab-rewards-btn"
            >
              <Gift className="w-4 h-4" />
              <span>پاداش‌ها و هدف‌ها</span>
              {rewards.some((r) => r.requiredPoints <= profile.currentPoints) && (
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 absolute top-2 left-3 animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                activeTab === 'history'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="main-tab-history-btn"
            >
              <History className="w-4 h-4" />
              <span>کارنامه و تاریخچه</span>
            </button>
          </div>

          {/* Tab Views */}
          {activeTab === 'behaviors' && (
            <BehaviorSection
              behaviors={behaviors}
              isParentLocked={settings.isParentLocked}
              onApplyBehavior={handleApplyBehavior}
              onAddNewBehavior={(cat) => {
                setAddBehaviorCategory(cat);
                setIsAddBehaviorOpen(true);
              }}
              onDeleteBehavior={handleDeleteBehavior}
            />
          )}

          {activeTab === 'rewards' && (
            <RewardSection
              rewards={rewards}
              currentPoints={profile.currentPoints}
              pinnedRewardId={profile.pinnedRewardId}
              isParentLocked={settings.isParentLocked}
              onRedeemReward={handleRedeemReward}
              onAddNewReward={() => setIsAddRewardOpen(true)}
              onDeleteReward={handleDeleteReward}
              onPinReward={handlePinReward}
            />
          )}

          {activeTab === 'history' && (
            <HistorySection
              history={history}
              isParentLocked={settings.isParentLocked}
              onDeleteRecord={handleDeleteHistory}
              onClearHistory={handleClearHistory}
            />
          )}
        </main>
      </div>

      {/* Footer info & Samsung Install Hint */}
      <footer className="max-w-2xl mx-auto w-full px-4 py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 mt-8 space-y-2">
        <div className="flex items-center justify-center gap-2 font-medium text-slate-500">
          <span>⭐ اپلیکیشن تشویق و انگیزه‌بخشی به دخترم</span>
          <span>•</span>
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="text-pink-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            id="footer-install-link-btn"
          >
            <Download className="w-3 h-3" />
            راهنمای نصب گوشی سامسونگ
          </button>
        </div>
        <p className="text-[11px] text-slate-400">
          داده‌ها و تصاویر به صورت آفلاین در حافظه مرورگر گوشی شما محفوظ می‌مانند.
        </p>
      </footer>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 border border-white/20 animate-in slide-in-from-bottom-4 duration-300 max-w-sm text-center">
          <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        currentTheme={settings.theme}
        onClose={() => setIsThemeModalOpen(false)}
        onSelectTheme={(th: AppTheme) => {
          setSettings((prev) => ({ ...prev, theme: th }));
          showToast(`تم «${APP_THEMES[th].name}» فعال شد 🎨`);
        }}
      />

      <AddBehaviorModal
        isOpen={isAddBehaviorOpen}
        initialCategory={addBehaviorCategory}
        onClose={() => setIsAddBehaviorOpen(false)}
        onSave={handleSaveBehavior}
      />

      <AddRewardModal
        isOpen={isAddRewardOpen}
        onClose={() => setIsAddRewardOpen(false)}
        onSave={handleSaveReward}
      />

      <ProfileEditModal
        isOpen={isProfileEditOpen}
        profile={profile}
        onClose={() => setIsProfileEditOpen(false)}
        onSave={(updated) => {
          setProfile((prev) => ({ ...prev, ...updated }));
          showToast('مشخصات و آواتار با موفقیت ذخیره شد ✨');
        }}
      />

      <ParentPinModal
        isOpen={isParentPinOpen}
        isCurrentlyLocked={settings.isParentLocked}
        parentPin={settings.parentPin}
        onClose={() => setIsParentPinOpen(false)}
        onSuccess={(newLocked) => {
          setSettings((prev) => ({ ...prev, isParentLocked: newLocked }));
          showToast(newLocked ? 'قفل کودک فعال شد' : 'حالت والدین فعال شد');
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        profile={profile}
        behaviors={behaviors}
        rewards={rewards}
        history={history}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onRestoreData={handleRestoreData}
      />

      <ActionConfirmModal
        target={confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleExecuteAction}
      />
    </div>
  );
}
