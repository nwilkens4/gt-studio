import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCarStore } from './useCarStore'

describe('useCarStore', () => {
  beforeEach(() => {
    useCarStore.setState(useCarStore.getInitialState())
  })

  it('initializes all indices to 0', () => {
    const { result } = renderHook(() => useCarStore())
    expect(result.current.paint.index).toBe(0)
    expect(result.current.rims.index).toBe(0)
    expect(result.current.bodyKit.index).toBe(0)
    expect(result.current.decals.index).toBe(0)
    expect(result.current.environment.index).toBe(0)
    expect(result.current.weather.index).toBe(0)
    expect(result.current.camera.index).toBe(0)
  })

  it('cycles forward through paint options', () => {
    const { result } = renderHook(() => useCarStore())
    act(() => result.current.next('paint', 8))
    expect(result.current.paint.index).toBe(1)
  })

  it('wraps forward past the last option', () => {
    const { result } = renderHook(() => useCarStore())
    act(() => {
      useCarStore.setState({ paint: { index: 7 } })
      result.current.next('paint', 8)
    })
    expect(result.current.paint.index).toBe(0)
  })

  it('cycles backward through paint options', () => {
    const { result } = renderHook(() => useCarStore())
    act(() => {
      useCarStore.setState({ paint: { index: 3 } })
      result.current.prev('paint', 8)
    })
    expect(result.current.paint.index).toBe(2)
  })

  it('wraps backward past the first option', () => {
    const { result } = renderHook(() => useCarStore())
    act(() => result.current.prev('paint', 8))
    expect(result.current.paint.index).toBe(7)
  })

  it('resets all indices to 0', () => {
    const { result } = renderHook(() => useCarStore())
    act(() => {
      useCarStore.setState({ paint: { index: 3 }, rims: { index: 2 } })
      result.current.reset()
    })
    expect(result.current.paint.index).toBe(0)
    expect(result.current.rims.index).toBe(0)
  })
})
