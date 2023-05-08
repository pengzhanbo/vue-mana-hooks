import { ref } from 'vue'
import { isClient, resolveUnref, tryOnScopeDispose } from '../utils'
import type { MaybeComputedRef, Stoppable } from '../utils'

export interface UseTimeoutFnOptions {
  /**
   * @default true
   */
  immediate?: boolean
}

export function useTimeoutFn(
  fn: (...args: unknown[]) => void,
  interval: MaybeComputedRef<number> = 1000,
  options: UseTimeoutFnOptions = {},
): Stoppable {
  const { immediate = true } = options
  const isPending = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  function clear() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function stop() {
    isPending.value = false
    clear()
  }

  function start(...args: unknown[]) {
    clear()
    isPending.value = true
    timer = setTimeout(() => {
      isPending.value = false
      timer = null
      fn(...args)
    }, resolveUnref(interval))
  }

  if (immediate) {
    isPending.value = true
    if (isClient) start()
  }

  tryOnScopeDispose(stop)

  return {
    isPending,
    start,
    stop,
  }
}
