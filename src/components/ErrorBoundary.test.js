import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

function Bomb() {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('shows the children when nothing crashes', () => {
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  test('shows the crash page with two buttons when a child crashes', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to home/i })).toBeInTheDocument();
  });

  test('only replaces what is inside the boundary', () => {
    render(
      <div>
        <p>Outside</p>
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>
      </div>
    );
    expect(screen.getByText('Outside')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
