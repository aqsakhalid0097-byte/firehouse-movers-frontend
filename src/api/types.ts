/**
 * API Data Transfer Objects and Data Models for Firehouse Movers
 */

export interface UserRole {
  is_admin?: boolean;
  is_manager?: boolean;
  is_senior_management?: boolean;
  is_employee?: boolean;
  is_mover?: boolean;
  is_driver?: boolean;
  is_customer?: boolean;
  name?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  profile_picture?: string | null;
  role?: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  redirect_to?: string;
}

export interface SignupPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirm: string;
  is_customer: boolean;
  profile_picture?: File | null;
}

export interface SignupResponse {
  user: AuthUser;
  redirect_to?: string;
}

export interface LogoutResponse {
  detail: string;
}

export interface MeResponse {
  user: AuthUser;
}

export interface CsrfResponse {
  csrfToken: string;
}

export interface LandingService {
  id: number;
  name: string;
  description: string;
  icon: string;
  display_order: number;
  requires_quote: boolean;
  base_price: number | null;
}

export interface LandingContact {
  company: string;
  address_lines: string[];
  phone: string;
  email: string;
}

export interface LandingCTA {
  login_path: string;
  signup_path: string;
  quote_path: string;
}

export interface LandingData {
  hero: {
    title: string;
    tagline: string;
  };
  services: LandingService[];
  contact: LandingContact;
  cta: LandingCTA;
  authenticated: boolean;
}

/* =========================================================================
 * 1 & 2. Profile API Models (/api/v1/profile/ & /api/v1/profile/<user_id>/)
 * ========================================================================= */

export interface ProfileUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface ProfileDetails {
  id: number;
  phone_number: string;
  job_title: string;
  role: string;
  role_display: string;
  location: string;
  start_date: string;
  tenure: string;
  hobbies: string;
  favourite_quote: string;
  profile_picture: string | null;
  department_id: number | null;
  department_title: string | null;
}

export interface ProfileTeammate {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  job_title: string;
  role: string;
  role_display: string;
  profile_picture: string | null;
  department_id: number | null;
  department_title: string | null;
}

export interface ProfileResponse {
  is_own_profile: boolean;
  user: ProfileUser;
  profile: ProfileDetails;
  manager: ProfileTeammate | null;
  teammates: ProfileTeammate[];
  team_members: ProfileTeammate[];
}

export interface ProfileUpdatePayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  job_title?: string;
  location?: string;
  hobbies?: string;
  favourite_quote?: string;
  profile_picture?: File | null;
}

/* =========================================================================
 * 3. People Directory API Models (/api/v1/people/)
 * ========================================================================= */

export interface PeopleDirectoryMember {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  job_title: string;
  role: string;
  role_display: string;
  profile_picture: string | null;
  department_id: number | null;
  department_title: string | null;
  email?: string | null;
  username?: string | null;
}

export interface PeopleDirectoryResponse {
  count: number;
  page: number;
  num_pages: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
  can_manage_employees: boolean;
  results: PeopleDirectoryMember[];
}

/* =========================================================================
 * 4. Current Awards & Hall of Fame API Models (/api/v1/awards/me/)
 * ========================================================================= */

export interface AwardItem {
  id: number;
  category: string;
  reason: string;
  amount: number;
  date_award: string;
  photo: string | null;
}

export interface HallOfFameItem {
  id: number;
  employee_name: string;
  description: string;
  photo: string | null;
  created_at: string;
}

export interface AwardsResponse {
  awards: AwardItem[];
  hall_of_fame: HallOfFameItem[];
}

/* =========================================================================
 * 5. Departments List API Models (/api/v1/departments/)
 * ========================================================================= */

export interface DepartmentMember {
  id: number;
  user_id: number;
  full_name: string;
  job_title: string;
}

export interface DepartmentManager {
  id: number;
  user_id: number;
  full_name: string;
  job_title: string;
}

export interface DepartmentItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  manager: DepartmentManager | null;
  employee_count: number;
  members: DepartmentMember[];
  is_manager: boolean;
  is_member: boolean;
}

export interface DepartmentsResponse {
  can_manage: boolean;
  departments: DepartmentItem[];
}

/* =========================================================================
 * 6 & 7. Goals Management API Models (/api/v1/goals/ & /api/v1/goals/me/)
 * ========================================================================= */

export interface GoalEmployeeSummary {
  id: number;
  user_id: number;
  display_name: string;
  role: string;
  role_display: string;
  goal_count: number;
  goal_count_summary: string;
  has_goals: boolean;
  can_add_more_goals: boolean;
  department_title: string;
}

export interface GoalUserRef {
  id: number;
  full_name: string;
}

export interface GoalItem {
  id: number;
  title: string;
  description: string;
  goal_type: 'short_term' | 'long_term' | string;
  goal_type_display: string;
  is_completed: boolean;
  due_date: string;
  completed_at: string | null;
  notes: string;
  created_at: string;
  assigned_to: GoalUserRef;
  created_by: GoalUserRef;
}

export interface GoalsManagementResponse {
  employees: GoalEmployeeSummary[];
  goals: GoalItem[];
  can_add_goals: boolean;
  has_team_members: boolean;
  filter_type: string;
  goal_type_filter: string;
  role_filter: string;
  is_manager: boolean;
  is_senior_manager: boolean;
  is_admin: boolean;
  is_management: boolean;
  current_user_display_name: string;
  empty_state_message: string;
}

export interface GoalsQueryParams {
  filter?: 'all' | 'completed' | 'incomplete' | string;
  goal_type?: 'all' | 'short_term' | 'long_term' | string;
  role?: string;
  scope?: 'all' | 'team' | string;
}

export interface MyGoalsStats {
  total_goals: number;
  completed_goals: number;
  pending_goals: number;
  goal_completion_percentage: number;
}

export interface MyGoalsResponse {
  employee?: GoalEmployeeSummary;
  goals: GoalItem[];
  stats?: MyGoalsStats;
  chart_breakdown?: unknown;
}

export interface MyGoalsQueryParams {
  goal_type?: 'all' | 'short_term' | 'long_term' | string;
  completion_status?: 'all' | 'completed' | 'pending' | string;
}

/* =========================================================================
 * 8. Communication Log Dashboard API Models (/api/v1/communication/dashboard/)
 * ========================================================================= */

export interface LogType {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface CommunicationLogItem {
  id: number;
  subject: string;
  created_at: string;
  event_date: string;
  is_acknowledged: boolean;
  requires_acknowledgment: boolean;
  acknowledgment_deadline: string | null;
  deadline_overdue: boolean;
  response_count: number;
  has_unviewed_response: boolean;
  log_type: LogType;
  employee: { id: number; full_name: string };
  created_by: { id: number; full_name: string };
}

export interface CommunicationStats {
  total: number;
  unacknowledged: number;
  acknowledged: number;
}

export interface LogTypeStat {
  id: number;
  name: string;
  count: number;
  color?: string;
  icon?: string;
}

export interface CommunicationDashboardResponse {
  is_manager: boolean;
  view_type: string | null;
  can_create_log: boolean;
  can_manage_log_types: boolean;
  today: string;
  stats: CommunicationStats;
  log_type_stats: LogTypeStat[];
  count: number;
  page: number;
  num_pages: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
  results: CommunicationLogItem[];
}

export interface CommunicationDashboardQueryParams {
  page?: number;
  view?: 'my_logs' | 'employee_logs' | string;
}

/* =========================================================================
 * 9. Communication Log Detail API Models (/api/v1/communication/logs/<id>/)
 * ========================================================================= */

export interface LogParticipant {
  id: number;
  user_id?: number;
  first_name?: string;
  last_name?: string;
  full_name: string;
  job_title?: string;
  role?: string;
  role_display?: string;
  profile_picture?: string | null;
  department_id?: number;
  department_title?: string;
}

export interface LogResponseItem {
  id: number;
  responder: {
    id: number;
    user_id?: number;
    first_name?: string;
    last_name?: string;
    full_name: string;
    job_title?: string;
    role?: string;
    role_display?: string;
    profile_picture?: string | null;
    department_id?: number;
    department_title?: string;
  };
  response_text: string;
  created_at: string;
  updated_at?: string;
  responder_signature: string | null;
  responder_signature_timestamp: string | null;
  is_simple_acknowledgment?: boolean;
  can_edit: boolean;
}

export interface CommunicationLogDetail {
  id: number;
  subject: string;
  content: string;
  visibility: 'private' | 'shared' | string;
  visibility_display?: string;
  created_at: string;
  updated_at?: string;
  event_date: string;
  is_acknowledged: boolean;
  acknowledged_at: string | null;
  requires_acknowledgment: boolean;
  acknowledgment_deadline: string | null;
  deadline_overdue: boolean;
  creator_signature: string | null;
  creator_signature_timestamp: string | null;
  log_type: (LogType & { description?: string }) | null;
  employee: LogParticipant;
  created_by: LogParticipant;
  responses: LogResponseItem[];
  can_respond: boolean;
  can_acknowledge: boolean;
  is_creator: boolean;
  can_download: boolean;
  today?: string;
}

export interface AcknowledgeLogPayload {
  note?: string;
  responder_signature?: string;
}

/* =========================================================================
 * 10. Team Management API Models (/api/v1/team/)
 * ========================================================================= */

export interface TeamMember {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_number: string;
  job_title: string;
  role: string;
  role_display: string;
  start_date: string | null;
  joined_formatted: string | null;
  profile_picture: string | null;
  department_id: number | null;
  department_title: string | null;
}

export interface RoleChoice {
  value: string;
  label: string;
}

export interface TeamResponse {
  team_members: TeamMember[];
  roles: RoleChoice[];
  selected_role: string | null;
  can_add_member: boolean;
  is_senior_management: boolean;
}

export interface TeamAddMemberPayload {
  user_id: number;
  role: string;
  job_title?: string;
  start_date?: string | null;
}

export interface TeamEditMemberPayload {
  role?: string;
  job_title?: string;
  start_date?: string | null;
}

/* =========================================================================
 * 11. Awards & Recognition API Models (/api/v1/awards/...)
 * ========================================================================= */

export interface AwardCategoryDetail {
  id: number;
  name: string;
  description: string;
  criteria: string;
}

export interface AwardCategoryWriteRequest {
  name: string;
  description?: string;
  criteria?: string;
}

export interface AwardCreateRequest {
  employee: number;
  category?: number | null;
  card?: number | null;
  amount?: number | null;
  reason?: string;
  employee_photo?: File | null;
}

export interface AwardDetailResponse {
  detail?: string;
  award?: GiftAward;
  awards?: GiftAward[];
  gift_card?: GiftCard;
  company?: GiftCompany;
  category?: AwardCategoryDetail;
  entry?: Record<string, unknown>;
  email_sent?: boolean;
  can_manage?: boolean;
  options?: Record<string, unknown>;
}

export interface AwardsDashboardResponse {
  can_manage: boolean;
  awards: GiftAward[];
  categories: AwardCategoryDetail[];
  months: RoleChoice[];
  years: number[];
  selected_category: string;
  selected_month: string;
  selected_year: string;
  employees?: PeopleDirectoryMember[];
  gift_cards?: GiftCard[];
}

export interface HallOfFameUser {
  id: number;
  full_name: string;
  email: string;
}

export interface HallOfFameEntry {
  id: number;
  employee_id?: number;
  employee_name: string;
  description: string;
  photo: string | null;
  created_at: string;
}

export interface HallOfFameListResponse {
  can_manage: boolean;
  entries: HallOfFameEntry[];
  years: number[];
  selected_year: string;
  employees: HallOfFameUser[];
}

export interface HallOfFameWriteRequest {
  employee: number;
  description: string;
  photo?: File | null;
}

export interface PrizesResponse {
  categories: AwardCategoryDetail[];
}

/* =========================================================================
 * 12. Gift Cards API Models (/api/v1/gifts/...)
 * ========================================================================= */

export interface GiftCompany {
  id: number;
  name: string;
}

export interface GiftCompanyWriteRequest {
  name: string;
}

export interface GiftCard {
  id: number;
  amount: number;
  date_of_purchase: string | null;
  company: GiftCompany | null;
  added_by: PeopleDirectoryMember | null;
  label?: string;
  has_awards?: boolean;
  companies?: GiftCompany[];
}

export interface GiftAward {
  id: number;
  category: AwardCategoryDetail | null;
  date_award: string;
  employee: PeopleDirectoryMember | null;
  card: GiftCard | null;
  amount: number;
  photo: string | null;
  reason: string;
  awarded_by: PeopleDirectoryMember | null;
  date_saved?: string | null;
}

export interface GiftsDashboardResponse {
  can_manage: boolean;
  active_tab: string;
  issued: {
    count?: number;
    page?: number;
    num_pages?: number;
    results?: GiftAward[];
    [key: string]: unknown;
  };
  added: {
    count?: number;
    page?: number;
    num_pages?: number;
    results?: GiftCard[];
    [key: string]: unknown;
  };
}

export interface GiftCardWriteRequest {
  company: number;
  amount: number;
}

export interface PatchedGiftCardWriteRequest {
  company?: number;
  amount?: number;
}

export interface GiftIssueFormResponse {
  employees?: PeopleDirectoryMember[];
  gift_cards?: GiftCard[];
  companies?: GiftCompany[];
}

export interface GiftAwardCardRequest {
  employees: number[];
  card: number;
  reason: string;
  emails?: string[];
}

export interface GiftEmailItem {
  name: string;
  email: string;
}

export interface GiftEmailsResponse {
  emails: GiftEmailItem[];
}

export interface GiftReportsResponse {
  start_date: string;
  end_date: string;
  report_type: string;
  spending: Record<string, unknown>;
  issuing: Record<string, unknown>;
  net_spending: number;
}

/* =========================================================================
 * 13. Logistics & Dispatch API Models (/api/v1/logistics/...)
 * ========================================================================= */

export interface LogisticsPendingOrder {
  id?: number;
  date?: string;
  job_no?: string;
  last_name_customer?: string;
  phone_number?: string;
  type_of_move?: string;
  moved_before?: boolean;
  crew_name?: number | string;
  referral_source?: string;
  crew_available?: boolean;
  number_of_trucks?: number;
  number_of_trailers?: number;
  notes_order_detail?: string;
  status?: string;
  [key: string]: unknown;
}

export interface LogisticsCompletedDispatch {
  id?: number;
  order_id?: number;
  ipad?: string;
  crew_leads?: number;
  drivers?: number[];
  crew_members?: number[];
  trucks?: number[];
  trailers?: number[];
  material?: string;
  special_equipment_needed?: string;
  special_equipment_status?: string | null;
  notes_dispatcher?: string;
  [key: string]: unknown;
}

export interface LogisticsDashboardResponse {
  pending_orders: LogisticsPendingOrder[];
  completed_dispatches: LogisticsCompletedDispatch[];
  order_form: Record<string, unknown>;
  dispatch_form: Record<string, unknown>;
}

export interface LogisticsOrderWriteRequest {
  date: string;
  job_no: string;
  last_name_customer: string;
  phone_number: string;
  type_of_move: string;
  moved_before: boolean;
  crew_name: number;
  referral_source: string;
  crew_available: boolean;
  number_of_trucks: number;
  number_of_trailers: number;
  notes_order_detail?: string;
}

export interface LogisticsDispatchWriteRequest {
  order_id: number;
  ipad: string;
  crew_leads: number;
  drivers?: number[];
  crew_members?: number[];
  trucks?: number[];
  trailers?: number[];
  material?: string;
  special_equipment_needed?: string;
  special_equipment_status?: string | null;
  speedy_inventory_account?: string;
  speedy_inventory?: string | null;
  labels_for_speedy_inventory?: string | null;
  notes_dispatcher?: string;
}

export interface LogisticsCrewMember {
  id: number;
  user?: PeopleDirectoryMember;
  role: 'leader' | 'member';
  [key: string]: unknown;
}

export interface LogisticsCrewsResponse {
  role_filter: string;
  role_choices: RoleChoice[];
  available_employees: PeopleDirectoryMember[];
  count: number;
  page: number;
  num_pages: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
  results: LogisticsCrewMember[];
}

export interface LogisticsCrewWriteRequest {
  user: number;
  role: 'leader' | 'member';
}

export interface LogisticsVehicle {
  id: number;
  name?: string;
  vehicle_type: 'truck' | 'trailer';
  number: string;
  last_inspection_date?: string | null;
  station?: number | null;
  [key: string]: unknown;
}

export interface LogisticsVehiclesResponse {
  type_filter: string;
  type_choices: RoleChoice[];
  stations: Record<string, unknown>[];
  count: number;
  page: number;
  num_pages: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
  results: LogisticsVehicle[];
}

export interface LogisticsVehicleWriteRequest {
  name?: string;
  vehicle_type: 'truck' | 'trailer';
  number: string;
  last_inspection_date?: string | null;
  station?: number | null;
}

export interface LogisticsReportResponse {
  start_date: string;
  end_date: string;
  total_days: number;
  report_type: string;
  job_summary: Record<string, unknown>[];
  crew_performance: Record<string, unknown>[];
  vehicle_utilization: Record<string, unknown>[];
  referral_effectiveness: Record<string, unknown>[];
}

export interface LogisticsMutationResponse {
  detail?: string;
  order?: Record<string, unknown>;
  dispatch?: Record<string, unknown>;
  vehicle?: Record<string, unknown>;
  crew?: Record<string, unknown>;
}

export interface VehicleAvailabilityItem {
  id: number;
  name: string;
  number: string;
  vehicle_type: 'truck' | 'trailer';
  last_inspection_date: string | null;
  station_id: number | null;
  station_name: string | null;
  availability: {
    id: number;
    status: string;
    estimated_back_in_service_date: string | null;
    back_in_service_date: string | null;
    start_date: string | null;
    date_saved: string | null;
  } | null;
}

export interface AvailabilityResponse {
  selected_date: string;
  trucks: VehicleAvailabilityItem[];
  trailers: VehicleAvailabilityItem[];
  stations: Record<string, unknown>[];
  status_choices: RoleChoice[];
  updated?: number;
}

export interface AvailabilityUpdateItem {
  vehicle_id: number;
  status?: string;
  estimated_back_in_service_date?: string | null;
}

export interface AvailabilityWriteRequest {
  date?: string;
  updates: AvailabilityUpdateItem[];
}

export interface AvailabilityReportVehicle {
  id: number;
  name: string;
  number: string;
  in_service_days: number;
  out_of_service_days: number;
}

export interface AvailabilityReportResponse {
  start_date: string;
  end_date: string;
  trucks: AvailabilityReportVehicle[];
  trailers: AvailabilityReportVehicle[];
}

/* =========================================================================
 * 14. Uniform & Inventory API Models (/api/v1/inventory/...)
 * ========================================================================= */

export interface InventoryAssignmentItem {
  id: number;
  uniform_id: number | null;
  uniform_name: string;
  category: string;
  quantity: number;
  condition: string;
  date_assigned: string | null;
  status: string;
}

export interface InventoryEmployeeAssignment {
  employee: PeopleDirectoryMember | null;
  items: InventoryAssignmentItem[];
  total_quantity: number;
  active_quantity: number;
}

export interface InventoryStockItem {
  id: number;
  uniform_id: number | null;
  uniform_name: string;
  category: string;
  gender: string;
  new_stock: number;
  used_stock: number;
  in_use: number;
  total_stock: number;
  minimum_stock_level: number | null;
  is_low_stock: boolean;
  disposed: number;
  return_to_supplier: number;
  total_bought: number;
}

export interface InventoryStats {
  total_employees_with_inventory: number;
  total_items_assigned: number;
  total_new_stock: number;
  total_used_stock: number;
  total_in_use: number;
}

export interface InventoryDashboardResponse {
  can_manage: boolean;
  assignments: InventoryEmployeeAssignment[];
  inventory: InventoryStockItem[];
  stats: InventoryStats;
}

export interface InventoryUniform {
  id: number;
  name: string;
  category: string;
  gender: string;
  minimum_stock_level: number | null;
}

export interface InventoryUniformsResponse {
  uniforms: InventoryUniform[];
  gender_choices: RoleChoice[];
}

export interface InventoryUniformCreateRequest {
  name: string;
  category: string;
  gender: 'Male' | 'Female' | 'Unisex';
  minimum_stock_level: number;
}

export interface InventoryEmployeeUniform {
  id: number;
  assignment_id: number;
  name: string;
  condition: string;
  quantity: number;
  date_assigned: string | null;
}

export interface InventoryEmployeeUniformsResponse {
  uniforms: InventoryEmployeeUniform[];
}

export interface IssueUniformFormResponse {
  employees: PeopleDirectoryMember[];
  uniforms: InventoryUniform[];
  condition_choices: RoleChoice[];
}

export interface InventoryIssueRequest {
  employee: number;
  uniform: number;
  quantity: number;
  condition: 'New' | 'Used';
  email?: string;
}

export interface ReturnUniformFormResponse {
  employees: PeopleDirectoryMember[];
}

export interface InventoryReturnRequest {
  employee: number;
  uniform: number;
  email?: string;
}

export interface StockFormResponse {
  uniforms: InventoryUniform[];
  condition_choices: RoleChoice[];
}

export interface InventoryStockRequest {
  uniform: number;
  quantity: number;
  condition: 'New' | 'Used';
  notes?: string;
}

export interface StockRemoveFormResponse {
  uniforms: InventoryUniform[];
  condition_choices: RoleChoice[];
  transaction_type_choices: RoleChoice[];
}

export interface InventoryStockRemoveRequest {
  uniform: number;
  quantity: number;
  condition: 'New' | 'Used';
  transaction_type: 'Return to Supplier' | 'Dispose';
  notes?: string;
}

export interface InventoryLowStockResponse {
  results: InventoryStockItem[];
}

export interface InventoryEmployeeReportUniform {
  name: string;
  quantity: number;
}

export interface InventoryEmployeeReport {
  employee: PeopleDirectoryMember | null;
  uniforms: InventoryEmployeeReportUniform[];
}

export interface InventoryReportsResponse {
  report_type: string | null;
  report_types: RoleChoice[];
  inventory_records: InventoryStockItem[];
  employee_records: InventoryEmployeeReport[];
}

export interface InventoryMutationResponse {
  detail: string;
  uniform?: InventoryUniform;
  assignment?: InventoryAssignmentItem;
  inventory?: InventoryStockItem;
  email_sent?: boolean;
}

/* =========================================================================
 * 15. Packaging Supplies API Models (/api/v1/packaging/...)
 * ========================================================================= */

export interface PackagingDashboardResponse {
  can_order: boolean;
  is_senior: boolean;
  inventory: Record<string, number>;
  recent_transactions: Record<string, unknown>[];
  recent_receipts: Record<string, unknown>[];
  current_employee_id: number | null;
}

export interface PackagingMaterialFormResponse {
  trailers: Record<string, unknown>[];
  employees: PeopleDirectoryMember[];
  material_fields: RoleChoice[];
  job_ids?: Record<string, unknown>[];
  comparison?: Record<string, unknown>;
}

export interface PackagingMaterialWriteRequest {
  job_id: string;
  trailer_number: number | string;
  employee: number;
  employee_signature: string;
  quantities?: Record<string, number>;
  supplier_email?: string;
}

export interface PackagingReturnWriteRequest {
  job_id: string;
  trailer_number: number | string;
  employee: number;
  employee_signature: string;
  quantities?: Record<string, number>;
  supplier_email?: string;
}

export interface PackagingReceiptsResponse {
  receipts: Record<string, unknown>[];
}

export interface PackagingMutationResponseRequest {
  detail?: string;
  [key: string]: unknown;
}

export interface PackagingMutationResponse {
  detail: string;
  material?: Record<string, unknown>;
  order?: Record<string, unknown>;
  quote?: Record<string, unknown>;
  service?: Record<string, unknown>;
  services?: Record<string, unknown>[];
  email_sent?: boolean;
  created?: number;
  messages?: Record<string, unknown>[];
  new_message?: Record<string, unknown>;
  comparison?: Record<string, unknown>;
  order_id?: number;
}

export interface PackagingIncomingOrdersResponse {
  is_senior?: boolean;
  status_filter?: string;
  acknowledged_filter?: string;
  status_choices?: RoleChoice[];
  stats?: Record<string, unknown>;
  orders?: Record<string, unknown>[];
}

export interface PackagingQuotesResponse {
  status_filter?: string;
  stats?: Record<string, unknown>;
  quotes?: Record<string, unknown>[];
}

export interface PackagingScheduledMovesResponse {
  month: number;
  year: number;
  month_name: string;
  today: string;
  available_years: number[];
  months: RoleChoice[];
  moves: Record<string, unknown>[];
  calendar: Record<string, unknown>[];
}


