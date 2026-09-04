import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './axios';
import type {
  ProfileResponse,
  ProfileUpdatePayload,
  PeopleDirectoryResponse,
  AwardsResponse,
  DepartmentsResponse,
  GoalsManagementResponse,
  GoalsQueryParams,
  MyGoalsResponse,
  MyGoalsQueryParams,
  CommunicationDashboardResponse,
  CommunicationDashboardQueryParams,
  CommunicationLogDetail,
  AcknowledgeLogPayload,
  TeamResponse,
  TeamMember,
  TeamAddMemberPayload,
  TeamEditMemberPayload,
} from './types';

/* =========================================================================
 * 1 & 2. Profile API (/api/v1/profile/ & /api/v1/profile/<user_id>/)
 * ========================================================================= */

export async function fetchProfile(userId?: number | string): Promise<ProfileResponse> {
  const url = userId ? `/profile/${userId}/` : '/profile/';
  const response = await apiClient.get<ProfileResponse>(url);
  return response.data;
}

export async function updateProfile(payload: ProfileUpdatePayload): Promise<ProfileResponse> {
  const hasFile = payload.profile_picture instanceof File;
  
  if (hasFile) {
    const formData = new FormData();
    if (payload.first_name !== undefined) formData.append('first_name', payload.first_name);
    if (payload.last_name !== undefined) formData.append('last_name', payload.last_name);
    if (payload.phone_number !== undefined) formData.append('phone_number', payload.phone_number);
    if (payload.job_title !== undefined) formData.append('job_title', payload.job_title);
    if (payload.location !== undefined) formData.append('location', payload.location);
    if (payload.hobbies !== undefined) formData.append('hobbies', payload.hobbies);
    if (payload.favourite_quote !== undefined) formData.append('favourite_quote', payload.favourite_quote);
    if (payload.profile_picture) formData.append('profile_picture', payload.profile_picture);

    const response = await apiClient.patch<ProfileResponse>('/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  const response = await apiClient.patch<ProfileResponse>('/profile/', payload);
  return response.data;
}

export function useProfile(userId?: number | string) {
  return useQuery({
    queryKey: ['profile', userId ? String(userId) : 'me'],
    queryFn: () => fetchProfile(userId),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile', 'me'], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });
}

/* =========================================================================
 * 3. People Directory API (/api/v1/people/)
 * ========================================================================= */

export async function fetchPeopleDirectory(params?: { page?: number }): Promise<PeopleDirectoryResponse> {
  const response = await apiClient.get<PeopleDirectoryResponse>('/people/', {
    params: {
      page: params?.page || 1,
    },
  });
  return response.data;
}

export function usePeopleDirectory(params?: { page?: number }) {
  return useQuery({
    queryKey: ['people', params?.page || 1],
    queryFn: () => fetchPeopleDirectory(params),
    staleTime: 1000 * 60 * 3,
  });
}

/* =========================================================================
 * 4. Current Awards & Hall of Fame API (/api/v1/awards/me/)
 * ========================================================================= */

export async function fetchAwardsMe(): Promise<AwardsResponse> {
  const response = await apiClient.get<AwardsResponse>('/awards/me/');
  return response.data;
}

export function useAwardsMe() {
  return useQuery({
    queryKey: ['awards', 'me'],
    queryFn: fetchAwardsMe,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

/* =========================================================================
 * 5. Departments List API (/api/v1/departments/)
 * ========================================================================= */

export async function fetchDepartments(): Promise<DepartmentsResponse> {
  const response = await apiClient.get<DepartmentsResponse>('/departments/');
  return response.data;
}

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    staleTime: 1000 * 60 * 5,
  });
}

/* =========================================================================
 * 6 & 7. Goals Management & My Goals API (/api/v1/goals/ & /api/v1/goals/me/)
 * ========================================================================= */

export async function fetchGoals(params?: GoalsQueryParams): Promise<GoalsManagementResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '' && v !== 'all')
  );
  const response = await apiClient.get<GoalsManagementResponse>('/goals/', {
    params: cleanParams,
  });
  return response.data;
}

export function useGoals(params?: GoalsQueryParams) {
  return useQuery({
    queryKey: ['goals', params],
    queryFn: () => fetchGoals(params),
    staleTime: 1000 * 60 * 2,
  });
}

export async function fetchMyGoals(params?: MyGoalsQueryParams): Promise<MyGoalsResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '' && v !== 'all')
  );
  const response = await apiClient.get<MyGoalsResponse>('/goals/me/', {
    params: cleanParams,
  });
  return response.data;
}

export function useMyGoals(params?: MyGoalsQueryParams) {
  return useQuery({
    queryKey: ['goals', 'me', params],
    queryFn: () => fetchMyGoals(params),
    staleTime: 1000 * 60 * 2,
  });
}

/* =========================================================================
 * 8. Communication Log Dashboard API (/api/v1/communication/dashboard/)
 * ========================================================================= */

export async function fetchCommunicationDashboard(
  params?: CommunicationDashboardQueryParams
): Promise<CommunicationDashboardResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '')
  );
  const response = await apiClient.get<CommunicationDashboardResponse>('/communication/dashboard/', {
    params: cleanParams,
  });
  return response.data;
}

export function useCommunicationDashboard(params?: CommunicationDashboardQueryParams) {
  return useQuery({
    queryKey: ['communication', 'dashboard', params],
    queryFn: () => fetchCommunicationDashboard(params),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

/* =========================================================================
 * 9. Communication Log Detail API (/api/v1/communication/logs/<id>/)
 * ========================================================================= */

export async function fetchCommunicationLogDetail(id: number | string): Promise<CommunicationLogDetail> {
  const response = await apiClient.get<CommunicationLogDetail>(`/communication/logs/${id}/`);
  return response.data;
}

export function useCommunicationLogDetail(id: number | string | undefined) {
  return useQuery({
    queryKey: ['communication', 'log', id],
    queryFn: () => fetchCommunicationLogDetail(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export async function acknowledgeCommunicationLog(
  id: number | string,
  payload: AcknowledgeLogPayload
): Promise<CommunicationLogDetail> {
  const response = await apiClient.post<CommunicationLogDetail>(
    `/communication/logs/${id}/acknowledge/`,
    payload
  );
  return response.data;
}

export function useAcknowledgeCommunicationLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: AcknowledgeLogPayload }) =>
      acknowledgeCommunicationLog(id, payload),
    onSuccess: (updatedLog, variables) => {
      queryClient.setQueryData(['communication', 'log', String(variables.id)], updatedLog);
      queryClient.invalidateQueries({ queryKey: ['communication', 'log', String(variables.id)] });
      queryClient.invalidateQueries({ queryKey: ['communication', 'dashboard'] });
    },
  });
}

/* =========================================================================
 * 10. Team API (/api/v1/team/)
 * ========================================================================= */

export async function fetchTeam(role?: string): Promise<TeamResponse> {
  const params: Record<string, string> = {};
  if (role && role !== 'all') {
    params.role = role;
  }
  const response = await apiClient.get<TeamResponse>('/team/', { params });
  return response.data;
}

export function useTeam(role?: string) {
  return useQuery({
    queryKey: ['team', role || 'all'],
    queryFn: () => fetchTeam(role),
    staleTime: 1000 * 60 * 2,
  });
}

export async function fetchTeamAvailableUsers(): Promise<TeamMember[]> {
  const response = await apiClient.get<TeamMember[]>('/team/available-users/');
  return response.data;
}

export function useTeamAvailableUsers() {
  return useQuery({
    queryKey: ['team', 'available-users'],
    queryFn: fetchTeamAvailableUsers,
    staleTime: 1000 * 60 * 2,
  });
}

export async function addTeamMember(payload: TeamAddMemberPayload): Promise<TeamMember> {
  const response = await apiClient.post<TeamMember>('/team/add/', payload);
  return response.data;
}

export function useAddTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export async function editTeamMember(
  userId: number | string,
  payload: TeamEditMemberPayload
): Promise<TeamMember> {
  const response = await apiClient.patch<TeamMember>(`/team/members/${userId}/`, payload);
  return response.data;
}

export function useEditTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: number | string; payload: TeamEditMemberPayload }) =>
      editTeamMember(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export async function removeTeamMember(
  userId: number | string
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    `/team/remove/${userId}/`
  );
  return response.data;
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number | string) => removeTeamMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}


