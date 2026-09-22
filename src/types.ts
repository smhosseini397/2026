export type BehaviorCategory = 'good' | 'bad';

export type AppTheme = 'gold' | 'pink' | 'purple' | 'emerald' | 'coral';

export interface ChildProfile {
  name: string;
  avatar: string; // Emoji or default avatar
  photoUrl?: string; // Custom uploaded image from gallery or camera
  title: string;
  totalEarned: number; // کل امتیازات ثبت شده تا به حال
  currentPoints: number; // موجودی فعلی قابل تبدیل به پاداش
  pinnedRewardId?: string; // پاداش هدف تعیین شده برای پیگیری
  frameStyle?: 'star' | 'flower' | 'crown' | 'circle';
}

export interface BehaviorItem {
  id: string;
  title: string;
  category: BehaviorCategory;
  points: number; // همیشه عدد مثبت ذخیره می‌شود؛ موقع اعمال برای 'bad' کسر می‌شود
  icon: string;
  description?: string;
  isDefault?: boolean;
}

export interface RewardItem {
  id: string;
  title: string;
  requiredPoints: number;
  icon: string;
  description?: string;
  redeemedCount: number;
  category?: 'playtime' | 'toy' | 'meal' | 'activity' | 'custom';
  isDefault?: boolean;
}

export type HistoryRecordType = 'good_behavior' | 'bad_behavior' | 'reward_redeemed' | 'manual_adjust';

export interface HistoryRecord {
  id: string;
  timestamp: number;
  type: HistoryRecordType;
  title: string;
  pointsChange: number; // مثلا +10 یا -10 یا -50 برای پاداش
  icon: string;
  note?: string;
}

export interface AppSettings {
  parentPin: string;
  isParentLocked: boolean;
  soundEnabled: boolean;
  theme: AppTheme;
}
