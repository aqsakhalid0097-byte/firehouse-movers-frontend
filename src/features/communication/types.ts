export type LogCategory =
  | "Safety Incident"
  | "Vehicle & Equipment"
  | "Customer Feedback"
  | "Disciplinary / Conduct"
  | "Commendation"
  | "Operations Note";

export type LogUrgency = "Low" | "Medium" | "High" | "Critical";
export type LogStatus = "Open" | "In Review" | "Resolved";

export interface LogEntry {
  id: number;
  subject: string;
  category: LogCategory;
  urgency: LogUrgency;
  status: LogStatus;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  involvedStaff?: string;
  jobOrTruckNumber?: string;
  content: string;
  dateCreated: string;
  attachmentsCount?: number;
}

export interface LogSummaryStats {
  totalLogs: number;
  criticalCount: number;
  pendingReviewCount: number;
  resolvedCount: number;
}
