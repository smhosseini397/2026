import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, KeyRound } from 'lucide-react';

interface Props {
  isOpen: boolean;
  isCurrentlyLocked: boolean;
  parentPin: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ParentPinModal: React.FC<Props> = ({
  isOpen,
  parentPin,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    if (pin === parentPin) {
      setPin('');
      setError(false);
      onSuccess();
      onClose();
      return;
    }

    setError(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        id="parent-pin-modal"
      >
        <div className="bg-linear-to-r from-slate-800 to-slate-900 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-base font-extrabold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>ورود والدین</span>
          </h2>

          <p className="text-xs text-slate-300 mt-1">
            برای مدیریت امتیازها و پاداش‌ها، رمز والدین را وارد کنید.
          </p>
        </div>

        <form
          onSubmit={handleVerify}
          className="p-5 space-y-4"
        >
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>رمز والدین</span>
            </label>

            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="رمز را وارد کنید"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base text-center font-mono tracking-[0.35em] focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              id="parent-pin-input"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-bold text-center animate-shake">
              رمز والدین اشتباه است!
            </p>
          )}

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition active:scale-95"
              id="confirm-parent-pin-btn"
            >
              ورود به بخش والدین
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
