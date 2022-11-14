import { tryOnScopeDispose } from '@vue-mana-hooks/utils'
import { ref, watch } from 'vue'

export function useMutationObserver(
  target: Element,
  callback: MutationCallback,
  options: MutationObserverInit = {}
) {
  let observer: MutationObserver | undefined
  const isSupported = ref('MutationObserver' in window)

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const stopWatch = watch(
    () => target,
    (el) => {
      cleanup()
      if (isSupported.value && el) {
        observer = new MutationObserver(callback)
        observer.observe(el, options)
      }
    },
    { immediate: true }
  )

  const stop = () => {
    cleanup()
    stopWatch()
  }

  tryOnScopeDispose(stop)

  return {
    isSupported,
    stop,
  }
}
