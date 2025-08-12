export interface Photo {
  url: string;
  type?: string;
}

export interface Audio {
  url: string;
  duration?: number;
}

export interface Attendance {
  date: string;
  checkInTime: string;
  location?: string;
  photos: Photo[];
  audio: Audio[];
}

export interface User {
  empId: string;
  username: string;
  email: string;
  department: string;
  locationType: string;
  monthlyAttendanceCount: number;
  isActive: boolean;
  attendances: Attendance[];
}

export interface ApiResponse {
  success: boolean;
  totalUsers: number;
  data: User[];
}

export interface Filters {
  month: number;
  year: number;
  apiBase: string;
}

export interface StatsData {
  totalUsers: number;
  activeUsers: number;
  monthAttendance: number;
  avgAttendance: number;
}