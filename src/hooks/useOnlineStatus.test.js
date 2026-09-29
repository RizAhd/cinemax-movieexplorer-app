import { renderHook, act } from '@testing-library/react';
import useOnlineStatus from './useOnlineStatus';

describe('useOnlineStatus', () => {
  test('starts online', () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
  });

  test('follows the offline and online events', () => {
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current).toBe(true);
  });
});
