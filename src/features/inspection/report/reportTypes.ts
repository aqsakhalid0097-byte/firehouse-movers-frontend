export interface FrequencyItem {
  id: string;
  vehicleName: string;
  vehicleType: string;
  inspectionCount: number;
  lastInspection: string;
  inspectionDifference: number;
}

export interface MissingEquipmentItem {
  id: string;
  vehicleName: string;
  missingItems: Array<{ item: string; inspectionDate: string }>;
}

export interface ReadinessItem {
  id: string;
  vehicleName: string;
  vehicleType: string;
  lastInspection: string;
  readinessScore: number;
  readyItems: number;
  totalItems: number;
}

export interface UserActivityItem {
  id: string;
  username: string;
  role: string;
  inspectionsCount: number;
  lastInspectionDate: string;
}

export interface ComparisonItem {
  id: string;
  vehicle: string;
  driver: string;
  manager: string;
  inspectionDate: string;
  discrepancies: string[];
}
