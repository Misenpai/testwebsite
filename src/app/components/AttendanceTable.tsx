"use client";

import type { ApiResponse, User } from "../types";

interface AttendanceTableProps {
  data: ApiResponse | null;
  loading: boolean;
  error: string;
  onViewDetails: (user: User) => void;
  onLocationTypeChange: (
    empId: string,
    newType: "ABSOLUTE" | "APPROX" | "FIELDTRIP"
  ) => void;
  onDownloadExcel: (user: User) => void;
  apiBase: string;
}

export default function AttendanceTable({
  data,
  loading,
  error,
  onViewDetails,
  onLocationTypeChange,
  onDownloadExcel,
}: AttendanceTableProps): React.JSX.Element {
  const locationTypes: Array<"ABSOLUTE" | "APPROX" | "FIELDTRIP"> = [
    "ABSOLUTE",
    "APPROX",
    "FIELDTRIP",
  ];

  if (loading) {
    return (
      <div className="users-table">
        <div className="table-header">
          <h2>Employee Attendance Records</h2>
        </div>
        <div className="loading">Loading…</div>
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
                <select
                  className="location-select"
                  aria-label="Select location type"
                  value={user.locationType}
                  onChange={(e) =>
                    onLocationTypeChange(
                      user.empId,
                      e.target.value as "ABSOLUTE" | "APPROX" | "FIELDTRIP"
                    )
                  }
                >
                  {locationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </td>

              <td>
                <span
                  className={`badge ${
                    user.isActive ? "badge-active" : "badge-inactive"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td>
                <div className="action-buttons">
                  <button
                    className="view-btn"
                    onClick={() => onViewDetails(user)}
                  >
                    View
                  </button>
                  <button
                    className="download-btn"
                    onClick={() => onDownloadExcel(user)}
                  >
                    Download
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
