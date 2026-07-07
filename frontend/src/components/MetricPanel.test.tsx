import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricPanel } from './MetricPanel';
import { Hammer } from 'lucide-react';

describe('MetricPanel', () => {
  it('renders metric panel with basic props', () => {
    render(
      <MetricPanel 
        icon={<Hammer data-testid="test-icon" />}
        title="Test Metric"
        value={100}
        subtitle="Test Subtitle"
      />
    );
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders loud variant correctly', () => {
    render(
      <MetricPanel 
        icon={<Hammer />}
        title="Test Metric"
        value={100}
        subtitle="Test Subtitle"
        loud
      />
    );
    
    const panel = screen.getByRole('article');
    expect(panel).toHaveClass('loud');
  });

  it('renders icon variants correctly', () => {
    render(
      <MetricPanel 
        icon={<Hammer />}
        title="Test Metric"
        value={100}
        subtitle="Test Subtitle"
        iconVariant="ink"
      />
    );
    
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(
      <MetricPanel 
        icon={<Hammer />}
        title="Active Jobs"
        value={10}
        subtitle="Active jobs count"
      />
    );
    
    const panel = screen.getByRole('article');
    expect(panel).toHaveAttribute('aria-label', 'Active Jobs');
  });
});
