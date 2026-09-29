import { renderHook, act } from '@testing-library/react';
import useOnlineStatus from './useOnlineStatus';

describe('useOnlineStatus', () => {
  test('starts as online', () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
  });

  test('turns false when the browser goes offline and true when it comes back', () => {
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
