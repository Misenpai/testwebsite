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
  locationType: 'APPROX' | 'ABSOLUTE'; // Changed to ABSOLUTE
  isActive: boolean;
  attendances: Attendance[];
  fieldTrips?: FieldTrip[];
}

export interface FieldTrip {
  startDate: string;
  endDate: string;
  description?: string;
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