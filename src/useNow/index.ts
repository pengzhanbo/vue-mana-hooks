import type { Ref } from 'vue'
import { ref } from 'vue'
import { useIntervalFn } from '../useIntervalFn'
import { useRafFn } from '../useRafFn'
import type { Pauseable } from '../utils'

export interface UseNowOptions {
  /**
   * @default false
   */
  controls?: boolean

  /**
   * @default requestAnimationFrame
   */
  interval?: 'requestAnimationFrame' | number
}

/**
 * get current Date
 * @param options
 */
export function useNow(options: UseNowOptions): Ref<Date>
export function useNow(options: UseNowOptions): { now: Ref<Date> } & Pauseable
export function useNow(options: UseNowOptions = {}) {
  const {
    controls: exportControls = false,
    interval = 'requestAnimationFrame',
  } = options

  const now = ref(new Date())

  const update = () => (now.value = new Date())

  const controls: Pauseable =
    interval === 'requestAnimationFrame'
      ? useRafFn(update, { immediate: true })
      : useIntervalFn(update, interval, { immediate: true })

  if (exportControls) {
    return {
      now,
      ...controls,
    }
  } else {
    return now
  }
}
