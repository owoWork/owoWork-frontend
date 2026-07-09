import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary, NotFoundPage, ServerErrorPage } from '../ErrorBoundary';

const ThrowError: React.FC = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="test-child">Hello World</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders fallback UI when there is an error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
    consoleError.mockRestore();
  });

  it('renders custom fallback when provided', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom error</div>}>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    consoleError.mockRestore();
  });

  it.skip('resets error state when "Try again" is clicked', () => {
    // TODO: Fix this test
  });
});

describe('NotFoundPage', () => {
  it('renders correctly', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });
});

describe('ServerErrorPage', () => {
  it('renders correctly', () => {
    render(<ServerErrorPage />);
    expect(screen.getByText('500 - Server Error')).toBeInTheDocument();
  });
});
