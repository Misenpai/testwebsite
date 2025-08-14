"use client";

import React, { useState, useEffect } from "react";
import { User } from "../types";

interface FieldTripModalProps {
  user: User;
  onClose: () => void;
  onSave: (empId: string, fieldTrips: any[]) => void;
  apiBase: string; // pass from parent
}

export default function FieldTripModal({
  user,
  onClose,
  onSave,
  apiBase,
}: FieldTripModalProps) {
  const [fieldTrips, setFieldTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTrip, setNewTrip] = useState({
    startDate: "",
    endDate: "",
    description: "",
  });

  // Fetch existing field trips from backend when modal opens
  useEffect(() => {
    const fetchFieldTrips = async () => {
      try {
        const res = await fetch(`${apiBase}/user-location/${user.empId}`);
        const data = await res.json();
        if (data.success && data.data?.fieldTrips) {
          setFieldTrips(
            data.data.fieldTrips.map((trip: any) => ({
              startDate: trip.startDate.split("T")[0],
              endDate: trip.endDate.split("T")[0],
              description: trip.description || "",
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching field trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFieldTrips();
  }, [user.empId, apiBase]);

  const handleAddTrip = () => {
    if (newTrip.startDate && newTrip.endDate) {
      setFieldTrips([...fieldTrips, { ...newTrip }]);
      setNewTrip({ startDate: "", endDate: "", description: "" });
    }
  };

  const handleRemoveTrip = (index: number) => {
    setFieldTrips(fieldTrips.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(user.empId, fieldTrips);
    onClose();
  };

  return (
    <div
      className="modal active"
      onClick={(e) => {
        if ((e.target as HTMLElement).classList.contains("modal")) onClose();
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>Manage Field Trips - {user.username}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <p>Loading field trips…</p>
          ) : (
            <>
              <div className="field-trip-form">
                <h3>Add Field Trip</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={newTrip.startDate}
                      onChange={(e) =>
                        setNewTrip({ ...newTrip, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={newTrip.endDate}
                      min={newTrip.startDate}
                      onChange={(e) =>
                        setNewTrip({ ...newTrip, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description (Optional)</label>
                  <input
                    type="text"
                    value={newTrip.description}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, description: e.target.value })
                    }
                    placeholder="e.g., Client visit, Training"
                  />
                </div>
                <button className="add-trip-btn" onClick={handleAddTrip}>
                  Add Field Trip
                </button>
              </div>

              <div className="field-trips-list">
                <h3>Scheduled Field Trips</h3>
                {fieldTrips.length === 0 ? (
                  <p className="no-trips">No field trips scheduled</p>
                ) : (
                  fieldTrips.map((trip, index) => (
                    <div key={index} className="trip-item">
                      <div className="trip-info">
                        <span className="trip-dates">
                          {new Date(trip.startDate).toLocaleDateString()} -{" "}
                          {new Date(trip.endDate).toLocaleDateString()}
                        </span>
                        {trip.description && (
                          <span className="trip-description">
                            {trip.description}
                          </span>
                        )}
                      </div>
                      <button
                        className="remove-trip-btn"
                        onClick={() => handleRemoveTrip(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={onClose}>
                  Cancel
                </button>
                <button className="save-btn" onClick={handleSave}>
                  Save Field Trips
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
