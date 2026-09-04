import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './axios';
import type {
  FleetioVehicleItem,
  FleetioAssignmentItem,
  FleetioServiceEntryItem,
  FleetioWorkOrderItem,
  FleetioServiceReminderItem,
  FleetioServiceTaskItem,
  FleetioFuelEntryItem,
  FleetioMeterEntryItem,
  FleetioExpenseEntryItem,
  FleetioIssueItem,
  FleetioPriorityItem,
  FleetioPartItem,
  FleetioPurchaseOrderItem,
  FleetioInspectionScheduleItem,
  FleetioSubmittedFormItem,
  FleetioVendorItem,
  FleetioContactItem,
} from '../features/inspection/fleetioData';
import type {
  FrequencyItem,
  MissingEquipmentItem,
  ReadinessItem,
  UserActivityItem,
  ComparisonItem,
} from '../features/inspection/report/reportTypes';

// ============================================================================
// INSPECTION REPORT & VEHICLES TYPES
// ============================================================================

export interface InspectionVehicle {
  id: number;
  name: string;
  number: string;
  vehicle_type: 'truck' | 'trailer';
  vin: string;
  license_plate: string;
  display_name: string;
}

export interface InspectionReportParams {
  report_type: 'frequency' | 'equipment' | 'comparison' | 'readiness' | 'activity';
  start_date?: string;
  end_date?: string;
  truck?: number | string;
  trailer?: number | string;
}

export interface InspectionReportResponse {
  report_type: string;
  start_date: string;
  end_date: string;
  total_count: number;
  results: Array<
    | FrequencyItem
    | MissingEquipmentItem
    | ReadinessItem
    | UserActivityItem
    | ComparisonItem
  >;
}

// ============================================================================
// TRUCK INSPECTION TYPES
// ============================================================================

export interface SelectChoice {
  value: string;
  label: string;
}

export interface FieldDefinition {
  name: string;
  label: string;
}

export interface TruckInspectionConfig {
  active_trucks: Array<{
    id: number;
    name: string;
    fleetio_id?: number;
    display_name?: string;
    number?: string;
  }>;
  clean_status_choices: SelectChoice[];
  trash_clean_status_choices: SelectChoice[];
  general_choices: SelectChoice[];
  spare_tyre_choices: SelectChoice[];
  in_cab_fields: FieldDefinition[];
  tool_box_fields: FieldDefinition[];
  equipment_fields: FieldDefinition[];
}

export interface TruckInspectionCreatePayload {
  date: string;
  truck_id?: number | string;
  fleetio_truck_id?: number | string;
  clean_status?: string;
  in_cab?: string;
  bed_of_truck?: string;
  cones?: string;
  spare_tire?: string;
  condition_spare_tyre?: string;
  reviewing_drivers_signature?: string;
  in_cab_items?: Record<string, string>;
  tool_box_items?: Record<string, string>;
  [key: string]: unknown;
}

export interface TruckInspectionHistoryItem {
  id: number;
  date: string;
  truck_name: string;
  truck_number: string;
  saved_by_name: string;
  clean_status: string;
  created_at: string;
}

// ============================================================================
// TRAILER INSPECTION TYPES
// ============================================================================

export interface TrailerInspectionConfig {
  active_trailers: Array<{
    id: number;
    name: string;
    fleetio_id?: number;
    display_name?: string;
    number?: string;
  }>;
  safety_choices: SelectChoice[];
  supplies_choices: SelectChoice[];
  trash_choices: SelectChoice[];
  safety_fields: FieldDefinition[];
  supplies_fields: FieldDefinition[];
}

export interface TrailerInspectionCreatePayload {
  date: string;
  trailer_id?: number | string;
  fleetio_trailer_id?: number | string;
  trash?: string;
  reviewing_drivers_signature?: string;
  safety_items?: Record<string, string>;
  supplies_items?: Record<string, string>;
  [key: string]: unknown;
}

export interface TrailerInspectionHistoryItem {
  id: number;
  date: string;
  trailer_name: string;
  trailer_number: string;
  saved_by_name: string;
  trash: string;
  created_at: string;
}

// ============================================================================
// FLEETIO GENERIC PAGINATED RESPONSE
// ============================================================================

export interface FleetioPaginatedResponse<T> {
  count?: number;
  total?: number;
  total_count?: number;
  page?: number;
  per_page?: number;
  results: T[];
  records?: T[];
}

// ============================================================================
// API FETCH FUNCTIONS & HOOKS: INSPECTION REPORTS & VEHICLES
// ============================================================================

export async function fetchInspectionVehicles(params?: { type?: string }): Promise<InspectionVehicle[]> {
  const response = await apiClient.get<InspectionVehicle[] | { results: InspectionVehicle[] }>(
    '/inspection/vehicles/',
    { params }
  );
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data?.results || [];
}

export function useInspectionVehicles(params?: { type?: string }) {
  return useQuery({
    queryKey: ['inspection', 'vehicles', params],
    queryFn: () => fetchInspectionVehicles(params),
    staleTime: 5 * 60 * 1000,
  });
}

export async function fetchInspectionReport(params: InspectionReportParams): Promise<InspectionReportResponse> {
  const response = await apiClient.get<InspectionReportResponse>('/inspection/reports/', {
    params: {
      report_type: params.report_type,
      start_date: params.start_date,
      end_date: params.end_date,
      truck: params.truck || undefined,
      trailer: params.trailer || undefined,
    },
  });
  return response.data;
}

export function useInspectionReport(params: InspectionReportParams, enabled = false) {
  return useQuery({
    queryKey: ['inspection', 'reports', params],
    queryFn: () => fetchInspectionReport(params),
    enabled,
    staleTime: 60 * 1000,
  });
}

// ============================================================================
// API FETCH FUNCTIONS & HOOKS: TRUCK INSPECTION
// ============================================================================

export async function fetchTruckInspectionConfig(): Promise<TruckInspectionConfig> {
  const response = await apiClient.get<TruckInspectionConfig>('/inspection/truck/');
  return response.data;
}

export function useTruckInspectionConfig() {
  return useQuery({
    queryKey: ['inspection', 'truck', 'config'],
    queryFn: fetchTruckInspectionConfig,
    staleTime: 10 * 60 * 1000,
  });
}

export async function submitTruckInspection(payload: TruckInspectionCreatePayload) {
  const response = await apiClient.post('/inspection/truck/', payload);
  return response.data;
}

export function useSubmitTruckInspection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitTruckInspection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspection', 'truck'] });
      queryClient.invalidateQueries({ queryKey: ['inspection', 'reports'] });
      queryClient.invalidateQueries({ queryKey: ['fleetio', 'submitted-forms'] });
    },
  });
}

export async function fetchTruckInspectionHistory(page = 1): Promise<FleetioPaginatedResponse<TruckInspectionHistoryItem>> {
  const response = await apiClient.get<FleetioPaginatedResponse<TruckInspectionHistoryItem>>(
    '/inspection/truck/history/',
    { params: { page } }
  );
  return response.data;
}

export function useTruckInspectionHistory(page = 1) {
  return useQuery({
    queryKey: ['inspection', 'truck', 'history', page],
    queryFn: () => fetchTruckInspectionHistory(page),
  });
}

// ============================================================================
// API FETCH FUNCTIONS & HOOKS: TRAILER INSPECTION
// ============================================================================

export async function fetchTrailerInspectionConfig(): Promise<TrailerInspectionConfig> {
  const response = await apiClient.get<TrailerInspectionConfig>('/inspection/trailer/');
  return response.data;
}

export function useTrailerInspectionConfig() {
  return useQuery({
    queryKey: ['inspection', 'trailer', 'config'],
    queryFn: fetchTrailerInspectionConfig,
    staleTime: 10 * 60 * 1000,
  });
}

export async function submitTrailerInspection(payload: TrailerInspectionCreatePayload) {
  const response = await apiClient.post('/inspection/trailer/', payload);
  return response.data;
}

export function useSubmitTrailerInspection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitTrailerInspection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspection', 'trailer'] });
      queryClient.invalidateQueries({ queryKey: ['inspection', 'reports'] });
      queryClient.invalidateQueries({ queryKey: ['fleetio', 'submitted-forms'] });
    },
  });
}

export async function fetchTrailerInspectionHistory(page = 1): Promise<FleetioPaginatedResponse<TrailerInspectionHistoryItem>> {
  const response = await apiClient.get<FleetioPaginatedResponse<TrailerInspectionHistoryItem>>(
    '/inspection/trailer/history/',
    { params: { page } }
  );
  return response.data;
}

export function useTrailerInspectionHistory(page = 1) {
  return useQuery({
    queryKey: ['inspection', 'trailer', 'history', page],
    queryFn: () => fetchTrailerInspectionHistory(page),
  });
}

// ============================================================================
// API FETCH FUNCTIONS & HOOKS: FLEETIO INTEGRATION SUITE
// ============================================================================

function extractFleetioResults<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  if (Array.isArray(data.records)) return data.records;
  return [];
}

// 1. Vehicles
export async function fetchFleetioVehicles(params?: { q?: string; page?: number; per_page?: number }): Promise<FleetioVehicleItem[]> {
  const response = await apiClient.get('/fleetio/vehicles/', { params });
  return extractFleetioResults<FleetioVehicleItem>(response.data);
}
export function useFleetioVehiclesQuery(params?: { q?: string; page?: number; per_page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'vehicles', params],
    queryFn: () => fetchFleetioVehicles(params),
    staleTime: 60 * 1000,
  });
}

// 2. Vehicle Assignments
export async function fetchFleetioAssignments(params?: { q?: string; page?: number }): Promise<FleetioAssignmentItem[]> {
  const response = await apiClient.get('/fleetio/vehicle-assignments/', { params });
  return extractFleetioResults<FleetioAssignmentItem>(response.data);
}
export function useFleetioAssignmentsQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'assignments', params],
    queryFn: () => fetchFleetioAssignments(params),
    staleTime: 60 * 1000,
  });
}

// 3. Service Entries
export async function fetchFleetioServiceEntries(params?: { q?: string; page?: number }): Promise<FleetioServiceEntryItem[]> {
  const response = await apiClient.get('/fleetio/service-entries/', { params });
  return extractFleetioResults<FleetioServiceEntryItem>(response.data);
}
export function useFleetioServiceEntriesQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'service-entries', params],
    queryFn: () => fetchFleetioServiceEntries(params),
    staleTime: 60 * 1000,
  });
}

// 4. Work Orders
export async function fetchFleetioWorkOrders(params?: { q?: string; page?: number }): Promise<FleetioWorkOrderItem[]> {
  const response = await apiClient.get('/fleetio/work-orders/', { params });
  return extractFleetioResults<FleetioWorkOrderItem>(response.data);
}
export function useFleetioWorkOrdersQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'work-orders', params],
    queryFn: () => fetchFleetioWorkOrders(params),
    staleTime: 60 * 1000,
  });
}

// 5. Service Reminders
export async function fetchFleetioServiceReminders(params?: { q?: string; page?: number }): Promise<FleetioServiceReminderItem[]> {
  const response = await apiClient.get('/fleetio/service-reminders/', { params });
  return extractFleetioResults<FleetioServiceReminderItem>(response.data);
}
export function useFleetioServiceRemindersQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'service-reminders', params],
    queryFn: () => fetchFleetioServiceReminders(params),
    staleTime: 60 * 1000,
  });
}

// 6. Service Tasks
export async function fetchFleetioServiceTasks(params?: { q?: string; page?: number }): Promise<FleetioServiceTaskItem[]> {
  const response = await apiClient.get('/fleetio/service-tasks/', { params });
  return extractFleetioResults<FleetioServiceTaskItem>(response.data);
}
export function useFleetioServiceTasksQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'service-tasks', params],
    queryFn: () => fetchFleetioServiceTasks(params),
    staleTime: 5 * 60 * 1000,
  });
}

// 7. Fuel Entries
export async function fetchFleetioFuelEntries(params?: { q?: string; page?: number }): Promise<FleetioFuelEntryItem[]> {
  const response = await apiClient.get('/fleetio/fuel-entries/', { params });
  return extractFleetioResults<FleetioFuelEntryItem>(response.data);
}
export function useFleetioFuelEntriesQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'fuel-entries', params],
    queryFn: () => fetchFleetioFuelEntries(params),
    staleTime: 60 * 1000,
  });
}

// 8. Meter Entries
export async function fetchFleetioMeterEntries(params?: { q?: string; page?: number }): Promise<FleetioMeterEntryItem[]> {
  const response = await apiClient.get('/fleetio/meter-entries/', { params });
  return extractFleetioResults<FleetioMeterEntryItem>(response.data);
}
export function useFleetioMeterEntriesQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'meter-entries', params],
    queryFn: () => fetchFleetioMeterEntries(params),
    staleTime: 60 * 1000,
  });
}

// 9. Expense Entries
export async function fetchFleetioExpenseEntries(params?: { q?: string; page?: number }): Promise<FleetioExpenseEntryItem[]> {
  const response = await apiClient.get('/fleetio/expense-entries/', { params });
  return extractFleetioResults<FleetioExpenseEntryItem>(response.data);
}
export function useFleetioExpenseEntriesQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'expense-entries', params],
    queryFn: () => fetchFleetioExpenseEntries(params),
    staleTime: 60 * 1000,
  });
}

// 10. Issues
export async function fetchFleetioIssues(params?: { q?: string; page?: number }): Promise<FleetioIssueItem[]> {
  const response = await apiClient.get('/fleetio/issues/', { params });
  return extractFleetioResults<FleetioIssueItem>(response.data);
}
export function useFleetioIssuesQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'issues', params],
    queryFn: () => fetchFleetioIssues(params),
    staleTime: 60 * 1000,
  });
}

// 11. Priorities
export async function fetchFleetioPriorities(params?: { q?: string; page?: number }): Promise<FleetioPriorityItem[]> {
  const response = await apiClient.get('/fleetio/issue-priorities/', { params });
  return extractFleetioResults<FleetioPriorityItem>(response.data);
}
export function useFleetioPrioritiesQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'priorities', params],
    queryFn: () => fetchFleetioPriorities(params),
    staleTime: 5 * 60 * 1000,
  });
}

// 12. Parts
export async function fetchFleetioParts(params?: { q?: string; page?: number }): Promise<FleetioPartItem[]> {
  const response = await apiClient.get('/fleetio/parts/', { params });
  return extractFleetioResults<FleetioPartItem>(response.data);
}
export function useFleetioPartsQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'parts', params],
    queryFn: () => fetchFleetioParts(params),
    staleTime: 60 * 1000,
  });
}

// 13. Purchase Orders
export async function fetchFleetioPurchaseOrders(params?: { q?: string; page?: number }): Promise<FleetioPurchaseOrderItem[]> {
  const response = await apiClient.get('/fleetio/purchase-orders/', { params });
  return extractFleetioResults<FleetioPurchaseOrderItem>(response.data);
}
export function useFleetioPurchaseOrdersQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'purchase-orders', params],
    queryFn: () => fetchFleetioPurchaseOrders(params),
    staleTime: 60 * 1000,
  });
}

// 14. Inspection Schedules
export async function fetchFleetioSchedules(params?: { q?: string; page?: number }): Promise<FleetioInspectionScheduleItem[]> {
  const response = await apiClient.get('/fleetio/inspection-schedules/', { params });
  return extractFleetioResults<FleetioInspectionScheduleItem>(response.data);
}
export function useFleetioSchedulesQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'schedules', params],
    queryFn: () => fetchFleetioSchedules(params),
    staleTime: 60 * 1000,
  });
}

// 15. Submitted Forms
export async function fetchFleetioSubmittedForms(params?: { q?: string; page?: number }): Promise<FleetioSubmittedFormItem[]> {
  const response = await apiClient.get('/fleetio/submitted-inspection-forms/', { params });
  return extractFleetioResults<FleetioSubmittedFormItem>(response.data);
}
export function useFleetioSubmittedFormsQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'submitted-forms', params],
    queryFn: () => fetchFleetioSubmittedForms(params),
    staleTime: 60 * 1000,
  });
}

// 16. Vendors
export async function fetchFleetioVendors(params?: { q?: string; page?: number }): Promise<FleetioVendorItem[]> {
  const response = await apiClient.get('/fleetio/vendors/', { params });
  return extractFleetioResults<FleetioVendorItem>(response.data);
}
export function useFleetioVendorsQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'vendors', params],
    queryFn: () => fetchFleetioVendors(params),
    staleTime: 60 * 1000,
  });
}

// 17. Contacts
export async function fetchFleetioContacts(params?: { q?: string; page?: number }): Promise<FleetioContactItem[]> {
  const response = await apiClient.get('/fleetio/contacts/', { params });
  return extractFleetioResults<FleetioContactItem>(response.data);
}
export function useFleetioContactsQuery(params?: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['fleetio', 'contacts', params],
    queryFn: () => fetchFleetioContacts(params),
    staleTime: 60 * 1000,
  });
}
