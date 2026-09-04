export interface DepartmentMember {
  id: number;
  name: string;
  role: string;
  avatarUrl?: string;
  email: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description: string;
  leadManager: string;
  leadManagerAvatar?: string;
  memberCount: number;
  activeShifts: number;
  stationLocation: string;
  budgetStatus: "On Target" | "Under Budget" | "Review Needed";
  iconName: string;
  colorScheme: string;
  members: DepartmentMember[];
}
