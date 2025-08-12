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
          <h3>Attendance This Month</h3>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <h3>Average Attendance</h3>
          <div className="stat-value">0%</div>
        </div>
      </div>
    );
  }

  const activeCount: number = data.data.filter(u => u.isActive).length;
  const totalAttendance: number = data.data.reduce((sum, u) => sum + u.monthlyAttendanceCount, 0);
  const avgAttendance: number = data.totalUsers > 0 
    ? Math.round((totalAttendance / (data.totalUsers * 30)) * 100) 
    : 0;

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
        <h3>Attendance This Month</h3>
        <div className="stat-value">{totalAttendance}</div>
      </div>
      <div className="stat-card">
        <h3>Average Attendance</h3>
        <div className="stat-value">{avgAttendance}%</div>
      </div>
    </div>
  );
}