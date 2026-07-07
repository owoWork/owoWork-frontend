import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JobRow, Job } from './JobRow';

const mockJob: Job = {
  id: 'OWO-1234',
  customer: 'John Doe',
  artisan: 'Jane Smith',
  trade: 'Plumbing',
  state: 'Active',
  amount: 250,
  started: '10:00',
  location: 'New York',
  hash: 'abc123'
};

describe('JobRow', () => {
  it('renders job details correctly', () => {
    render(<JobRow job={mockJob} />);
    
    expect(screen.getByText('OWO-1234')).toBeInTheDocument();
    expect(screen.getByText('John Doe to Jane Smith - New York')).toBeInTheDocument();
    expect(screen.getByText('sha:abc123')).toBeInTheDocument();
    expect(screen.getByText('$250')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders different job states correctly', () => {
    const states: Job['state'][] = ['Open', 'Completed', 'Disputed', 'Refunded'];
    
    states.forEach(state => {
      const jobWithState = { ...mockJob, state };
      const { unmount } = render(<JobRow job={jobWithState} />);
      expect(screen.getByText(state)).toBeInTheDocument();
      unmount();
    });
  });

  it('has correct accessibility attributes', () => {
    render(<JobRow job={mockJob} />);
    
    const statePill = screen.getByText('Active');
    expect(statePill).toHaveAttribute('role', 'status');
    expect(statePill).toHaveAttribute('aria-label', 'Job status: Active');
  });
});
