import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { JobsView } from '../JobsView';

describe('JobsView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.hash = '#/jobs';
  });

  afterEach(() => {
    window.location.hash = '';
  });

  it('renders JobsView with title, search bar, and filter controls', () => {
    render(<JobsView />);

    expect(screen.getByRole('heading', { name: /Jobs/i })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /Search jobs/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Filter by status/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Filter by trade/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Sort jobs/i })).toBeInTheDocument();
  });

  it('filters jobs by search query matching customer name or trade', () => {
    render(<JobsView />);

    const searchInput = screen.getByRole('searchbox', { name: /Search jobs/i });
    fireEvent.change(searchInput, { target: { value: 'Ada N.' } });

    // Ada N. is customer for OWO-1002
    expect(screen.getByText('OWO-1002')).toBeInTheDocument();
    expect(screen.queryByText('OWO-1001')).not.toBeInTheDocument();
  });

  it('filters jobs by status', () => {
    render(<JobsView />);

    const statusSelect = screen.getByRole('combobox', { name: /Filter by status/i });
    fireEvent.change(statusSelect, { target: { value: 'Disputed' } });

    // Should only show disputed jobs
    const cards = screen.getAllByRole('listitem');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((card) => {
      expect(card).toHaveTextContent('Disputed');
    });
  });

  it('filters jobs by trade specialization', () => {
    render(<JobsView />);

    const tradeSelect = screen.getByRole('combobox', { name: /Filter by trade/i });
    fireEvent.change(tradeSelect, { target: { value: 'Welding' } });

    const cards = screen.getAllByRole('listitem');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((card) => {
      expect(card).toHaveTextContent('Welding');
    });
  });

  it('sorts jobs by amount descending and ascending', () => {
    render(<JobsView />);

    const sortSelect = screen.getByRole('combobox', { name: /Sort jobs/i });

    // Sort High to Low
    fireEvent.change(sortSelect, { target: { value: 'amount-desc' } });
    const highCards = screen.getAllByRole('listitem');
    expect(highCards[0]).toHaveTextContent('OWO-1012'); // 2,100 XLM is highest masonry job

    // Sort Low to High
    fireEvent.change(sortSelect, { target: { value: 'amount-asc' } });
    const lowCards = screen.getAllByRole('listitem');
    expect(lowCards[0]).toHaveTextContent('OWO-1013'); // 220 XLM is lowest general job
  });

  it('handles pagination correctly when job list exceeds page size', () => {
    render(<JobsView />);

    // Total jobs in mock data is 25, default page size is 10
    expect(screen.getByText(/Showing 1–10 of 25 jobs/i)).toBeInTheDocument();

    // Click Next page button
    const nextButton = screen.getByRole('button', { name: /Next page/i });
    fireEvent.click(nextButton);

    expect(screen.getByText(/Showing 11–20 of 25 jobs/i)).toBeInTheDocument();

    // Click Page 3
    const page3Button = screen.getByRole('button', { name: /Page 3/i });
    fireEvent.click(page3Button);

    expect(screen.getByText(/Showing 21–25 of 25 jobs/i)).toBeInTheDocument();
  });

  it('displays empty state and allows resetting filters', () => {
    render(<JobsView />);

    const searchInput = screen.getByRole('searchbox', { name: /Search jobs/i });
    fireEvent.change(searchInput, { target: { value: 'NonexistentJobQuery123456' } });

    expect(screen.getByText(/No jobs found/i)).toBeInTheDocument();
    const resetButtons = screen.getAllByRole('button', { name: /Reset all filters/i });
    expect(resetButtons.length).toBeGreaterThanOrEqual(1);

    // Click Reset
    fireEvent.click(resetButtons[0]);

    expect(screen.queryByText(/No jobs found/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Showing 1–10 of 25 jobs/i)).toBeInTheDocument();
  });
});
