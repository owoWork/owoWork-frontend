import React from 'react';
import { Briefcase, RotateCcw } from 'lucide-react';
import type { JobDetailModel } from '../types/jobDetail';
import { JobCard } from './JobCard';

export interface JobListProps {
  jobs: JobDetailModel[];
  onJobClick?: (jobId: string) => void;
  emptyMessage?: string;
  onResetFilters?: () => void;
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  onJobClick,
  emptyMessage = 'No jobs found matching your criteria.',
  onResetFilters,
}) => {
  if (jobs.length === 0) {
    return (
      <div
        className="jobs-empty-state"
        style={{
          textAlign: 'center',
          padding: '48px 24px',
          border: '1px dashed var(--line)',
          borderRadius: 12,
          background: 'rgba(255, 255, 255, 0.4)',
          marginTop: 24,
        }}
      >
        <Briefcase size={36} style={{ color: 'var(--muted)', margin: '0 auto 12px' }} />
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No jobs found</h3>
        <p style={{ color: 'var(--muted)', marginBottom: 16 }}>{emptyMessage}</p>
        {onResetFilters && (
          <button
            type="button"
            className="secondary-btn"
            onClick={onResetFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            <RotateCcw size={14} />
            Reset all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="job-list" role="list" aria-label="Jobs list">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onClick={onJobClick} />
      ))}
    </div>
  );
};
