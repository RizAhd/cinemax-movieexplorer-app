import { renderHook, act } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  // Start every test with an empty localStorage
  beforeEach(() => {
    localStorage.clear();
  });

  test('uses the starting value when nothing is saved', () => {
    const { result } = renderHook(() => useLocalStorage('color', 'red'));
    expect(result.current[0]).toBe('red');
  });

  test('uses the saved value when there is one', () => {
    localStorage.setItem('color', JSON.stringify('blue'));
    const { result } = renderHook(() => useLocalStorage('color', 'red'));
    expect(result.current[0]).toBe('blue');
  });

  test('saves a new value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('color', 'red'));

    act(() => {
      result.current[1]('green');
    });

    expect(result.current[0]).toBe('green');
    expect(localStorage.getItem('color')).toBe(JSON.stringify('green'));
  });

  test('uses the starting value when the saved text is broken (not valid JSON)', () => {
    localStorage.setItem('color', '{oops');
    const { result } = renderHook(() => useLocalStorage('color', 'red'));
    expect(result.current[0]).toBe('red');
  });

  test('ignores a saved value that fails the check function', () => {
    // Somebody saved a number, but we only accept text
    localStorage.setItem('color', JSON.stringify(42));
    const isText = (value) => typeof value === 'string';

    const { result } = renderHook(() => useLocalStorage('color', 'red', isText));
    expect(result.current[0]).toBe('red');
  });

  test('keeps a saved value that passes the check function', () => {
    localStorage.setItem('color', JSON.stringify('blue'));
    const isText = (value) => typeof value === 'string';

    const { result } = renderHook(() => useLocalStorage('color', 'red', isText));
    expect(result.current[0]).toBe('blue');
  });
});
