'use client';

import { useState, useEffect, useCallback } from 'react';
import FiltersSection from './components/FiltersSection';
import StatsGrid from './components/StatsGrid';
import AttendanceTable from './components/AttendanceTable';
import Modal from './components/Modal';
import type { ApiResponse, Filters, User } from './types';
import './globals.css';

export default function AttendanceDashboard(): React.JSX.Element {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [modalData, setModalData] = useState<User | null>(null);
  const [filters, setFilters] = useState<Filters>({
    month: new Date().getMonth() + 1,
    year: 2025,
    apiBase: 'http://10.150.8.198:3000/api'
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
        <h1>📊 Attendance Dashboard</h1>
        <p className="subtitle">View and manage employee attendance records</p>
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