import { useStorage } from '../useStorage'
import type { UseStorageOptions } from '../useStorage'
import type { MaybeComputedRef, RemovableRef } from '../utils'
export function useLocalStorage(
  key: string,
  defaults: MaybeComputedRef<string>,
  options?: UseStorageOptions<string>
): RemovableRef<string>
export function useLocalStorage(
  key: string,
  defaults: MaybeComputedRef<number>,
  options?: UseStorageOptions<number>
): RemovableRef<number>
export function useLocalStorage(
  key: string,
  defaults: MaybeComputedRef<boolean>,
  options?: UseStorageOptions<boolean>
): RemovableRef<boolean>
export function useLocalStorage<T>(
  key: string,
  defaults: MaybeComputedRef<T>,
  options?: UseStorageOptions<T>
): RemovableRef<T>
export function useLocalStorage<T = unknown>(
  key: string,
  defaults: MaybeComputedRef<null>,
  options?: UseStorageOptions<T>
): RemovableRef<T>

/**
 * localStorage
 * @param key
 * @param defaults
 * @param options
 * @returns
 */
export function useLocalStorage<
  T extends string | number | boolean | object | null
>(
  key: string,
  defaults: MaybeComputedRef<T>,
  options: UseStorageOptions<T> = {}
): RemovableRef<T> {
  return useStorage(key, defaults, window.localStorage, options)
}
