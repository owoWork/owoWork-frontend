import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MetricCard } from '../MetricCard';
import { ShieldCheck } from 'lucide-react';

describe('MetricCard', () => {
  it('renders with all props', () => {
    render(
      <MetricCard
        icon={<ShieldCheck data-testid="test-icon" />}
        label="Total Escrow Volume"
        value="1000 XLM"
        subtext="Total XLM currently locked in escrow"
        variant="accent"
      />
    );

    expect(screen.getByText('Total Escrow Volume')).toBeInTheDocument();
    expect(screen.getByText('1000 XLM')).toBeInTheDocument();
    expect(screen.getByText('Total XLM currently locked in escrow')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders without subtext', () => {
    render(
      <MetricCard
        icon={<ShieldCheck />}
        label="Active Jobs"
        value={5}
      />
    );

    expect(screen.queryByRole('small')).not.toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    const { container, rerender } = render(
      <MetricCard
        icon={<ShieldCheck />}
        label="Test"
        value="Test"
        variant="danger"
      />
    );

    expect(container.firstChild).toHaveClass('metric-card--danger');

    rerender(
      <MetricCard
        icon={<ShieldCheck />}
        label="Test"
        value="Test"
        variant="warn"
      />
    );

    expect(container.firstChild).toHaveClass('metric-card--warn');
  });
});
