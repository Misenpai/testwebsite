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
  checkOutTime?: string;
  sessionType: 'FORENOON' | 'AFTERNOON';
  attendanceType: 'FULL_DAY' | 'HALF_DAY' | null;
  isCheckedOut: boolean;
  location?: string;
  photos: Photo[];
  audio: Audio[];
}

export interface MonthlyStatistics {
  totalDays: number;
  fullDays: number;
  halfDays: number;
}

export interface User {
  empCode: string; // Changed from empId to empCode
  username: string;
  email: string;
  department: string;
  locationType: 'APPROX' | 'ABSOLUTE' | 'FIELDTRIP'; // Added FIELDTRIP
  isActive: boolean;
  attendances: Attendance[];
  fieldTrips?: FieldTrip[];
  monthlyStatistics: MonthlyStatistics;
}

export interface FieldTrip {
  startDate: string;
  endDate: string;
  description?: string;
  tripKey?: string;
  isActive?: boolean;
}

export interface ApiResponse {
  success: boolean;
  totalUsers: number;
  month: number;
  year: number;
  data: User[];
}

export interface Filters {
  month: number;
  year: number;
  apiBase: string;
}