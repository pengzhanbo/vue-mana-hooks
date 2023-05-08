import type { UnwrapRef } from 'vue'
import { computed, getCurrentInstance, ref, watch } from 'vue'
import { cloneJson, isDef, isFunction } from '../utils'

export interface UseVModelOptions<T> {
  /**
   * @default false
   */
  passive?: boolean

  /**
   * @default undefined
   */
  eventName?: string

  /**
   * @default false
   */
  deep?: boolean

  /**
   * @default undefined
   */
  defaultValue?: T

  /**
   * @default true
   */
  clone?: boolean | ((v: T) => T)
}

/**
 * v-model binding， props + emit -> ref
 * @param props
 * @param key
 * @param emit
 * @param options
 */
export function useVModel<P extends object, K extends keyof P>(
  props: P,
  key?: K,
  emit?: (name: string, ...args: any[]) => void,
  options: UseVModelOptions<P[K]> = {},
) {
  const {
    clone = true,
    passive = false,
    deep = false,
    eventName,
    defaultValue,
  } = options

  const vm = getCurrentInstance()
  const _emit = emit || vm?.emit
  key = key || ('modelValue' as K)
  const event: string = eventName || `update:${key.toString()}`
  const cloneFn = (v: P[K]) =>
    !clone ? v : isFunction(clone) ? clone(v) : cloneJson(v)
  const getValue = () =>
    isDef(props[key!]) ? cloneFn(props[key!]) : defaultValue

  if (passive) {
    const initialValue = getValue()
    const proxy = ref<P[K]>(initialValue!)

    watch(
      () => props[key!],
      (v) => (proxy.value = cloneFn(v) as UnwrapRef<P[K]>),
    )

    watch(
      proxy,
      (v) => {
        if (v !== props[key!] || deep) _emit!(event, v)
      },
      { deep },
    )

    return proxy
  } else {
    return computed<P[K]>({
      get() {
        return getValue()!
      },
      set(v) {
        _emit!(event, v)
      },
    })
  }
}
