import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://medstaff-6twe.vercel.app/api';

export type AuthUser = {
  id: string;
  email: string;
  role: 'STAFF' | 'ADMIN';
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
};

export type AttendanceRecord = {
  id: string;
  attendanceDate: string;
  clockIn: string | null;
  clockOut: string | null;
  clockInPhoto: string | null;
  clockOutPhoto: string | null;
  clockInLatitude: string | number | null;
  clockInLongitude: string | number | null;
  clockOutLatitude: string | number | null;
  clockOutLongitude: string | number | null;
  status: 'HADIR' | 'TERLAMBAT' | 'IZIN';
};

export type EmployeeProfile = {
  id: string;
  employeeId: string;
  fullName: string;
  phone: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  identityNumber: string | null;
  address: string | null;
  companyName: string;
  position: string;
  profilePhoto: string | null;
  createdAt?: string;
  updatedAt?: string;
};

async function getAuthHeaders() {
  const token = await getToken();

  if (!token) {
    throw new Error('Sesi login tidak ditemukan');
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function handleResponse(response: Response) {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result?.message)
        ? result.message.join(', ')
        : result?.message || 'Terjadi kesalahan pada server',
    );
  }

  return result;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = await handleResponse(response);

  await AsyncStorage.setItem(
    'accessToken',
    result.data.accessToken,
  );

  await AsyncStorage.setItem(
    'user',
    JSON.stringify(result.data.user),
  );

  return result;
}

export async function register(
  email: string,
  password: string,
) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return handleResponse(response);
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem('accessToken');
}

export async function getStoredUser(): Promise<AuthUser | null> {
  const user = await AsyncStorage.getItem('user');

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await AsyncStorage.multiRemove([
    'accessToken',
    'user',
  ]);
}

export async function getMyProfile() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/employees/me`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function updateMyProfile(
  data: Partial<EmployeeProfile>,
) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/employees/me`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function getEmployees() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/employees`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function getEmployeeById(id: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function getTodayAttendance() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/attendance/today`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function clockIn(
  photo: string,
  latitude: number,
  longitude: number,
) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/attendance/clock-in`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      photo,
      latitude,
      longitude,
    }),
  });

  return handleResponse(response);
}

export async function clockOut(
  photo: string,
  latitude: number,
  longitude: number,
) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/attendance/clock-out`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      photo,
      latitude,
      longitude,
    }),
  });

  return handleResponse(response);
}

export async function getAttendanceHistory(): Promise<{
  success: boolean;
  message: string;
  data: AttendanceRecord[];
}> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/attendance/history`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function getActivities() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/activities`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function getTodayActivities() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/activities/today`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function getMyActivityAttendance() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/activities/my-attendance`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function attendActivity(id: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/activities/${id}/attend`, {
    method: 'POST',
    headers,
  });

  return handleResponse(response);
}

export async function getStaffDashboard() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/dashboard/staff`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function getAdminDashboard() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/dashboard/admin`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function getNotifications() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/notifications`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function getUnreadNotificationCount() {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/notifications/unread-count`,
    {
      method: 'GET',
      headers,
    },
  );

  return handleResponse(response);
}

export async function markNotificationAsRead(
  id: string,
) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/notifications/${id}/read`,
    {
      method: 'PATCH',
      headers,
    },
  );

  return handleResponse(response);
}

export async function markAllNotificationsAsRead() {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/notifications/read-all`,
    {
      method: 'PATCH',
      headers,
    },
  );

  return handleResponse(response);
}

export async function getNotificationPreferences() {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/notifications/preferences`,
    {
      method: 'GET',
      headers,
    },
  );

  return handleResponse(response);
}

export async function updateNotificationPreferences(
  data: Record<string, unknown>,
) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/notifications/preferences`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    },
  );

  return handleResponse(response);
}

export async function getMyLeaveRequests() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/leave/my`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function getMyLeaveRequestById(id: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/leave/my/${id}`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function createLeaveRequest(
  data: Record<string, unknown>,
) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/leave`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function getAdminLeaveRequests() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/leave/admin`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function approveLeaveRequest(id: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/leave/admin/${id}/approve`,
    {
      method: 'PATCH',
      headers,
    },
  );

  return handleResponse(response);
}

export async function rejectLeaveRequest(id: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/leave/admin/${id}/reject`,
    {
      method: 'PATCH',
      headers,
    },
  );

  return handleResponse(response);
}

export async function getMyDocumentRequests() {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/document-request/my`,
    {
      method: 'GET',
      headers,
    },
  );

  return handleResponse(response);
}

export async function getMyDocumentRequestById(
  id: string,
) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/document-request/my/${id}`,
    {
      method: 'GET',
      headers,
    },
  );

  return handleResponse(response);
}

export async function createDocumentRequest(
  data: Record<string, unknown>,
) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/document-request`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    },
  );

  return handleResponse(response);
}

export async function getAdminDocumentRequests() {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/document-request/admin`,
    {
      method: 'GET',
      headers,
    },
  );

  return handleResponse(response);
}

export async function reviewDocumentRequest(
  id: string,
  data: Record<string, unknown>,
) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/document-request/admin/${id}/review`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    },
  );

  return handleResponse(response);
}

export async function getTodaySchedule() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/schedule/today`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function getMonthSchedule(
  year: number,
  month: number,
) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/schedule/month?year=${year}&month=${month}`,
    {
      method: 'GET',
      headers,
    },
  );

  return handleResponse(response);
}

export async function getAdminScheduleEmployees() {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/schedule/admin/employees`,
    {
      method: 'GET',
      headers,
    },
  );

  return handleResponse(response);
}

export async function createAdminSchedule(
  data: Record<string, unknown>,
) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/schedule/admin`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function getAdminMonthSchedule(
  year: number,
  month: number,
) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/schedule/admin/month?year=${year}&month=${month}`,
    {
      method: 'GET',
      headers,
    },
  );

  return handleResponse(response);
}

export async function getShifts() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/shifts`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function createShift(
  data: Record<string, unknown>,
) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/shifts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function getHelp() {
  const response = await fetch(`${API_URL}/help`, {
    method: 'GET',
  });

  return handleResponse(response);
}

export async function getHelpById(id: string) {
  const response = await fetch(`${API_URL}/help/${id}`, {
    method: 'GET',
  });

  return handleResponse(response);
}

export async function getLanguage() {
  const response = await fetch(`${API_URL}/language`, {
    method: 'GET',
  });

  return handleResponse(response);
}

export async function getMyLanguage() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/language/me`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function updateMyLanguage(
  language: string,
) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/language/me`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      language,
    }),
  });

  return handleResponse(response);
}

export async function uploadProfile(
  uri: string,
  fileName = 'profile.jpg',
  mimeType = 'image/jpeg',
) {
  const token = await getToken();

  if (!token) {
    throw new Error('Sesi login tidak ditemukan');
  }

  const formData = new FormData();

  formData.append(
    'file',
    {
      uri,
      name: fileName,
      type: mimeType,
    } as any,
  );

  const response = await fetch(`${API_URL}/upload/profile`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse(response);
}

export async function uploadAttendance(
  uri: string,
  fileName = 'attendance.jpg',
  mimeType = 'image/jpeg',
) {
  const token = await getToken();

  if (!token) {
    throw new Error('Sesi login tidak ditemukan');
  }

  const formData = new FormData();

  formData.append(
    'file',
    {
      uri,
      name: fileName,
      type: mimeType,
    } as any,
  );

  const response = await fetch(
    `${API_URL}/upload/attendance`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  return handleResponse(response);
}

export async function uploadLeave(
  uri: string,
  fileName = 'leave.jpg',
  mimeType = 'image/jpeg',
) {
  const token = await getToken();

  if (!token) {
    throw new Error('Sesi login tidak ditemukan');
  }

  const formData = new FormData();

  formData.append(
    'file',
    {
      uri,
      name: fileName,
      type: mimeType,
    } as any,
  );

  const response = await fetch(`${API_URL}/upload/leave`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse(response);
}

export async function uploadDocument(
  uri: string,
  fileName = 'document.pdf',
  mimeType = 'application/pdf',
) {
  const token = await getToken();

  if (!token) {
    throw new Error('Sesi login tidak ditemukan');
  }

  const formData = new FormData();

  formData.append(
    'file',
    {
      uri,
      name: fileName,
      type: mimeType,
    } as any,
  );

  const response = await fetch(
    `${API_URL}/upload/document`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  return handleResponse(response);
}

export { API_URL };