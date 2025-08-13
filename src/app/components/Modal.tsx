'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import type { User, Photo, Audio } from '../types';

interface ModalProps {
  user: User;
  onClose: () => void;
}

export default function Modal({ user, onClose }: ModalProps): React.JSX.Element {
  const [searchDate, setSearchDate] = useState<string>('');
  const [filteredAttendances, setFilteredAttendances] = useState(user.attendances);

  useEffect(() => {
    if (searchDate) {
      const filtered = user.attendances.filter(att => {
        const attDate = new Date(att.date).toISOString().split('T')[0];
        return attDate === searchDate;
      });
      setFilteredAttendances(filtered);
    } else {
      setFilteredAttendances(user.attendances);
    }
  }, [searchDate, user.attendances]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if ((e.target as HTMLElement).classList.contains('modal')) {
      onClose();
    }
  };

  const modalBodyStyle: React.CSSProperties = {
    marginBottom: '20px'
  };

  return (
    <div className="modal active" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{user.username} - Attendance Details</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div style={modalBodyStyle}>
            <strong>Employee ID:</strong> {user.empId}<br />
            <strong>Email:</strong> {user.email}<br />
            <strong>Department:</strong> {user.department}<br />
            <strong>Location Type:</strong> {user.locationType}<br />
          </div>
          
          <h3>Attendance Records</h3>
          
          <div className="search-container">
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              placeholder="Search by date..."
              className="date-search"
            />
            {searchDate && (
              <button 
                className="clear-search-btn"
                onClick={() => setSearchDate('')}
              >
                Clear
              </button>
            )}
          </div>
          
          {filteredAttendances.length === 0 ? (
            <p>No attendance records found {searchDate ? 'for selected date' : 'for this month'}</p>
          ) : (
            filteredAttendances.map((att, index: number) => {
              const date = new Date(att.date);
              const checkIn = new Date(att.checkInTime);
              
              return (
                <div key={index} className="attendance-item">
                  <div className="attendance-date">
                    {date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="attendance-details">
                    <div><strong>Check-in:</strong> {checkIn.toLocaleTimeString()}</div>
                    <div><strong>Location:</strong> {att.location || 'Not specified'}</div>
                  </div>
                  <div className="media-links">
                    {att.photos.map((p: Photo, i: number) => (
                      <a 
                        key={i}
                        href={p.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="media-link"
                      >
                        📷 Photo {i + 1} ({p.type || 'unknown'})
                      </a>
                    ))}
                    {att.audio.map((a: Audio, i: number) => (
                      <a 
                        key={i}
                        href={a.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="media-link"
                      >
                        🎵 Audio ({a.duration ? a.duration + 's' : 'unknown'})
                      </a>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}