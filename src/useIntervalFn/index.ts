import { isRef, ref, watch } from 'vue'
import type { MaybeComputedRef, Pauseable } from '../utils'
import { isClient, resolveUnref, tryOnScopeDispose } from '../utils'

export interface UseIntervalFnOPtions {
  /**
   * 是否立即启动 interval loop
   *
   * @default true
   */
  immediate?: boolean

  /**
   * 启动时，是否立即执行 callback
   * @default false
   */
  immediateCallback?: boolean
}

/**
 * 通过 setInterval 循环调用 function，
 * 可通过 resume() 和 pause() 重启和停止
 * @param fn
 * @param interval
 * @param options
 */
export function useIntervalFn(
  fn: () => void,
  interval: MaybeComputedRef<number> = 1000,
  options: UseIntervalFnOPtions = {},
): Pauseable {
  const { immediate = true, immediateCallback = false } = options

  let timer: ReturnType<typeof setInterval> | null = null
  const isActive = ref(false)
  function clean() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function pause() {
    isActive.value = false
    clean()
  }

  function resume() {
    if (resolveUnref(interval) <= 0) return
    isActive.value = true
    if (immediateCallback) fn()

    clean()
    timer = setInterval(fn, resolveUnref(interval))
  }

  if (immediate && isClient) resume()

  if (isRef(interval)) {
    const stopWatch = watch(interval, () => {
      if (isActive.value && isClient) resume()
    })
    tryOnScopeDispose(stopWatch)
  }

  tryOnScopeDispose(pause)

  return {
    isActive,
    pause,
    resume,
  }
}
