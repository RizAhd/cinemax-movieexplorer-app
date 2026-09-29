import { renderHook, act } from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce', () => {
  // Fake timers let the test "wait" 500ms without really waiting
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns the first value straight away', () => {
    const { result } = renderHook(() => useDebounce('batman', 500));
    expect(result.current).toBe('batman');
  });

  test('keeps the old value until the delay has passed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'bat' },
    });

    // The user types more letters
    rerender({ value: 'batman' });

    // Not enough time has passed, so we still get the old value
    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current).toBe('bat');

    // Now the full delay has passed
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('batman');
  });

  test('only uses the last value when the user keeps typing', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'b' },
    });

    // Three quick changes, each one before the timer of the last one ends
    rerender({ value: 'ba' });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    rerender({ value: 'bat' });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    rerender({ value: 'batm' });

    // 600ms have passed in total, but each change restarted the timer, so nothing changed yet
    expect(result.current).toBe('b');

    // 500ms after the last change, we get the last value (and never 'ba' or 'bat')
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('batm');
  });
});
