import React, { useState } from 'react';
import { X, ShieldCheck, ShieldAlert, KeyRound } from 'lucide-react';

interface Props {
  isOpen: boolean;
  isCurrentlyLocked: boolean;
  parentPin: string;
  onClose: () => void;
  onSuccess: (newLockState: boolean) => void;
}

export const ParentPinModal: React.FC<Props> = ({
  isOpen,
  isCurrentlyLocked,
  parentPin,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [mathNum1] = useState(Math.floor(Math.random() * 6) + 7); // 7 to 12
  const [mathNum2] = useState(Math.floor(Math.random() * 6) + 4); // 4 to 9
  const [mathAnswer, setMathAnswer] = useState('');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const isPinCorrect = pin === parentPin || pin === '1234';
    const isMathCorrect = parseInt(mathAnswer) === mathNum1 + mathNum2;

    if (isPinCorrect || isMathCorrect) {
      onSuccess(!isCurrentlyLocked);
      setPin('');
      setMathAnswer('');
      setError(false);
      onClose();
    } else {
      setError(true);
    }
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
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold flex items-center gap-2">
            {isCurrentlyLocked ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <ShieldAlert className="w-5 h-5 text-amber-400" />}
            <span>{isCurrentlyLocked ? 'بازگشایی حالت والدین' : 'فعال‌سازی قفل کودک'}</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {isCurrentlyLocked 
              ? 'برای حذف یا تغییر پاداش‌ها و امتیازها، لطفا رمز یا سوال ریاضی را پاسخ دهید'
              : 'برای جلوگیری از دستکاری اتفاقی امتیازها، حالت قفل کودک را فعال کنید'}
          </p>
        </div>

        <form onSubmit={handleVerify} className="p-5 space-y-4">
          {/* Math challenge or PIN */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              پاسخ سوال ریاضی (مخصوص والدین):
            </label>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-sm font-black text-slate-800">
                {mathNum1} + {mathNum2} = ؟
              </span>
              <input
                type="number"
                value={mathAnswer}
                onChange={(e) => {
                  setMathAnswer(e.target.value);
                  setError(false);
                }}
                placeholder="جواب"
                className="w-24 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-center font-bold focus:border-amber-500 focus:outline-hidden"
                id="parent-math-answer-input"
              />
            </div>
          </div>

          <div className="text-center text-xs text-slate-400">یا</div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>رمز عبور پیش‌فرض (۱۲۳۴):</span>
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="رمز عبور ۴ رقمی"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-center font-mono tracking-widest focus:bg-white focus:border-amber-500 focus:outline-hidden"
              id="parent-pin-input"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-bold text-center animate-shake">
              رمز عبور یا پاسخ ریاضی نادرست است!
            </p>
          )}

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition"
              id="confirm-parent-pin-btn"
            >
              تایید
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
