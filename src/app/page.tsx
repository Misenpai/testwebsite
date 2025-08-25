'use client';

import { useState, useEffect, useCallback } from 'react';
import FiltersSection from './components/FiltersSection';
import StatsGrid from './components/StatsGrid';
import AttendanceTable from './components/AttendanceTable';
import Modal from './components/Modal';
import type { ApiResponse, Filters, User } from './types';
import './globals.css';
import * as XLSX from 'xlsx';

export default function AttendanceDashboard(): React.JSX.Element {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [modalData, setModalData] = useState<User | null>(null);
  const [filters, setFilters] = useState<Filters>({
    month: new Date().getMonth() + 1,
    year: 2025,
    apiBase: 'http://10.150.9.98:3000/api'
  });

  const loadData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `${filters.apiBase}/admin/users-attendance?month=${filters.month}&year=${filters.year}`
      );
      const result: ApiResponse = await response.json();

      if (result.success) {
        setData(result);
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      setError('Error connecting to server: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters.apiBase, filters.month, filters.year]);

  const handleLocationTypeChange = async (
    empCode: string, 
    newType: 'APPROX' | 'ABSOLUTE' | 'FIELDTRIP'
  ): Promise<void> => {
    try {
      const requestBody: {
        empCode: string;
        locationType: 'APPROX' | 'ABSOLUTE' | 'FIELDTRIP';
        fieldTripDates?: string[];
      } = {
        empCode,
        locationType: newType
      };

      // If changing to FIELDTRIP, include empty field trips array
      if (newType === 'FIELDTRIP') {
        requestBody.fieldTripDates = [];
      }

      const response = await fetch(`${filters.apiBase}/user-location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        // Update local state
        if (data) {
          const updatedData = {
            ...data,
            data: data.data.map(user => 
              user.empCode === empCode ? { ...user, locationType: newType } : user
            )
          };
          setData(updatedData);
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to update location type:', errorData);
        alert('Failed to update location type: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating location type:', err);
      alert('Error updating location type: ' + (err as Error).message);
    }
  };

  const handleDownloadExcel = (user: User): void => {
    // Prepare data for Excel
    const excelData = user.attendances.map(att => ({
      'Date': new Date(att.date).toLocaleDateString(),
      'Check-in Time': new Date(att.checkInTime).toLocaleTimeString(),
      'Check-out Time': att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString() : 'Not checked out',
      'Session Type': att.sessionType,
      'Attendance Type': att.attendanceType || 'Pending',
      'Status': att.isCheckedOut ? 'Completed' : 'In Progress',
      'Location': att.location || 'Not specified',
      'Photos': att.photos.length,
      'Audio': att.audio.length > 0 ? 'Yes' : 'No'
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    
    // Add user info sheet
    const userInfo = [
      ['Employee Code', user.empCode],
      ['Username', user.username],
      ['Email', user.email],
      ['Department', user.department],
      ['Location Type', user.locationType],
      ['Status', user.isActive ? 'Active' : 'Inactive'],
      ['Total Days', user.monthlyStatistics.totalDays],
      ['Full Days', user.monthlyStatistics.fullDays],
      ['Half Days', user.monthlyStatistics.halfDays]
    ];
    const wsInfo = XLSX.utils.aoa_to_sheet(userInfo);
    XLSX.utils.book_append_sheet(wb, wsInfo, 'User Info');
    
    // Download file
    XLSX.writeFile(wb, `${user.username}_attendance_${filters.month}_${filters.year}.xlsx`);
  };

  const handleFilterChange = (newFilters: Filters): void => {
    setFilters(newFilters);
  };

  const handleViewDetails = (user: User): void => {
    setModalData(user);
  };

  const closeModal = (): void => {
    setModalData(null);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="container">
      <header>
        <h1>Attendance Dashboard</h1>
        <p className="subtitle">Monitor and manage employee attendance records</p>
      </header>

      <FiltersSection 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onLoadData={loadData}
      />

      <StatsGrid data={data} />

      <AttendanceTable 
        data={data}
        loading={loading}
        error={error}
        onViewDetails={handleViewDetails}
        updateLocationType={handleLocationTypeChange}
        onDownloadExcel={handleDownloadExcel}
        apiBase={filters.apiBase}
      />

      {modalData && (
        <Modal 
          user={modalData} 
          onClose={closeModal}
        />
      )}
    </div>
  );
}