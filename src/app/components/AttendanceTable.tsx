// src/app/components/AttendanceTable.tsx
"use client";

import { useState } from "react";
import FieldTripModal from "./FieldTripModel";
import type { ApiResponse, User, FieldTrip } from "../types";

interface AttendanceTableProps {
  data: ApiResponse | null;
  loading: boolean;
  error: string;
  onViewDetails: (user: User) => void;
  onDownloadExcel: (user: User) => void;
  apiBase: string;
  updateLocationType: (
    empId: string,
    newType: "APPROX" | "ABSOLUTE",
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

  // Only two selectable location types
  const locationTypes: Array<"APPROX" | "ABSOLUTE"> = [
    "APPROX",
    "ABSOLUTE",
  ];

  const handleLocationTypeChange = async (
    empId: string,
    newType: "APPROX" | "ABSOLUTE",
  ) => {
    await updateLocationType(empId, newType);
  };

  const handleSaveFieldTrips = async (empId: string, fieldTrips: FieldTrip[]) => {
    try {
      console.log('Saving field trips:', { empId, fieldTrips }); // Debug log

      const response = await fetch(`${apiBase}/user-location/field-trips`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId,
          fieldTripDates: fieldTrips,
        }),
      });

      const result = await response.json();
      console.log('Field trips save response:', result); // Debug log

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save field trips');
      }
      
      // Show success message
      alert('Field trips saved successfully!');
      
      // You can refresh the data here if needed
      // window.location.reload(); // Or implement a proper refresh mechanism
    } catch (error) {
      console.error("Error saving field trips:", error);
      alert('Failed to save field trips. Please try again.');
    }
  };

  // Function to check if user is currently on a field trip
  const isOnFieldTrip = (user: User): boolean => {
    if (!user.fieldTrips || user.fieldTrips.length === 0) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return user.fieldTrips.some(trip => {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      return today >= startDate && today <= endDate;
    });
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
              <th>Field Trips</th>
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
                      value={user.locationType}
                      onChange={(e) =>
                        handleLocationTypeChange(
                          user.empId,
                          e.target.value as "APPROX" | "ABSOLUTE",
                        )
                      }
                    >
                      {locationTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    
                    {/* Show if currently on field trip */}
                    {isOnFieldTrip(user) && (
                      <div className="field-trip-indicator">
                        🏃‍♂️ On Field Trip
                      </div>
                    )}
                  </div>
                </td>

                <td>
                  <button
                    className="manage-trips-btn"
                    onClick={() => setFieldTripModalUser(user)}
                  >
                    📅 Manage
                  </button>
                  {user.fieldTrips && user.fieldTrips.length > 0 && (
                    <div className="field-trip-count">
                      {user.fieldTrips.length} scheduled
                    </div>
                  )}
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
          apiBase={apiBase}
          onClose={() => setFieldTripModalUser(null)}
          onSave={handleSaveFieldTrips}
        />
      )}
    </>
  );
}