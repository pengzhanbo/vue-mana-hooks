import { ref } from 'vue'
import { isClient, tryOnScopeDispose } from '../utils'
import type { Pauseable } from '../utils/types'

export interface UseRafFnOptions {
  /**
   * 是否立即启动 requestAnimationFrame loop
   * @default true
   */
  immediate?: boolean
}

/**
 * 通过 requestAnimationFrame 循环调用 function，
 * 可通过 resume() 和 pause() 重启和停止
 *
 * @param fn
 * @param options
 */
export function useRafFn(
  fn: () => void,
  options: UseRafFnOptions = {},
): Pauseable {
  const { immediate = true } = options

  const isActive = ref(false)
  let rafId: number | null = null

  function loop() {
    if (!isActive.value || !isClient) return

    fn()

    rafId = window.requestAnimationFrame(loop)
  }

  function resume() {
    if (!isActive.value && isClient) {
      isActive.value = true
      loop()
    }
  }

  function pause() {
    isActive.value = false
    if (rafId !== null && isClient) {
      window.cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  if (immediate) resume()

  tryOnScopeDispose(pause)

  return {
    isActive,
    resume,
    pause,
  }
}
