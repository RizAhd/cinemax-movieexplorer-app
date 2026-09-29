import { renderHook, act } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

const isText = (value) => typeof value === 'string';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('starts with the initial value', () => {
    const { result } = renderHook(() => useLocalStorage('color', 'red'));
    expect(result.current[0]).toBe('red');
  });

  test('reads a saved value', () => {
    localStorage.setItem('color', JSON.stringify('blue'));
    const { result } = renderHook(() => useLocalStorage('color', 'red'));
    expect(result.current[0]).toBe('blue');
  });

  test('saves a new value', () => {
    const { result } = renderHook(() => useLocalStorage('color', 'red'));

    act(() => {
      result.current[1]('green');
    });

    expect(result.current[0]).toBe('green');
    expect(localStorage.getItem('color')).toBe(JSON.stringify('green'));
  });

  test('broken JSON falls back to the initial value', () => {
    localStorage.setItem('color', '{oops');
    const { result } = renderHook(() => useLocalStorage('color', 'red'));
    expect(result.current[0]).toBe('red');
  });

  test('a value that fails the check is ignored', () => {
    localStorage.setItem('color', JSON.stringify(42));
    const { result } = renderHook(() => useLocalStorage('color', 'red', isText));
    expect(result.current[0]).toBe('red');
  });

  test('a value that passes the check is kept', () => {
    localStorage.setItem('color', JSON.stringify('blue'));
    const { result } = renderHook(() => useLocalStorage('color', 'red', isText));
    expect(result.current[0]).toBe('blue');
  });
});
