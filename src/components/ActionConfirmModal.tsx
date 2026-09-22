import React, { useState } from 'react';
import { X, Sparkles, Check, AlertTriangle, Gift } from 'lucide-react';
import { BehaviorItem, RewardItem } from '../types';
import { toPersianDigits } from '../utils/storage';

type ConfirmTarget = 
  | { type: 'behavior'; item: BehaviorItem }
  | { type: 'reward'; item: RewardItem };

interface Props {
  target: ConfirmTarget | null;
  onClose: () => void;
  onConfirm: (note?: string) => void;
}

export const ActionConfirmModal: React.FC<Props> = ({ target, onClose, onConfirm }) => {
  const [note, setNote] = useState('');

  if (!target) return null;

  const isReward = target.type === 'reward';
  const isBehavior = target.type === 'behavior';
  const isGood = isBehavior && target.item.category === 'good';
  const isBad = isBehavior && target.item.category === 'bad';

  const item = target.item;

  const handleConfirm = () => {
    onConfirm(note.trim() || undefined);
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border overflow-hidden flex flex-col"
        id="action-confirm-modal"
      >
        {/* Header Visual */}
        <div className={`p-6 text-center text-white relative ${
          isGood
            ? 'bg-linear-to-b from-emerald-400 to-teal-500'
            : isReward
            ? 'bg-linear-to-b from-pink-500 to-rose-500'
            : 'bg-linear-to-b from-rose-500 to-red-600'
        }`}>
          <button
            onClick={onClose}
            className="absolute left-3 top-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-20 h-20 mx-auto rounded-3xl bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-5xl shadow-inner mb-3">
            {item.icon}
          </div>

          <h3 className="text-xl font-black">
            {item.title}
          </h3>

          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white text-xs font-bold">
            {isGood && (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>افزایش {toPersianDigits(target.item.points)} ستاره طلایی</span>
              </>
            )}
            {isBad && (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-300" />
                <span>کسر {toPersianDigits(target.item.points)} ستاره</span>
              </>
            )}
            {isReward && (
              <>
                <Gift className="w-3.5 h-3.5 text-yellow-300" />
                <span>تحویل پاداش (-{toPersianDigits(target.item.requiredPoints)} ستاره)</span>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {item.description && (
            <p className="text-xs text-slate-500 text-center font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              {item.description}
            </p>
          )}

          {/* Optional Note input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {isGood ? 'پیام تشویقی یا یادداشت (اختیاری):' : 'توضیحات یا یادداشت (اختیاری):'}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={isGood ? 'مثلاً: آفرین به دختر پرتلاشم!' : 'مثلاً: قول داد فردا به موقع بخوابد'}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:outline-hidden transition"
              id="confirm-note-input"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handleConfirm}
              className={`flex-1 py-3 px-4 text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition ${
                isGood
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                  : isReward
                  ? 'bg-pink-600 hover:bg-pink-700 shadow-pink-600/25'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
              }`}
              id="confirm-action-submit-btn"
            >
              <Check className="w-4 h-4" />
              <span>
                {isGood ? 'ثبت و تشویق ⭐' : isReward ? 'تایید و تحویل پاداش 🎁' : 'ثبت کسر امتیاز'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
