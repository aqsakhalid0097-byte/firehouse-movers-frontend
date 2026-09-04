import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './axios';
import type {
  // Awards
  AwardsDashboardResponse,
  AwardDetailResponse,
  AwardCreateRequest,
  AwardCategoryWriteRequest,
  HallOfFameListResponse,
  HallOfFameWriteRequest,
  PrizesResponse,
  // Gifts
  GiftsDashboardResponse,
  GiftIssueFormResponse,
  GiftCardWriteRequest,
  PatchedGiftCardWriteRequest,
  GiftCompanyWriteRequest,
  GiftAwardCardRequest,
  GiftEmailsResponse,
  GiftReportsResponse,
  // Logistics
  LogisticsDashboardResponse,
  LogisticsOrderWriteRequest,
  LogisticsDispatchWriteRequest,
  LogisticsCrewsResponse,
  LogisticsCrewWriteRequest,
  LogisticsVehiclesResponse,
  LogisticsVehicleWriteRequest,
  LogisticsReportResponse,
  LogisticsMutationResponse,
  // Availability
  AvailabilityResponse,
  AvailabilityWriteRequest,
  AvailabilityReportResponse,
  // Inventory
  InventoryDashboardResponse,
  InventoryUniformsResponse,
  InventoryUniformCreateRequest,
  InventoryEmployeeUniformsResponse,
  IssueUniformFormResponse,
  InventoryIssueRequest,
  ReturnUniformFormResponse,
  InventoryReturnRequest,
  StockFormResponse,
  InventoryStockRequest,
  StockRemoveFormResponse,
  InventoryStockRemoveRequest,
  InventoryLowStockResponse,
  InventoryReportsResponse,
  InventoryMutationResponse,
  // Packaging
  PackagingDashboardResponse,
  PackagingMaterialFormResponse,
  PackagingMaterialWriteRequest,
  PackagingReturnWriteRequest,
  PackagingReceiptsResponse,
  PackagingMutationResponseRequest,
  PackagingMutationResponse,
  PackagingIncomingOrdersResponse,
  PackagingQuotesResponse,
} from './types';

/* =========================================================================
 * 1. Awards & Recognition API
 * ========================================================================= */

export async function fetchAwardsDashboard(params?: {
  category?: number | string;
  month?: string;
  year?: number | string;
}): Promise<AwardsDashboardResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '' && v !== 'all')
  );
  const response = await apiClient.get<AwardsDashboardResponse>('/awards/', {
    params: cleanParams,
  });
  return response.data;
}

export function useAwardsDashboard(params?: {
  category?: number | string;
  month?: string;
  year?: number | string;
}) {
  return useQuery({
    queryKey: ['awards', 'dashboard', params],
    queryFn: () => fetchAwardsDashboard(params),
    staleTime: 1000 * 60 * 3,
  });
}

export async function createAward(payload: AwardCreateRequest): Promise<AwardDetailResponse> {
  if (payload.employee_photo instanceof File) {
    const formData = new FormData();
    formData.append('employee', String(payload.employee));
    if (payload.category !== undefined && payload.category !== null) {
      formData.append('category', String(payload.category));
    }
    if (payload.card !== undefined && payload.card !== null) {
      formData.append('card', String(payload.card));
    }
    if (payload.amount !== undefined && payload.amount !== null) {
      formData.append('amount', String(payload.amount));
    }
    if (payload.reason) {
      formData.append('reason', payload.reason);
    }
    formData.append('employee_photo', payload.employee_photo);

    const response = await apiClient.post<AwardDetailResponse>('/awards/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  const response = await apiClient.post<AwardDetailResponse>('/awards/', payload);
  return response.data;
}

export function useCreateAward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
    },
  });
}

export async function fetchAwardCategories(): Promise<PrizesResponse> {
  const response = await apiClient.get<PrizesResponse>('/awards/categories/');
  return response.data;
}

export function useAwardCategories() {
  return useQuery({
    queryKey: ['awards', 'categories'],
    queryFn: fetchAwardCategories,
    staleTime: 1000 * 60 * 5,
  });
}

export async function createAwardCategory(
  payload: AwardCategoryWriteRequest
): Promise<AwardDetailResponse> {
  const response = await apiClient.post<AwardDetailResponse>('/awards/categories/', payload);
  return response.data;
}

export function useCreateAwardCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAwardCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['awards', 'dashboard'] });
    },
  });
}

export async function fetchHallOfFame(params?: { year?: number | string }): Promise<HallOfFameListResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '' && v !== 'all')
  );
  const response = await apiClient.get<HallOfFameListResponse>('/awards/hall-of-fame/', {
    params: cleanParams,
  });
  return response.data;
}

export function useHallOfFame(params?: { year?: number | string }) {
  return useQuery({
    queryKey: ['awards', 'hall-of-fame', params],
    queryFn: () => fetchHallOfFame(params),
    staleTime: 1000 * 60 * 5,
  });
}

export async function createHallOfFame(payload: HallOfFameWriteRequest): Promise<AwardDetailResponse> {
  if (payload.photo instanceof File) {
    const formData = new FormData();
    formData.append('employee', String(payload.employee));
    formData.append('description', payload.description);
    formData.append('photo', payload.photo);

    const response = await apiClient.post<AwardDetailResponse>('/awards/hall-of-fame/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  const response = await apiClient.post<AwardDetailResponse>('/awards/hall-of-fame/', payload);
  return response.data;
}

export function useCreateHallOfFame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHallOfFame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards', 'hall-of-fame'] });
      queryClient.invalidateQueries({ queryKey: ['awards', 'me'] });
    },
  });
}

/* =========================================================================
 * 2. Gift Cards API
 * ========================================================================= */

export async function fetchGiftsDashboard(params?: {
  tab?: string;
  issued_page?: number;
  added_page?: number;
}): Promise<GiftsDashboardResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '')
  );
  const response = await apiClient.get<GiftsDashboardResponse>('/gifts/', {
    params: cleanParams,
  });
  return response.data;
}

export function useGiftsDashboard(params?: {
  tab?: string;
  issued_page?: number;
  added_page?: number;
}) {
  return useQuery({
    queryKey: ['gifts', 'dashboard', params],
    queryFn: () => fetchGiftsDashboard(params),
    staleTime: 1000 * 60 * 2,
  });
}

export async function fetchGiftCardFormOptions(): Promise<GiftIssueFormResponse> {
  const response = await apiClient.get<GiftIssueFormResponse>('/gifts/cards/');
  return response.data;
}

export function useGiftCardFormOptions() {
  return useQuery({
    queryKey: ['gifts', 'cards-form-options'],
    queryFn: fetchGiftCardFormOptions,
    staleTime: 1000 * 60 * 3,
  });
}

export async function createGiftCard(payload: GiftCardWriteRequest): Promise<AwardDetailResponse> {
  const response = await apiClient.post<AwardDetailResponse>('/gifts/cards/', payload);
  return response.data;
}

export function useCreateGiftCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGiftCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
    },
  });
}

export async function updateGiftCard(
  id: number | string,
  payload: PatchedGiftCardWriteRequest
): Promise<AwardDetailResponse> {
  const response = await apiClient.patch<AwardDetailResponse>(`/gifts/cards/${id}/`, payload);
  return response.data;
}

export function useUpdateGiftCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: PatchedGiftCardWriteRequest }) =>
      updateGiftCard(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
    },
  });
}

export async function deleteGiftCard(id: number | string): Promise<AwardDetailResponse> {
  const response = await apiClient.delete<AwardDetailResponse>(`/gifts/cards/${id}/`);
  return response.data;
}

export function useDeleteGiftCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deleteGiftCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
    },
  });
}

export async function fetchGiftCompanies(): Promise<GiftIssueFormResponse> {
  const response = await apiClient.get<GiftIssueFormResponse>('/gifts/companies/');
  return response.data;
}

export function useGiftCompanies() {
  return useQuery({
    queryKey: ['gifts', 'companies'],
    queryFn: fetchGiftCompanies,
    staleTime: 1000 * 60 * 5,
  });
}

export async function createGiftCompany(
  payload: GiftCompanyWriteRequest
): Promise<AwardDetailResponse> {
  const response = await apiClient.post<AwardDetailResponse>('/gifts/companies/', payload);
  return response.data;
}

export function useCreateGiftCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGiftCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts', 'companies'] });
      queryClient.invalidateQueries({ queryKey: ['gifts', 'cards-form-options'] });
      queryClient.invalidateQueries({ queryKey: ['gifts', 'issue-form-options'] });
    },
  });
}

export async function fetchGiftIssueFormOptions(): Promise<GiftIssueFormResponse> {
  const response = await apiClient.get<GiftIssueFormResponse>('/gifts/issue/');
  return response.data;
}

export function useGiftIssueFormOptions() {
  return useQuery({
    queryKey: ['gifts', 'issue-form-options'],
    queryFn: fetchGiftIssueFormOptions,
    staleTime: 1000 * 60 * 3,
  });
}

export async function awardGiftCard(payload: GiftAwardCardRequest): Promise<AwardDetailResponse> {
  const response = await apiClient.post<AwardDetailResponse>('/gifts/issue/', payload);
  return response.data;
}

export function useAwardGiftCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: awardGiftCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
      queryClient.invalidateQueries({ queryKey: ['awards'] });
    },
  });
}

export async function fetchGiftEmails(employeeIds: (number | string)[]): Promise<GiftEmailsResponse> {
  const response = await apiClient.get<GiftEmailsResponse>('/gifts/emails/', {
    params: { employee_ids: employeeIds.join(',') },
  });
  return response.data;
}

export function useGiftEmails(employeeIds: (number | string)[]) {
  return useQuery({
    queryKey: ['gifts', 'emails', employeeIds],
    queryFn: () => fetchGiftEmails(employeeIds),
    enabled: employeeIds.length > 0,
    staleTime: 1000 * 60 * 3,
  });
}

export async function fetchGiftReports(params?: {
  start_date?: string;
  end_date?: string;
  report_type?: string;
}): Promise<GiftReportsResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '')
  );
  const response = await apiClient.get<GiftReportsResponse>('/gifts/reports/', {
    params: cleanParams,
  });
  return response.data;
}

export function useGiftReports(params?: {
  start_date?: string;
  end_date?: string;
  report_type?: string;
}) {
  return useQuery({
    queryKey: ['gifts', 'reports', params],
    queryFn: () => fetchGiftReports(params),
    staleTime: 1000 * 60 * 2,
  });
}

/* =========================================================================
 * 3. Logistics & Dispatch API
 * ========================================================================= */

export async function fetchLogisticsDashboard(): Promise<LogisticsDashboardResponse> {
  const response = await apiClient.get<LogisticsDashboardResponse>('/logistics/');
  return response.data;
}

export function useLogisticsDashboard() {
  return useQuery({
    queryKey: ['logistics', 'dashboard'],
    queryFn: fetchLogisticsDashboard,
    staleTime: 1000 * 30, // 30 seconds for live dispatch
  });
}

export async function createLogisticsOrder(
  payload: LogisticsOrderWriteRequest
): Promise<LogisticsMutationResponse> {
  const response = await apiClient.post<LogisticsMutationResponse>('/logistics/orders/', payload);
  return response.data;
}

export function useCreateLogisticsOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLogisticsOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistics', 'dashboard'] });
    },
  });
}

export async function createLogisticsDispatch(
  payload: LogisticsDispatchWriteRequest
): Promise<LogisticsMutationResponse> {
  const response = await apiClient.post<LogisticsMutationResponse>('/logistics/dispatches/', payload);
  return response.data;
}

export function useCreateLogisticsDispatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLogisticsDispatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistics', 'dashboard'] });
    },
  });
}

export async function fetchLogisticsCrews(params?: {
  role?: string;
  page?: number;
}): Promise<LogisticsCrewsResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '' && v !== 'all')
  );
  const response = await apiClient.get<LogisticsCrewsResponse>('/logistics/crews/', {
    params: cleanParams,
  });
  return response.data;
}

export function useLogisticsCrews(params?: { role?: string; page?: number }) {
  return useQuery({
    queryKey: ['logistics', 'crews', params],
    queryFn: () => fetchLogisticsCrews(params),
    staleTime: 1000 * 60 * 2,
  });
}

export async function createLogisticsCrew(
  payload: LogisticsCrewWriteRequest
): Promise<LogisticsMutationResponse> {
  const response = await apiClient.post<LogisticsMutationResponse>('/logistics/crews/', payload);
  return response.data;
}

export function useCreateLogisticsCrew() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLogisticsCrew,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistics', 'crews'] });
      queryClient.invalidateQueries({ queryKey: ['logistics', 'dashboard'] });
    },
  });
}

export async function fetchLogisticsVehicles(params?: {
  type?: string;
  page?: number;
}): Promise<LogisticsVehiclesResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '' && v !== 'all')
  );
  const response = await apiClient.get<LogisticsVehiclesResponse>('/logistics/vehicles/', {
    params: cleanParams,
  });
  return response.data;
}

export function useLogisticsVehicles(params?: { type?: string; page?: number }) {
  return useQuery({
    queryKey: ['logistics', 'vehicles', params],
    queryFn: () => fetchLogisticsVehicles(params),
    staleTime: 1000 * 60 * 2,
  });
}

export async function createLogisticsVehicle(
  payload: LogisticsVehicleWriteRequest
): Promise<LogisticsMutationResponse> {
  const response = await apiClient.post<LogisticsMutationResponse>('/logistics/vehicles/', payload);
  return response.data;
}

export function useCreateLogisticsVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLogisticsVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistics', 'vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['logistics', 'dashboard'] });
    },
  });
}

export async function fetchLogisticsReport(params?: {
  start_date?: string;
  end_date?: string;
  report_type?: string;
}): Promise<LogisticsReportResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '')
  );
  const response = await apiClient.get<LogisticsReportResponse>('/logistics/report/', {
    params: cleanParams,
  });
  return response.data;
}

export function useLogisticsReport(params?: {
  start_date?: string;
  end_date?: string;
  report_type?: string;
}) {
  return useQuery({
    queryKey: ['logistics', 'report', params],
    queryFn: () => fetchLogisticsReport(params),
    staleTime: 1000 * 60 * 2,
  });
}

/* =========================================================================
 * 3b. Vehicle Availability API (/api/v1/availability/...)
 * ========================================================================= */

export async function fetchVehicleAvailability(date?: string): Promise<AvailabilityResponse> {
  const response = await apiClient.get<AvailabilityResponse>('/availability/', {
    params: date ? { date } : undefined,
  });
  return response.data;
}

export function useVehicleAvailability(date?: string) {
  return useQuery({
    queryKey: ['availability', 'daily', date],
    queryFn: () => fetchVehicleAvailability(date),
    staleTime: 1000 * 30,
  });
}

export async function updateVehicleAvailability(
  payload: AvailabilityWriteRequest
): Promise<AvailabilityResponse> {
  const response = await apiClient.post<AvailabilityResponse>('/availability/', payload);
  return response.data;
}

export function useUpdateVehicleAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVehicleAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      queryClient.invalidateQueries({ queryKey: ['logistics'] });
    },
  });
}

export async function fetchAvailabilityReport(params?: {
  start_date?: string;
  end_date?: string;
}): Promise<AvailabilityReportResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '')
  );
  const response = await apiClient.get<AvailabilityReportResponse>('/availability/report/', {
    params: cleanParams,
  });
  return response.data;
}

export function useAvailabilityReport(params?: { start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: ['availability', 'report', params],
    queryFn: () => fetchAvailabilityReport(params),
    staleTime: 1000 * 60 * 2,
  });
}

/* =========================================================================
 * 4. Uniform & Inventory API
 * ========================================================================= */

export async function fetchInventoryDashboard(): Promise<InventoryDashboardResponse> {
  const response = await apiClient.get<InventoryDashboardResponse>('/inventory/');
  return response.data;
}

export function useInventoryDashboard() {
  return useQuery({
    queryKey: ['inventory', 'dashboard'],
    queryFn: fetchInventoryDashboard,
    staleTime: 1000 * 60 * 2,
  });
}

export async function fetchIssueUniformFormOptions(): Promise<IssueUniformFormResponse> {
  const response = await apiClient.get<IssueUniformFormResponse>('/inventory/issue/');
  return response.data;
}

export function useIssueUniformFormOptions() {
  return useQuery({
    queryKey: ['inventory', 'issue-form'],
    queryFn: fetchIssueUniformFormOptions,
    staleTime: 1000 * 60 * 3,
  });
}

export async function issueUniform(
  payload: InventoryIssueRequest
): Promise<InventoryMutationResponse> {
  const response = await apiClient.post<InventoryMutationResponse>('/inventory/issue/', payload);
  return response.data;
}

export function useIssueUniform() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: issueUniform,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export async function fetchReturnUniformFormOptions(): Promise<ReturnUniformFormResponse> {
  const response = await apiClient.get<ReturnUniformFormResponse>('/inventory/return/');
  return response.data;
}

export function useReturnUniformFormOptions() {
  return useQuery({
    queryKey: ['inventory', 'return-form'],
    queryFn: fetchReturnUniformFormOptions,
    staleTime: 1000 * 60 * 3,
  });
}

export async function fetchEmployeeUniforms(
  employeeId: number | string
): Promise<InventoryEmployeeUniformsResponse> {
  const response = await apiClient.get<InventoryEmployeeUniformsResponse>(
    `/inventory/employees/${employeeId}/uniforms/`
  );
  return response.data;
}

export function useEmployeeUniforms(employeeId: number | string | undefined) {
  return useQuery({
    queryKey: ['inventory', 'employee-uniforms', employeeId],
    queryFn: () => fetchEmployeeUniforms(employeeId!),
    enabled: Boolean(employeeId),
    staleTime: 1000 * 60 * 2,
  });
}

export async function returnUniform(
  payload: InventoryReturnRequest
): Promise<InventoryMutationResponse> {
  const response = await apiClient.post<InventoryMutationResponse>('/inventory/return/', payload);
  return response.data;
}

export function useReturnUniform() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: returnUniform,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export async function fetchUniformsCatalog(): Promise<InventoryUniformsResponse> {
  const response = await apiClient.get<InventoryUniformsResponse>('/inventory/uniforms/');
  return response.data;
}

export function useUniformsCatalog() {
  return useQuery({
    queryKey: ['inventory', 'uniforms-catalog'],
    queryFn: fetchUniformsCatalog,
    staleTime: 1000 * 60 * 5,
  });
}

export async function createUniform(
  payload: InventoryUniformCreateRequest
): Promise<InventoryMutationResponse> {
  const response = await apiClient.post<InventoryMutationResponse>('/inventory/uniforms/', payload);
  return response.data;
}

export function useCreateUniform() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUniform,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export async function fetchStockFormOptions(): Promise<StockFormResponse> {
  const response = await apiClient.get<StockFormResponse>('/inventory/stock/');
  return response.data;
}

export function useStockFormOptions() {
  return useQuery({
    queryKey: ['inventory', 'stock-form'],
    queryFn: fetchStockFormOptions,
    staleTime: 1000 * 60 * 3,
  });
}

export async function addInventoryStock(
  payload: InventoryStockRequest
): Promise<InventoryMutationResponse> {
  const response = await apiClient.post<InventoryMutationResponse>('/inventory/stock/', payload);
  return response.data;
}

export function useAddInventoryStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addInventoryStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export async function fetchStockRemoveFormOptions(): Promise<StockRemoveFormResponse> {
  const response = await apiClient.get<StockRemoveFormResponse>('/inventory/stock/remove/');
  return response.data;
}

export function useStockRemoveFormOptions() {
  return useQuery({
    queryKey: ['inventory', 'stock-remove-form'],
    queryFn: fetchStockRemoveFormOptions,
    staleTime: 1000 * 60 * 3,
  });
}

export async function removeInventoryStock(
  payload: InventoryStockRemoveRequest
): Promise<InventoryMutationResponse> {
  const response = await apiClient.post<InventoryMutationResponse>(
    '/inventory/stock/remove/',
    payload
  );
  return response.data;
}

export function useRemoveInventoryStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeInventoryStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export async function fetchLowStockAlerts(): Promise<InventoryLowStockResponse> {
  const response = await apiClient.get<InventoryLowStockResponse>('/inventory/low-stock/');
  return response.data;
}

export function useLowStockAlerts() {
  return useQuery({
    queryKey: ['inventory', 'low-stock'],
    queryFn: fetchLowStockAlerts,
    staleTime: 1000 * 60 * 2,
  });
}

export async function fetchInventoryReports(type?: string): Promise<InventoryReportsResponse> {
  const params: Record<string, string> = {};
  if (type) params.type = type;
  const response = await apiClient.get<InventoryReportsResponse>('/inventory/reports/', { params });
  return response.data;
}

export function useInventoryReports(type?: string) {
  return useQuery({
    queryKey: ['inventory', 'reports', type || 'all'],
    queryFn: () => fetchInventoryReports(type),
    staleTime: 1000 * 60 * 2,
  });
}

/* =========================================================================
 * 5. Packaging Supplies API
 * ========================================================================= */

export async function fetchPackagingDashboard(): Promise<PackagingDashboardResponse> {
  const response = await apiClient.get<PackagingDashboardResponse>('/packaging/');
  return response.data;
}

export function usePackagingDashboard() {
  return useQuery({
    queryKey: ['packaging', 'dashboard'],
    queryFn: fetchPackagingDashboard,
    staleTime: 1000 * 60 * 1,
  });
}

export async function fetchPackagingPullFormOptions(): Promise<PackagingMaterialFormResponse> {
  const response = await apiClient.get<PackagingMaterialFormResponse>('/packaging/pull/');
  return response.data;
}

export function usePackagingPullFormOptions() {
  return useQuery({
    queryKey: ['packaging', 'pull-form'],
    queryFn: fetchPackagingPullFormOptions,
    staleTime: 1000 * 60 * 3,
  });
}

export async function pullPackagingMaterial(
  payload: PackagingMaterialWriteRequest
): Promise<PackagingMutationResponse> {
  const response = await apiClient.post<PackagingMutationResponse>('/packaging/pull/', payload);
  return response.data;
}

export function usePullPackagingMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: pullPackagingMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packaging'] });
    },
  });
}

export async function fetchPackagingReturnFormOptions(
  jobId?: string
): Promise<PackagingMaterialFormResponse> {
  const params = jobId ? { job_id: jobId } : undefined;
  const response = await apiClient.get<PackagingMaterialFormResponse>('/packaging/return/', {
    params,
  });
  return response.data;
}

export function usePackagingReturnFormOptions(jobId?: string) {
  return useQuery({
    queryKey: ['packaging', 'return-form', jobId],
    queryFn: () => fetchPackagingReturnFormOptions(jobId),
    staleTime: 1000 * 60 * 3,
  });
}

export async function returnPackagingMaterial(
  payload: PackagingReturnWriteRequest
): Promise<PackagingMutationResponse> {
  const response = await apiClient.post<PackagingMutationResponse>('/packaging/return/', payload);
  return response.data;
}

export function useReturnPackagingMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: returnPackagingMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packaging'] });
    },
  });
}

export async function fetchPackagingOrderFormOptions(): Promise<PackagingMaterialFormResponse> {
  const response = await apiClient.get<PackagingMaterialFormResponse>('/packaging/order/');
  return response.data;
}

export function usePackagingOrderFormOptions() {
  return useQuery({
    queryKey: ['packaging', 'order-form'],
    queryFn: fetchPackagingOrderFormOptions,
    staleTime: 1000 * 60 * 3,
  });
}

export async function orderPackagingMaterial(
  payload: PackagingMaterialWriteRequest
): Promise<PackagingMutationResponse> {
  const response = await apiClient.post<PackagingMutationResponse>('/packaging/order/', payload);
  return response.data;
}

export function useOrderPackagingMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderPackagingMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packaging'] });
    },
  });
}

export async function fetchPackagingReceipts(date?: string): Promise<PackagingReceiptsResponse> {
  const params = date ? { date } : undefined;
  const response = await apiClient.get<PackagingReceiptsResponse>('/packaging/receipts/', {
    params,
  });
  return response.data;
}

export function usePackagingReceipts(date?: string) {
  return useQuery({
    queryKey: ['packaging', 'receipts', date],
    queryFn: () => fetchPackagingReceipts(date),
    staleTime: 1000 * 60 * 2,
  });
}

export async function recordPackagingReceipts(
  payload: PackagingMutationResponseRequest
): Promise<PackagingMutationResponse> {
  const response = await apiClient.post<PackagingMutationResponse>(
    '/packaging/receipts/',
    payload
  );
  return response.data;
}

export function useRecordPackagingReceipts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordPackagingReceipts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packaging'] });
    },
  });
}

export async function fetchPackagingIncomingOrders(params?: {
  status?: string;
  acknowledged?: string;
}): Promise<PackagingIncomingOrdersResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '' && v !== 'all')
  );
  const response = await apiClient.get<PackagingIncomingOrdersResponse>('/packaging/orders/', {
    params: cleanParams,
  });
  return response.data;
}

export function usePackagingIncomingOrders(params?: { status?: string; acknowledged?: string }) {
  return useQuery({
    queryKey: ['packaging', 'incoming-orders', params],
    queryFn: () => fetchPackagingIncomingOrders(params),
    staleTime: 1000 * 60 * 2,
  });
}

export async function fetchPackagingQuotes(params?: {
  status?: string;
}): Promise<PackagingQuotesResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '' && v !== 'all')
  );
  const response = await apiClient.get<PackagingQuotesResponse>('/packaging/quotes/', {
    params: cleanParams,
  });
  return response.data;
}

export function usePackagingQuotes(params?: { status?: string }) {
  return useQuery({
    queryKey: ['packaging', 'quotes', params],
    queryFn: () => fetchPackagingQuotes(params),
    staleTime: 1000 * 60 * 2,
  });
}
