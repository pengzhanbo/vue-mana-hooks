import { useStorage } from '../useStorage'
import type { UseStorageOptions } from '../useStorage'
import type { MaybeComputedRef, RemovableRef } from '../utils'

export function useSessionStorage(
  key: string,
  defaults: MaybeComputedRef<string>,
  options?: UseStorageOptions<string>,
): RemovableRef<string>
export function useSessionStorage(
  key: string,
  defaults: MaybeComputedRef<number>,
  options?: UseStorageOptions<number>,
): RemovableRef<number>
export function useSessionStorage(
  key: string,
  defaults: MaybeComputedRef<boolean>,
  options?: UseStorageOptions<boolean>,
): RemovableRef<boolean>
export function useSessionStorage<T>(
  key: string,
  defaults: MaybeComputedRef<T>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>
export function useSessionStorage<T = unknown>(
  key: string,
  defaults: MaybeComputedRef<null>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>

/**
 * sessionStorage
 * @param key
 * @param defaults
 * @param options
 * @returns
 */
export function useSessionStorage<
  T extends string | number | boolean | object | null,
>(
  key: string,
  defaults: MaybeComputedRef<T>,
  options: UseStorageOptions<T> = {},
): RemovableRef<T> {
  return useStorage(key, defaults, window.sessionStorage, options)
}
