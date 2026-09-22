import { AppTheme } from '../types';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  emoji: string;
  description: string;
  headerGrad: string;
  scoreBannerGrad: string;
  bgGrad: string;
  accentBtn: string;
  accentBorder: string;
  pillActive: string;
  glowColor: string;
}

export const APP_THEMES: Record<AppTheme, ThemeConfig> = {
  pink: {
    id: 'pink',
    name: 'صورتی پرنسسی',
    emoji: '🌸',
    description: 'شاداب، رؤیایی و دوست‌داشتنی',
    headerGrad: 'from-pink-500 via-rose-400 to-pink-400',
    scoreBannerGrad: 'from-pink-400 via-rose-500 to-pink-600',
    bgGrad: 'from-pink-50/60 via-white to-rose-50/40',
    accentBtn: 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-500/25',
    accentBorder: 'border-pink-300',
    pillActive: 'bg-pink-500 text-white shadow-xs shadow-pink-500/25',
    glowColor: 'rgba(236, 72, 153, 0.3)',
  },
  gold: {
    id: 'gold',
    name: 'طلایی ستاره‌ای',
    emoji: '⭐',
    description: 'درخشان و الهام‌بخش قهرمانان',
    headerGrad: 'from-amber-500 via-amber-400 to-yellow-400',
    scoreBannerGrad: 'from-amber-400 via-amber-500 to-yellow-500',
    bgGrad: 'from-amber-50/60 via-white to-yellow-50/40',
    accentBtn: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25',
    accentBorder: 'border-amber-300',
    pillActive: 'bg-amber-500 text-white shadow-xs shadow-amber-500/25',
    glowColor: 'rgba(245, 158, 11, 0.3)',
  },
  purple: {
    id: 'purple',
    name: 'یاسی جادویی',
    emoji: '🦄',
    description: 'کهکشانی، افسانه‌ای و خلاق',
    headerGrad: 'from-purple-600 via-fuchsia-500 to-indigo-500',
    scoreBannerGrad: 'from-purple-500 via-fuchsia-600 to-indigo-600',
    bgGrad: 'from-purple-50/60 via-white to-fuchsia-50/40',
    accentBtn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25',
    accentBorder: 'border-purple-300',
    pillActive: 'bg-purple-600 text-white shadow-xs shadow-purple-500/25',
    glowColor: 'rgba(147, 51, 234, 0.3)',
  },
  emerald: {
    id: 'emerald',
    name: 'فیروزه‌ای طبیعت',
    emoji: '🌿',
    description: 'آرامش‌بخش، سرسبز و پرانرژی',
    headerGrad: 'from-emerald-500 via-teal-500 to-cyan-500',
    scoreBannerGrad: 'from-emerald-400 via-teal-500 to-cyan-600',
    bgGrad: 'from-emerald-50/60 via-white to-teal-50/40',
    accentBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25',
    accentBorder: 'border-emerald-300',
    pillActive: 'bg-emerald-600 text-white shadow-xs shadow-emerald-500/25',
    glowColor: 'rgba(16, 185, 129, 0.3)',
  },
  coral: {
    id: 'coral',
    name: 'مرجانی بهاری',
    emoji: '🌈',
    description: 'گرم، پرشور و پرنشاط',
    headerGrad: 'from-orange-500 via-rose-500 to-amber-500',
    scoreBannerGrad: 'from-orange-400 via-rose-500 to-amber-500',
    bgGrad: 'from-orange-50/60 via-white to-rose-50/40',
    accentBtn: 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25',
    accentBorder: 'border-orange-300',
    pillActive: 'bg-orange-500 text-white shadow-xs shadow-orange-500/25',
    glowColor: 'rgba(249, 115, 22, 0.3)',
  },
};
