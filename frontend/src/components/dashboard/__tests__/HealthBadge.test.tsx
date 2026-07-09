import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { HealthBadge } from '../HealthBadge';

describe('HealthBadge', () => {
  it('renders healthy status', () => {
    render(<HealthBadge status="healthy" />);
    expect(screen.getByText('Healthy')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Marketplace health: Healthy');
  });

  it('renders warning status', () => {
    render(<HealthBadge status="warning" />);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('renders critical status', () => {
    render(<HealthBadge status="critical" />);
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });
});
