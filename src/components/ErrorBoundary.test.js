import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// A component that always crashes, to test the boundary
function Bomb() {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  let consoleSpy;

  // React and our boundary both write the crash to console.error. We hide it to keep the test output clean.
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('shows the normal content when nothing crashes', () => {
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  test('shows a friendly page with two buttons when a child crashes', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to home/i })).toBeInTheDocument();
  });

  test('only replaces the part that is inside the boundary', () => {
    render(
      <div>
        <p>Outside the boundary</p>
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>
      </div>
    );
    expect(screen.getByText('Outside the boundary')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
