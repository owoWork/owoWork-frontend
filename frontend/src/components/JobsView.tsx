import React, { useMemo, useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { mockJobsById } from '../data/mockJobs';
import type { JobDetailModel, JobState } from '../types/jobDetail';
import { JobList } from './JobList';

export type SortField = 'createdAt' | 'updatedAt' | 'amount' | 'status';
export type SortOrder = 'asc' | 'desc';

export const ALL_JOB_STATUSES: JobState[] = [
  'Open',
  'Active',
  'Disputed',
  'Completed',
  'Refunded',
];

export const ALL_TRADES = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Welding',
  'Tiling',
  'Masonry',
  'HVAC',
  'General',
];

export const JobsView: React.FC = () => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobState | 'All'>('All');
  const [tradeFilter, setTradeFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sort States
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const allJobs: JobDetailModel[] = useMemo(() => Object.values(mockJobsById), []);

  // Filter and Sort Pipeline
  const filteredAndSortedJobs = useMemo(() => {
    return allJobs
      .filter((job) => {
        // Search filter: ID, customer, artisan, trade, description
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const target = `${job.id} ${job.customer} ${job.artisan} ${job.trade} ${job.description}`.toLowerCase();
          if (!target.includes(q)) return false;
        }

        // Status filter
        if (statusFilter !== 'All' && job.status !== statusFilter) {
          return false;
        }

        // Trade filter
        if (tradeFilter !== 'All' && job.trade.toLowerCase() !== tradeFilter.toLowerCase()) {
          return false;
        }

        // Date range filter (based on createdAt)
        if (startDate) {
          const jobDate = new Date(job.createdAt).setHours(0, 0, 0, 0);
          const fromDate = new Date(startDate).setHours(0, 0, 0, 0);
          if (jobDate < fromDate) return false;
        }
        if (endDate) {
          const jobDate = new Date(job.createdAt).setHours(23, 59, 59, 999);
          const toDate = new Date(endDate).setHours(23, 59, 59, 999);
          if (jobDate > toDate) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'amount') {
          cmp = a.amount - b.amount;
        } else if (sortField === 'createdAt') {
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortField === 'updatedAt') {
          cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        } else if (sortField === 'status') {
          cmp = a.status.localeCompare(b.status);
        }

        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [allJobs, searchQuery, statusFilter, tradeFilter, startDate, endDate, sortField, sortOrder]);

  // Pagination calculation
  const totalJobs = filteredAndSortedJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalJobs / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedJobs = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredAndSortedJobs.slice(startIdx, startIdx + pageSize);
  }, [filteredAndSortedJobs, safePage, pageSize]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setTradeFilter('All');
    setStartDate('');
    setEndDate('');
    setSortField('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'All' ||
    tradeFilter !== 'All' ||
    startDate !== '' ||
    endDate !== '' ||
    sortField !== 'createdAt' ||
    sortOrder !== 'desc';

  return (
    <div className="job-list-page">
      <header className="artisans-header" style={{ marginBottom: 20 }}>
        <div>
          <p className="eyebrow">Escrow jobs</p>
          <h1>Jobs</h1>
        </div>
      </header>

      {/* Main Filter Controls Bar */}
      <div
        className="jobs-controls-container"
        style={{
          display: 'grid',
          gap: 12,
          padding: 16,
          background: 'rgba(255, 255, 255, 0.6)',
          borderRadius: 12,
          border: '1px solid var(--line)',
        }}
      >
        {/* Row 1: Search Bar & Reset */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="artisans-search-wrap" style={{ flex: '1 1 300px' }}>
            <Search size={16} className="artisans-search-icon" aria-hidden="true" />
            <input
              className="artisans-search"
              type="search"
              placeholder="Search jobs by ID, description, customer, artisan…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Search jobs"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--line)',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--muted)',
              }}
              aria-label="Reset all filters"
            >
              <RotateCcw size={14} />
              Reset filters
            </button>
          )}
        </div>

        {/* Row 2: Filter Selectors (Status, Trade, Date Range, Sort) */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            alignItems: 'center',
            fontSize: 13,
          }}
        >
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <SlidersHorizontal size={14} style={{ color: 'var(--muted)' }} />
            <select
              className="artisans-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as JobState | 'All');
                setCurrentPage(1);
              }}
              aria-label="Filter by status"
            >
              <option value="All">All statuses</option>
              {ALL_JOB_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Trade Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <select
              className="artisans-select"
              value={tradeFilter}
              onChange={(e) => {
                setTradeFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by trade"
            >
              <option value="All">All trades</option>
              {ALL_TRADES.map((trade) => (
                <option key={trade} value={trade}>
                  {trade}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range: From */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={14} style={{ color: 'var(--muted)' }} />
            <span style={{ color: 'var(--muted)', fontWeight: 600 }}>From:</span>
            <input
              type="date"
              className="artisans-select"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter from date"
              style={{ padding: '6px 8px' }}
            />
          </div>

          {/* Date Range: To */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--muted)', fontWeight: 600 }}>To:</span>
            <input
              type="date"
              className="artisans-select"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter to date"
              style={{ padding: '6px 8px' }}
            />
          </div>

          {/* Sort Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
            <ArrowUpDown size={14} style={{ color: 'var(--muted)' }} />
            <select
              className="artisans-select"
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [f, o] = e.target.value.split('-') as [SortField, SortOrder];
                setSortField(f);
                setSortOrder(o);
              }}
              aria-label="Sort jobs"
            >
              <option value="createdAt-desc">Newest first</option>
              <option value="createdAt-asc">Oldest first</option>
              <option value="updatedAt-desc">Recently updated</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
              <option value="status-asc">Status: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header: Total Count & Active Page */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 18,
          marginBottom: 12,
        }}
      >
        <p className="artisans-count" aria-live="polite" style={{ margin: 0 }}>
          {totalJobs === 0
            ? '0 jobs found'
            : `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(
                safePage * pageSize,
                totalJobs
              )} of ${totalJobs} jobs`}
        </p>

        {/* Page Size Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Per page:</span>
          <select
            className="artisans-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            aria-label="Jobs per page"
            style={{ padding: '4px 8px', fontSize: 12 }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Job List Component */}
      <JobList
        jobs={paginatedJobs}
        onResetFilters={handleResetFilters}
        emptyMessage="Try adjusting your search query, status, trade, or date filters."
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          className="jobs-pagination"
          role="navigation"
          aria-label="Jobs pagination"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            marginTop: 24,
            paddingBottom: 24,
          }}
        >
          <button
            type="button"
            className="secondary-btn"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              borderRadius: 6,
              cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
              opacity: safePage <= 1 ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              className={pageNum === safePage ? 'primary-btn' : 'secondary-btn'}
              onClick={() => setCurrentPage(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={pageNum === safePage ? 'page' : undefined}
              style={{
                minWidth: 34,
                height: 34,
                padding: '0 8px',
                borderRadius: 6,
                fontWeight: pageNum === safePage ? 800 : 600,
                cursor: 'pointer',
                background: pageNum === safePage ? 'var(--ink)' : 'transparent',
                color: pageNum === safePage ? '#fff' : 'var(--ink)',
                border: '1px solid var(--line)',
              }}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            className="secondary-btn"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              borderRadius: 6,
              cursor: safePage >= totalPages ? 'not-allowed' : 'pointer',
              opacity: safePage >= totalPages ? 0.5 : 1,
            }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </nav>
      )}
    </div>
  );
};
