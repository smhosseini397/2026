import React, { useState } from 'react';
import { Smartphone, CheckCircle2, X, Download, Share2, Globe, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install, isSamsungBrowser } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'samsung' | 'chrome'>(
    isSamsungBrowser ? 'samsung' : 'samsung'
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200/80 overflow-hidden flex flex-col max-h-[90vh]"
        id="install-modal"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-amber-500 via-amber-400 to-yellow-400 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
            id="close-install-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/30">
              📲
            </div>
            <div>
              <h2 className="text-xl font-bold">نصب برنامه روی گوشی سامسونگ</h2>
              <p className="text-xs text-amber-100 font-medium">بدون نیاز به بازار و گوگل‌پلی، رایگان و آفلاین</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Quick Direct Install if browser supports standard prompt */}
          {isInstallable && !isInstalled && (
            <div className="bg-linear-to-br from-emerald-50 to-emerald-100/70 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold mb-1">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>گوشی شما آماده نصب خودکار است!</span>
              </div>
              <p className="text-xs text-emerald-700 mb-3">
                تنها با لمس دکمه زیر، آیکون برنامه به صفحه اصلی گوشی شما اضافه می‌شود.
              </p>
              <button
                onClick={async () => {
                  const res = await install();
                  if (res) onClose();
                }}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition"
                id="direct-install-action-btn"
              >
                <Download className="w-5 h-5" />
                نصب فوری روی صفحه اصلی
              </button>
            </div>
          )}

          {isInstalled && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-sm">برنامه قبلاً نصب شده است</div>
                <div className="text-xs text-emerald-600">می‌توانید مستقیماً از صفحه اصلی گوشی آن را باز کنید.</div>
              </div>
            </div>
          )}

          {/* Browser Selection Tabs */}
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-2">مرورگر خود در گوشی سامسونگ را انتخاب کنید:</div>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('samsung')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'samsung'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
                id="tab-samsung-browser-btn"
              >
                <Smartphone className="w-4 h-4 text-indigo-600" />
                مرورگر سامسونگ
              </button>
              <button
                onClick={() => setActiveTab('chrome')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'chrome'
                    ? 'bg-white text-amber-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
                id="tab-chrome-browser-btn"
              >
                <Globe className="w-4 h-4 text-amber-600" />
                مرورگر گوگل کروم
              </button>
            </div>
          </div>

          {/* Step by step instructions */}
          {activeTab === 'samsung' ? (
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 space-y-3">
              <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">۱</span>
                <span>در مرورگر اینترنت سامسونگ (Samsung Internet):</span>
              </div>
              <p className="text-xs text-indigo-800 pr-6">
                روی منوی <strong>سه خط افقی (☰)</strong> در گوشه پایین صفحه بزنید.
              </p>

              <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">۲</span>
                <span>گزینه افزودن صفحه:</span>
              </div>
              <p className="text-xs text-indigo-800 pr-6">
                گزینه <strong>«افزودن صفحه به» (Add page to)</strong> را انتخاب کنید.
              </p>

              <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">۳</span>
                <span>انتخاب صفحه اصلی:</span>
              </div>
              <p className="text-xs text-indigo-800 pr-6">
                گزینه <strong>«صفحه اصلی» (Home screen)</strong> یا <strong>«نصب برنامه»</strong> را بزنید. تمام!
              </p>
            </div>
          ) : (
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-3">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">۱</span>
                <span>در مرورگر گوگل کروم گوشی:</span>
              </div>
              <p className="text-xs text-amber-800 pr-6">
                روی آیکون <strong>سه نقطه (⋮)</strong> در بالا سمت راست مرورگر بزنید.
              </p>

              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">۲</span>
                <span>نصب یا افزودن به صفحه اصلی:</span>
              </div>
              <p className="text-xs text-amber-800 pr-6">
                گزینه <strong>«نصب برنامه» (Install app)</strong> یا <strong>«افزودن به صفحه اصلی» (Add to Home screen)</strong> را بزنید.
              </p>

              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">۳</span>
                <span>تایید نهایی:</span>
              </div>
              <p className="text-xs text-amber-800 pr-6">
                روی دکمه «نصب» بزنید تا مانند یک اپلیکیشن بومی در لیست برنامه‌های گوشی ظاهر شود.
              </p>
            </div>
          )}

          {/* Copy Link to Send to Phone */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-2">
            <div className="truncate text-xs text-slate-600 font-mono text-left dir-ltr max-w-[200px]">
              {currentUrl}
            </div>
            <button
              onClick={handleCopy}
              className="py-1.5 px-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition"
              id="copy-link-btn"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  کپی شد!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  کپی آدرس
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-sm transition"
            id="close-modal-footer-btn"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};
