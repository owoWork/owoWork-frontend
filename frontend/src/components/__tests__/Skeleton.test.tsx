import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Skeleton, MetricPanelSkeleton, JobRowSkeleton } from '../Skeleton';

describe('Skeleton Components', () => {
  it('renders basic skeleton with custom class', () => {
    const { container } = render(<Skeleton className="test-class" />);
    expect(container.firstChild).toHaveClass('skeleton', 'test-class');
  });

  it('renders MetricPanelSkeleton', () => {
    const { container } = render(<MetricPanelSkeleton />);
    expect(container.firstChild).toHaveClass('metric-panel');
    expect(container.querySelectorAll('.skeleton')).toHaveLength(4);
  });

  it('renders JobRowSkeleton', () => {
    const { container } = render(<JobRowSkeleton />);
    expect(container.firstChild).toHaveClass('job-row');
  });
});
