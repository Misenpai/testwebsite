'use client';

import type { ApiResponse, User } from '../types';

interface AttendanceTableProps {
  data: ApiResponse | null;
  loading: boolean;
  error: string;
  onViewDetails: (user: User) => void;
}

export default function AttendanceTable({ 
  data, 
  loading, 
  error, 
  onViewDetails 
}: AttendanceTableProps): React.JSX.Element {
  if (loading) {
    return (
      <div className="users-table">
        <div className="table-header">
          <h2>Employee Attendance Records</h2>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-table">
        <div className="table-header">
          <h2>Employee Attendance Records</h2>
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!data || !data.data) {
    return (
      <div className="users-table">
        <div className="table-header">
          <h2>Employee Attendance Records</h2>
        </div>
        <div className="loading">No data available</div>
      </div>
    );
  }

  return (
    <div className="users-table">
      <div className="table-header">
        <h2>Employee Attendance Records</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Department</th>
            <th>Location Type</th>
            <th>Monthly Attendance</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((user: User, index: number) => (
            <tr key={user.empId || index} className="user-row">
              <td>{user.empId}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.department}</td>
              <td>
                <span className="badge location-type">{user.locationType}</span>
              </td>
              <td>{user.monthlyAttendanceCount} days</td>
              <td>
                <span className={`badge ${user.isActive ? 'badge-active' : 'badge-inactive'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <button 
                  className="view-btn" 
                  onClick={() => onViewDetails(user)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}