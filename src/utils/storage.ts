import { AppSettings, BehaviorItem, ChildProfile, HistoryRecord, RewardItem } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'star_score_profile_v1',
  BEHAVIORS: 'star_score_behaviors_v1',
  REWARDS: 'star_score_rewards_v1',
  HISTORY: 'star_score_history_v1',
  SETTINGS: 'star_score_settings_v1',
};

export const DEFAULT_PROFILE: ChildProfile = {
  name: 'دختر گلم',
  avatar: '👧',
  title: 'فرشته مهربان',
  totalEarned: 35,
  currentPoints: 35,
  pinnedRewardId: 'rew-playtime',
  frameStyle: 'crown',
};

export const DEFAULT_BEHAVIORS: BehaviorItem[] = [
  // کارهای خوب
  {
    id: 'good-1',
    title: 'مسواک زدن تمیز دندان‌ها',
    category: 'good',
    points: 5,
    icon: '🪥',
    description: 'صبح و شب بعد از غذا',
    isDefault: true,
  },
  {
    id: 'good-2',
    title: 'مرتب کردن اتاق و اسباب‌بازی‌ها',
    category: 'good',
    points: 10,
    icon: '🧸',
    description: 'چیدن وسایل در جای خود',
    isDefault: true,
  },
  {
    id: 'good-3',
    title: 'انجام به موقع مشق و تمرین‌ها',
    category: 'good',
    points: 15,
    icon: '📚',
    description: 'بدون معطلی و با دقت',
    isDefault: true,
  },
  {
    id: 'good-4',
    title: 'خوابیدن به موقع سر وقت شب',
    category: 'good',
    points: 10,
    icon: '🌙',
    description: 'خواب آرام در ساعت تعیین‌شده',
    isDefault: true,
  },
  {
    id: 'good-5',
    title: 'کمک به مامان یا بابا در خانه',
    category: 'good',
    points: 10,
    icon: '🤝',
    description: 'چیدن سفره یا جمع کردن وسایل',
    isDefault: true,
  },
  {
    id: 'good-6',
    title: 'خوردن کامل غذا و میوه سالم',
    category: 'good',
    points: 5,
    icon: '🍎',
    description: 'خوردن تغذیه مقوی و سالم',
    isDefault: true,
  },
  {
    id: 'good-7',
    title: 'ادب، سلام و حرف‌های محبت‌آمیز',
    category: 'good',
    points: 5,
    icon: '💖',
    description: 'مهربانی با دیگران و کلمات زیبا',
    isDefault: true,
  },
  {
    id: 'good-8',
    title: 'خواندن کتاب داستان یا نقاشی زیبا',
    category: 'good',
    points: 10,
    icon: '📖',
    description: 'مطالعه و خلاقیت فردی',
    isDefault: true,
  },

  // کارهای نیازمند اصلاح و تلاش بیشتر
  {
    id: 'bad-1',
    title: 'لجبازی، داد زدن یا قهر کردن',
    category: 'bad',
    points: 10,
    icon: '😤',
    description: 'به جای حرف زدن با آرامش',
    isDefault: true,
  },
  {
    id: 'bad-2',
    title: 'استفاده بیش از حد از گوشی یا تبلت',
    category: 'bad',
    points: 10,
    icon: '📱',
    description: 'بیشتر از زمان تعیین‌شده',
    isDefault: true,
  },
  {
    id: 'bad-3',
    title: 'ریخت و پاش و جمع نکردن وسایل',
    category: 'bad',
    points: 5,
    icon: '🌪️',
    description: 'رها کردن اسباب‌بازی‌ها در پذیرایی',
    isDefault: true,
  },
  {
    id: 'bad-4',
    title: 'دیر خوابیدن و بهانه‌گیری شب',
    category: 'bad',
    points: 5,
    icon: '⏰',
    description: 'نرفتن به رختخواب در زمان خواب',
    isDefault: true,
  },
  {
    id: 'bad-5',
    title: 'نخوردن غذا و بدغذایی',
    category: 'bad',
    points: 5,
    icon: '🥦',
    description: 'رد کردن غذای سالم سفره',
    isDefault: true,
  },
  {
    id: 'bad-6',
    title: 'بی‌احترامی یا حرف نامناسب',
    category: 'bad',
    points: 10,
    icon: '⚠️',
    description: 'رعایت نکردن احترام بزرگترها',
    isDefault: true,
  },
];

export const DEFAULT_REWARDS: RewardItem[] = [
  {
    id: 'rew-treat',
    title: 'خرید بستنی یا خوراکی مورد علاقه',
    requiredPoints: 30,
    icon: '🍦',
    description: 'یک خوراکی خوشمزه دلخواه بعد از ظهر',
    redeemedCount: 1,
    category: 'meal',
    isDefault: true,
  },
  {
    id: 'rew-playtime',
    title: 'زمان بیشتر برای بازی (تبلت، کارتون یا بازی دلخواه)',
    requiredPoints: 40,
    icon: '🎮',
    description: 'یک ساعت بازی ویدئویی، تبلت یا تماشای کارتون سینمایی',
    redeemedCount: 0,
    category: 'playtime',
    isDefault: true,
  },
  {
    id: 'rew-meal',
    title: 'یک وعده غذایی مورد علاقه (پیتزا، ماکارونی یا غذای انتخابی)',
    requiredPoints: 50,
    icon: '🍕',
    description: 'انتخاب ناهار یا شام دلخواه توسط دخترم در کنار خانواده',
    redeemedCount: 0,
    category: 'meal',
    isDefault: true,
  },
  {
    id: 'rew-toy',
    title: 'خرید یک اسباب‌بازی کوچک یا فیگور دلخواه',
    requiredPoints: 80,
    icon: '🧸',
    description: 'خرید عروسک، فیگور، پازل یا اسباب‌بازی کوچک به انتخاب خودش',
    redeemedCount: 0,
    category: 'toy',
    isDefault: true,
  },
  {
    id: 'rew-book',
    title: 'خرید کتاب داستان، دفتر نقاشی فانتزی و برچسب',
    requiredPoints: 60,
    icon: '🎨',
    description: 'لوازم التحریر جذاب، ماژیک یا کتاب داستان جدید',
    redeemedCount: 0,
    category: 'activity',
    isDefault: true,
  },
  {
    id: 'rew-park',
    title: 'رفتن به شهربازی یا پارک بازی',
    requiredPoints: 120,
    icon: '🎡',
    description: 'یک بعدازظهر پر از هیجان و بازی در شهربازی',
    redeemedCount: 0,
    category: 'activity',
    isDefault: true,
  },
  {
    id: 'rew-big-toy',
    title: 'خرید اسباب‌بازی دلخواه یا جایزه ویژه',
    requiredPoints: 200,
    icon: '🎁',
    description: 'جایزه ویژه و ارزشمند برای تلاش عالی و مداوم',
    redeemedCount: 0,
    category: 'toy',
    isDefault: true,
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  parentPin: '1234',
  isParentLocked: false,
  soundEnabled: true,
  theme: 'pink',
};

export const DEFAULT_HISTORY: HistoryRecord[] = [
  {
    id: 'hist-1',
    timestamp: Date.now() - 3600000 * 24,
    type: 'good_behavior',
    title: 'مرتب کردن اتاق و اسباب‌بازی‌ها',
    pointsChange: 10,
    icon: '🧸',
    note: 'آفرین به دختر مهربانم!',
  },
  {
    id: 'hist-2',
    timestamp: Date.now() - 3600000 * 18,
    type: 'good_behavior',
    title: 'انجام به موقع مشق و تمرین‌ها',
    pointsChange: 15,
    icon: '📚',
    note: 'خیلی خوش‌خط و عالی نوشت',
  },
  {
    id: 'hist-3',
    timestamp: Date.now() - 3600000 * 10,
    type: 'good_behavior',
    title: 'مسواک زدن تمیز دندان‌ها',
    pointsChange: 10,
    icon: '🪥',
  },
];

// Helper to load from localStorage safely
export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

// Helper to save to localStorage safely
export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing ${key} to storage:`, err);
  }
}

export { STORAGE_KEYS };

// Calculate Title/Badge based on total points
export function calculateLevel(totalEarned: number): { title: string; badge: string; nextLevelAt: number } {
  if (totalEarned < 50) return { title: 'ستاره نوظهور', badge: '🌱', nextLevelAt: 50 };
  if (totalEarned < 120) return { title: 'فرشته پرتلاش', badge: '⭐', nextLevelAt: 120 };
  if (totalEarned < 250) return { title: 'قهرمان مهربانی', badge: '🌟', nextLevelAt: 250 };
  if (totalEarned < 500) return { title: 'ملکه ستاره‌ها', badge: '👑', nextLevelAt: 500 };
  return { title: 'اسطوره درخشان', badge: '✨', nextLevelAt: 1000 };
}

// Convert numbers to Persian numerals
export function toPersianDigits(num: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

// Format relative date in Persian
export function formatPersianTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / (3600000 * 24));

  if (minutes < 2) return 'همین الان';
  if (minutes < 60) return `${toPersianDigits(minutes)} دقیقه پیش`;
  if (hours < 24) return `${toPersianDigits(hours)} ساعت پیش`;
  if (days === 1) return 'دیروز';
  if (days < 7) return `${toPersianDigits(days)} روز پیش`;

  const date = new Date(timestamp);
  return date.toLocaleDateString('fa-IR');
}
