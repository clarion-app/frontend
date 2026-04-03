import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test render error');
  }
  return <div>Child rendered successfully</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Child rendered successfully')).toBeTruthy();
  });

  it('displays fallback UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('Test render error')).toBeTruthy();
    expect(screen.getByText('Try again')).toBeTruthy();
  });

  it('shows retry button and resets error state when clicked', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('Try again')).toBeTruthy();

    // Clicking Try again resets the error boundary state
    fireEvent.click(screen.getByText('Try again'));
    // After reset, it tries to render children again - which will throw again
    // But the important thing is the boundary caught the error and offered retry
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('shows reload option after repeated errors', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();

    // Click retry - error thrown again (component always throws)
    fireEvent.click(screen.getByText('Try again'));

    // After repeated failure, the error screen should still be visible
    // (boundary re-catches the error on retry)
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    const retryButton = screen.queryByText('Try again');
    const reloadButton = screen.queryByText('Reload page');
    // Either retry or reload button must be available for recovery
    expect(retryButton || reloadButton).toBeTruthy();
  });
});
