import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ToastProvider, useToast } from '../ToastContext';

const TestComponent: React.FC = () => {
  const { addToast, removeToast } = useToast();

  return (
    <div>
      <button
        onClick={() => addToast({ type: 'success', message: 'Test success toast' })}
        data-testid="add-success"
      >
        Add Success
      </button>
      <button
        onClick={() => addToast({ type: 'error', message: 'Test error toast', onRetry: vi.fn() })}
        data-testid="add-error"
      >
        Add Error
      </button>
    </div>
  );
};

describe('ToastContext', () => {
  it('adds and removes a toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByTestId('add-success'));
    expect(screen.getByText('Test success toast')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close toast'));
    expect(screen.queryByText('Test success toast')).not.toBeInTheDocument();
  });

  it('shows retry button when onRetry is provided', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByTestId('add-error'));
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('throws error when useToast is used outside ToastProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');
    
    consoleError.mockRestore();
  });
});
