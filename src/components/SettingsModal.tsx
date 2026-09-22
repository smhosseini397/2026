import React, { useRef, useState } from 'react';
import { X, Download, Upload, RotateCcw, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import { ChildProfile, BehaviorItem, RewardItem, HistoryRecord, AppSettings } from '../types';
import { DEFAULT_BEHAVIORS, DEFAULT_PROFILE, DEFAULT_REWARDS, DEFAULT_SETTINGS, DEFAULT_HISTORY } from '../utils/storage';

interface Props {
  isOpen: boolean;
  profile: ChildProfile;
  behaviors: BehaviorItem[];
  rewards: RewardItem[];
  history: HistoryRecord[];
  settings: AppSettings;
  onClose: () => void;
  onRestoreData: (data: {
    profile: ChildProfile;
    behaviors: BehaviorItem[];
    rewards: RewardItem[];
    history: HistoryRecord[];
    settings: AppSettings;
  }) => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  profile,
  behaviors,
  rewards,
  history,
  settings,
  onClose,
  onRestoreData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Export data as JSON file
  const handleExport = () => {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      profile,
      behaviors,
      rewards,
      history,
      settings,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `star_score_${profile.name}_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSuccessMsg('فایل پشتیبان با موفقیت دانلود شد.');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // Import JSON backup
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed.profile && parsed.behaviors && parsed.rewards) {
          onRestoreData({
            profile: parsed.profile,
            behaviors: parsed.behaviors,
            rewards: parsed.rewards,
            history: parsed.history || [],
            settings: parsed.settings || settings,
          });
          setSuccessMsg('اطلاعات با موفقیت بازیابی شد!');
          setTimeout(() => {
            setSuccessMsg(null);
            onClose();
          }, 1500);
        } else {
          setErrorMsg('فرمت فایل پشتیبان نامعتبر است.');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('خطا در خواندن فایل.');
      }
    };
    reader.readAsText(file);
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('آیا از بازنشانی داده‌ها به حالت اولیه اطمینان دارید؟ تمامی کارهای سفارشی و تاریخچه پاک خواهند شد.')) {
      onRestoreData({
        profile: DEFAULT_PROFILE,
        behaviors: DEFAULT_BEHAVIORS,
        rewards: DEFAULT_REWARDS,
        history: DEFAULT_HISTORY,
        settings: DEFAULT_SETTINGS,
      });
      setSuccessMsg('داده‌ها به حالت پیش‌فرض بازگشتند.');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        id="settings-modal"
      >
        {/* Header */}
        <div className="bg-slate-800 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>تنظیمات و پشتیبان‌گیری</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            ذخیره و بازیابی اطلاعات دخترم در صورت تعویض گوشی
          </p>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Backup Download */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">پشتیبان‌گیری (دانلود فایل)</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  امتیازها، تاریخچه و پاداش‌ها را در یک فایل روی گوشی ذخیره کنید
                </p>
              </div>
              <button
                onClick={handleExport}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs transition"
                id="export-backup-btn"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>دانلود</span>
              </button>
            </div>
          </div>

          {/* Backup Restore */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">بازیابی از فایل پشتیبان</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  فایل پشتیبان دانلود شده قبلی را انتخاب و بارگذاری کنید
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs transition"
                id="import-backup-btn"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>انتخاب فایل</span>
              </button>
            </div>
          </div>

          {/* Reset button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleResetToDefault}
              className="w-full py-2.5 px-3 border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
              id="reset-defaults-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی به رفتارهای پیش‌فرض</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
