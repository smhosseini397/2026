import React from 'react';
import { Download, Volume2, VolumeX, Shield, ShieldAlert, Edit3, Settings, Palette } from 'lucide-react';
import { ChildProfile, AppSettings } from '../types';
import { calculateLevel } from '../utils/storage';

interface Props {
  profile: ChildProfile;
  settings: AppSettings;
  onToggleSound: () => void;
  onToggleParentLock: () => void;
  onOpenEditProfile: () => void;
  onOpenInstallModal: () => void;
  onOpenSettings: () => void;
  onOpenThemeModal: () => void;
}

export const Header: React.FC<Props> = ({
  profile,
  settings,
  onToggleSound,
  onToggleParentLock,
  onOpenEditProfile,
  onOpenInstallModal,
  onOpenSettings,
  onOpenThemeModal,
}) => {
  const level = calculateLevel(profile.totalEarned);

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-amber-100 shadow-xs">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Profile info: Avatar & Name */}
        <div 
          onClick={onOpenEditProfile}
          className="flex items-center gap-3 cursor-pointer group"
          id="profile-header-card"
          title="برای ویرایش مشخصات و آواتار کلیک کنید"
        >
          <div className="relative">
            {profile.frameStyle === 'crown' && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-sm z-10">👑</span>
            )}
            {profile.frameStyle === 'star' && (
              <span className="absolute -top-1.5 -right-1 text-xs z-10">⭐</span>
            )}
            {profile.frameStyle === 'flower' && (
              <span className="absolute -top-1.5 -right-1 text-xs z-10">🌸</span>
            )}

            <div className={`w-12 h-12 rounded-2xl bg-linear-to-tr from-amber-100 to-pink-100 border-2 overflow-hidden flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform ${
              profile.frameStyle === 'crown' ? 'border-amber-400 ring-2 ring-amber-300/30' :
              profile.frameStyle === 'star' ? 'border-yellow-400 ring-2 ring-yellow-300/30' :
              profile.frameStyle === 'flower' ? 'border-pink-400 ring-2 ring-pink-300/30' :
              'border-amber-300'
            }`}>
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                profile.avatar
              )}
            </div>
            <span className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-xs flex items-center justify-center shadow-xs">
              {level.badge}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-800 text-base group-hover:text-pink-600 transition-colors">
                {profile.name}
              </span>
              <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-500 transition-colors" />
            </div>
            <span className="text-[11px] font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
              {profile.title || level.title}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme customizer button */}
          <button
            onClick={onOpenThemeModal}
            className="p-2 rounded-xl border border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100 transition"
            id="open-theme-customizer-btn"
            title="تغییر تم رنگی برنامه"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Install on phone button */}
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold py-1.5 px-2.5 sm:px-3 rounded-xl shadow-xs active:scale-95 transition"
            id="open-install-guide-btn"
            title="نصب روی گوشی سامسونگ یا اندروید"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">نصب روی گوشی</span>
            <span className="xs:hidden">نصب</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition ${
              settings.soundEnabled
                ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
            }`}
            id="toggle-sound-btn"
            title={settings.soundEnabled ? 'صدا روشن است' : 'صدا خاموش است'}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Parent Lock toggle */}
          <button
            onClick={onToggleParentLock}
            className={`p-2 rounded-xl border transition flex items-center gap-1 text-xs font-semibold ${
              settings.isParentLocked
                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
            }`}
            id="toggle-parent-lock-btn"
            title={settings.isParentLocked ? 'حالت والدین قفل است (برای محافظت از دستکاری)' : 'حالت والدین فعال است (امکان ویرایش و حذف)'}
          >
            {settings.isParentLocked ? (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span className="hidden sm:inline">قفل کودک</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">والدین</span>
              </>
            )}
          </button>

          {/* Backup / Settings modal */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
            id="open-settings-modal-btn"
            title="پشتیبان‌گیری و تنظیمات"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
