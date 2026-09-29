import { renderHook, act } from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns the first value at once', () => {
    const { result } = renderHook(() => useDebounce('batman', 500));
    expect(result.current).toBe('batman');
  });

  test('keeps the old value until the delay has passed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'bat' },
    });

    rerender({ value: 'batman' });

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current).toBe('bat');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('batman');
  });

  test('only the last value counts while typing', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'b' },
    });

    rerender({ value: 'ba' });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    rerender({ value: 'bat' });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    rerender({ value: 'batm' });
    expect(result.current).toBe('b');

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('batm');
  });
});
