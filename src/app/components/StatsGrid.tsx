'use client';

import type { ApiResponse } from '../types';

interface StatsGridProps {
  data: ApiResponse | null;
}

export default function StatsGrid({ data }: StatsGridProps): React.JSX.Element {
  if (!data) {
    return (
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <h3>Period</h3>
          <div className="stat-value">-</div>
        </div>
        <div className="stat-card">
          <h3>Avg Attendance</h3>
          <div className="stat-value">0%</div>
        </div>
      </div>
    );
  }

  const activeCount = data.data.filter(u => u.isActive).length;
  const totalAttendanceDays = data.data.reduce((sum, user) => sum + user.monthlyStatistics.totalDays, 0);
  const avgAttendance = data.totalUsers > 0 ? (totalAttendanceDays / data.totalUsers).toFixed(1) : '0';
  
  // Calculate attendance percentage (assuming 22 working days per month)
  const workingDaysInMonth = 22;
  const attendancePercentage = data.totalUsers > 0 
    ? ((totalAttendanceDays / (data.totalUsers * workingDaysInMonth)) * 100).toFixed(1)
    : '0';

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Users</h3>
        <div className="stat-value">{data.totalUsers}</div>
      </div>
      <div className="stat-card">
        <h3>Active Users</h3>
        <div className="stat-value">{activeCount}</div>
      </div>
      <div className="stat-card">
        <h3>Period</h3>
        <div className="stat-value">{monthNames[data.month - 1]} {data.year}</div>
      </div>
      <div className="stat-card">
        <h3>Avg Days/User</h3>
        <div className="stat-value">{avgAttendance}</div>
      </div>
      <div className="stat-card">
        <h3>Overall Attendance</h3>
        <div className="stat-value">{attendancePercentage}%</div>
      </div>
    </div>
  );
}