export type GoalStatus = "In Progress" | "Achieved" | "On Track" | "At Risk";
export type GoalScope = "Personal" | "Team" | "Company";

export interface Goal {
  id: number;
  title: string;
  category: string;
  scope: GoalScope;
  targetMetric: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline: string;
  status: GoalStatus;
  notes?: string;
  milestones?: {
    id: number;
    title: string;
    completed: boolean;
  }[];
}

export interface GoalSummaryStats {
  totalGoals: number;
  achievedCount: number;
  onTrackCount: number;
  atRiskCount?: number;
  avgCompletionRate: number;
}


