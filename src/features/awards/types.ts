export interface PersonalAward {
  id: number;
  title: string;
  description: string;
  awardedDate: string;
  rewardAmount: string;
  avatarUrl?: string;
}

export interface HallOfFameEntry {
  id: number;
  recipientName: string;
  citation: string;
  inductedDate: string;
  avatarUrl?: string;
}
