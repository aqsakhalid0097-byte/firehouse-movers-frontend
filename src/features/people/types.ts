export type StaffRole =
  | "Driver"
  | "Mover"
  | "Crew Lead"
  | "Operations Manager"
  | "Dispatch Coordinator"
  | "Safety Officer"
  | "Branch Manager"
  | "Admin"
  | (string & {});

export type StaffStatus = "Active" | "On Duty" | "On Leave" | "Inactive" | (string & {});

export interface StaffMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  position?: string;
  department: string;
  status: StaffStatus;
  avatarUrl?: string;
  hireDate?: string;
  completedMoves?: number;
  rating?: number;
  driverLicense?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}
