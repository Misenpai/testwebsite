"use client";

import { useState } from "react";
import FieldTripModal from "./FieldTripModel";
import type { ApiResponse, User } from "../types";

interface AttendanceTableProps {
  data: ApiResponse | null;
  loading: boolean;
  error: string;
  onViewDetails: (user: User) => void;
  onDownloadExcel: (user: User) => void;
  apiBase: string;
  updateLocationType: (
    empId: string,
    newType: "ABSOLUTE" | "APPROX" | "FIELDTRIP",
  ) => Promise<void>;
}

export default function AttendanceTable({
  data,
  loading,
  error,
  onViewDetails,
  onDownloadExcel,
  apiBase,
  updateLocationType,
}: AttendanceTableProps): React.JSX.Element {
  const [fieldTripModalUser, setFieldTripModalUser] = useState<User | null>(
    null,
  );

  const locationTypes: Array<"ABSOLUTE" | "APPROX" | "FIELDTRIP"> = [
    "ABSOLUTE",
    "APPROX",
    "FIELDTRIP",
  ];

  const handleLocationTypeChange = async (
    empId: string,
    newType: "ABSOLUTE" | "APPROX" | "FIELDTRIP",
  ) => {
    if (newType === "FIELDTRIP") {
      const user = data?.data.find((u) => u.empId === empId);
      if (user) {
        setFieldTripModalUser(user);
      }
    } else {
      await updateLocationType(empId, newType);
    }
  };

  const handleSaveFieldTrips = async (empId: string, fieldTrips: any[]) => {
    try {
      const response = await fetch(`${apiBase}/user-location`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId,
          locationType: "FIELDTRIP",
          fieldTripDates: fieldTrips,
        }),
      });

      if (response.ok) {
        await updateLocationType(empId, "FIELDTRIP");
      }
    } catch (error) {
      console.error("Error saving field trips:", error);
    }
  };

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
    <>
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
                  <div className="location-type-cell">
                    <select
                      className="location-select"
                      aria-label="Select location type"
                      value={user.locationType}
                      onChange={(e) =>
                        handleLocationTypeChange(
                          user.empId,
                          e.target.value as "ABSOLUTE" | "APPROX" | "FIELDTRIP",
                        )
                      }
                    >
                      {locationTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                    {user.locationType === "FIELDTRIP" && (
                      <button
                        className="manage-trips-btn"
                        onClick={() => setFieldTripModalUser(user)}
                      >
                        📅
                      </button>
                    )}
                  </div>
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

      {fieldTripModalUser && (
        <FieldTripModal
          user={fieldTripModalUser}
          apiBase={apiBase} // pass the API base so modal can fetch trips
          onClose={() => setFieldTripModalUser(null)}
          onSave={handleSaveFieldTrips}
        />
      )}
    </>
  );
}
