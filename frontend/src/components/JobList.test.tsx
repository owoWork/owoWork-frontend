import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JobList } from './JobList';
import { Job } from './JobRow';

const mockJobs: Job[] = [
  {
    id: 'OWO-1',
    customer: 'John Doe',
    artisan: 'Jane Smith',
    trade: 'Plumbing',
    state: 'Active',
    amount: 250,
    started: '10:00',
    location: 'New York',
    hash: 'abc123'
  },
  {
    id: 'OWO-2',
    customer: 'Bob Wilson',
    artisan: 'Alice Brown',
    trade: 'Electrical',
    state: 'Open',
    amount: 300,
    started: '11:00',
    location: 'Los Angeles',
    hash: 'def456'
  }
];

describe('JobList', () => {
  it('renders list of jobs when not loading', () => {
    render(<JobList jobs={mockJobs} loading={false} />);
    
    expect(screen.getByRole('list')).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    expect(screen.getByText('OWO-1')).toBeInTheDocument();
    expect(screen.getByText('OWO-2')).toBeInTheDocument();
  });

  it('renders loading skeletons when loading', () => {
    render(<JobList jobs={[]} loading={true} />);
    
    expect(screen.getByRole('list')).toHaveAttribute('aria-busy', 'true');
  });

  it('renders empty list when no jobs and not loading', () => {
    render(<JobList jobs={[]} loading={false} />);
    
    const list = screen.getByRole('list');
    expect(list.children).toHaveLength(0);
  });
});
