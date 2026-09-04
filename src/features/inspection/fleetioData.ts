// Fleetio Data Models & Types

export interface FleetioVehicleItem {
  id: number;
  name: string;
  vehicle_status_name?: string;
  vehicle_type_name?: string;
  group_name?: string;
  operator_name?: string;
  year?: number | string;
  make?: string;
  model?: string;
  vin?: string;
  license_plate?: string;
  primary_meter_value?: string | number;
  primary_meter_unit?: string;
  issues_count?: number;
  service_entries_count?: number;
  [key: string]: unknown;
}

export interface FleetioAssignmentItem {
  id: number;
  vehicle_name?: string;
  vehicle_type?: string;
  contact_name?: string;
  status?: string;
  started_at?: string;
  ended_at?: string;
  start_meter?: string | number;
  end_meter?: string | number;
  license_plate?: string;
  group_name?: string;
  comments?: string;
  [key: string]: unknown;
}

export interface FleetioServiceEntryItem {
  id: number;
  display_reference?: string;
  display_date?: string;
  display_vehicle_name?: string;
  display_vendor_name?: string;
  display_status?: string;
  display_total_cost?: string;
  display_meter_value?: string;
  [key: string]: unknown;
}

export interface FleetioWorkOrderItem {
  id: number;
  number?: string;
  status?: string;
  priority?: string;
  vehicle_name?: string;
  scheduled_start?: string;
  total_cost?: string | number;
  [key: string]: unknown;
}

export interface FleetioServiceReminderItem {
  id?: number;
  vehicle_name?: string;
  service_task?: string;
  status?: string;
  due_date?: string;
  due_meter?: string;
  overdue?: string;
  [key: string]: unknown;
}

export interface FleetioServiceTaskItem {
  id: number;
  name?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  [key: string]: unknown;
}

export interface FleetioFuelEntryItem {
  id: number;
  date?: string;
  vehicle_name?: string;
  fuel_type?: string;
  gallons?: number | string;
  price_per_gallon?: string;
  total_cost?: string;
  meter_value?: string;
  fuel_card?: string;
  [key: string]: unknown;
}

export interface FleetioMeterEntryItem {
  id: number;
  date?: string;
  vehicle_name?: string;
  meter_value?: string;
  meter_type?: string;
  void?: string;
  [key: string]: unknown;
}

export interface FleetioExpenseEntryItem {
  id: number;
  date?: string;
  vehicle_name?: string;
  expense_type?: string;
  vendor?: string;
  amount?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface FleetioIssueItem {
  id: number;
  priority?: string;
  name?: string;
  type?: string;
  summary?: string;
  issue_status?: string;
  source?: string;
  reported?: string;
  assigned_to?: string;
  [key: string]: unknown;
}

export interface FleetioPriorityItem {
  id: number;
  name?: string;
  level?: number;
  color?: string;
  description?: string;
  [key: string]: unknown;
}

export interface FleetioPartItem {
  id: number;
  part_number?: string;
  name?: string;
  category?: string;
  quantity_on_hand?: number;
  unit_cost?: string;
  location?: string;
  [key: string]: unknown;
}

export interface FleetioPurchaseOrderItem {
  id: number;
  po_number?: string;
  status?: string;
  vendor_name?: string;
  order_date?: string;
  total_cost?: string;
  items_count?: number;
  [key: string]: unknown;
}

export interface FleetioInspectionScheduleItem {
  id: number;
  title?: string;
  frequency?: string;
  vehicle_group?: string;
  next_due?: string;
  status?: string;
  [key: string]: unknown;
}

export interface FleetioSubmittedFormItem {
  id: number;
  form_name?: string;
  vehicle_name?: string;
  submitted_at?: string;
  inspector_name?: string;
  result_status?: string;
  defects_found?: number;
  [key: string]: unknown;
}

export interface FleetioVendorItem {
  id: number;
  name?: string;
  category?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
  [key: string]: unknown;
}

export interface FleetioContactItem {
  id: number;
  name?: string;
  job_title?: string;
  group_name?: string;
  phone?: string;
  email?: string;
  status?: string;
  [key: string]: unknown;
}
