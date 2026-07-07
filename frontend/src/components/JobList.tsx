import React from 'react';
import { Job, JobRow } from './JobRow';
import { JobRowSkeleton } from './Skeleton';

interface JobListProps {
  jobs: Job[];
  loading?: boolean;
}

export const JobList: React.FC<JobListProps> = ({ jobs, loading = false }) => {
  return (
    <div className="job-list" role="list" aria-busy={loading}>
      {loading ? (
        <>
          <JobRowSkeleton />
          <JobRowSkeleton />
          <JobRowSkeleton />
          <JobRowSkeleton />
        </>
      ) : (
        jobs.map((job) => (
          <div key={job.id} role="listitem">
            <JobRow job={job} />
          </div>
        ))
      )}
    </div>
  );
};
