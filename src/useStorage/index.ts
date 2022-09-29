import { ref, shallowRef, watch } from 'vue'
import type { MaybeComputedRef, RemovableRef, StorageLike } from '../utils'
import { isClient, isFunction, resolveUnref } from '../utils'

export interface Serializer<T> {
  read: (value: string) => T
  write: (value: T) => string
}

export interface UseStorageOptions<T> {
  deep?: boolean
  watchStorage?: boolean
  writeDefaults?: boolean
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T)
  shallow?: boolean
  serializer?: Serializer<T>
  onError?: (e: unknown) => void
}

const storageSerializer: Serializer<any> = {
  read: (value: string) => {
    return JSON.parse(value)
  },
  write: (value: any) => {
    return JSON.stringify(value)
  },
}

const onErr = (e: unknown) => console.error(e)

export function useStorage(
  key: string,
  defaults: MaybeComputedRef<string>,
  storage?: StorageLike,
  options?: UseStorageOptions<string>
): RemovableRef<string>
export function useStorage(
  key: string,
  defaults: MaybeComputedRef<number>,
  storage?: StorageLike,
  options?: UseStorageOptions<number>
): RemovableRef<number>
export function useStorage(
  key: string,
  defaults: MaybeComputedRef<boolean>,
  storage?: StorageLike,
  options?: UseStorageOptions<boolean>
): RemovableRef<boolean>
export function useStorage<T>(
  key: string,
  defaults: MaybeComputedRef<T>,
  storage?: StorageLike,
  options?: UseStorageOptions<T>
): RemovableRef<T>
export function useStorage<T = unknown>(
  key: string,
  defaults: MaybeComputedRef<null>,
  storage?: StorageLike,
  options?: UseStorageOptions<T>
): RemovableRef<T>

/**
 * localStorage / sessionStorage
 * @param key
 * @param defaults
 * @param storage
 * @param options
 * @returns
 */
export function useStorage<T extends string | number | boolean | object | null>(
  key: string,
  defaults: MaybeComputedRef<T>,
  storage: StorageLike | undefined,
  options: UseStorageOptions<T> = {}
): RemovableRef<T> {
  const {
    deep = false,
    watchStorage = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow = false,
    serializer = storageSerializer,
    onError = onErr,
  } = options

  const data = (shallow ? shallowRef : ref)(defaults) as RemovableRef<T>

  if (!storage && isClient) storage = window.localStorage

  if (!storage) return data

  const rawInit: T = resolveUnref(defaults)
  const isWatchStorage = ref(false)

  watch(
    data,
    () => {
      if (isWatchStorage.value) write(data.value)
    },
    { flush: 'pre', deep }
  )

  if (isClient && watchStorage)
    window.addEventListener('storage', update, false)

  update()

  return data

  function write(v: any) {
    try {
      if (v === null || v === undefined) storage!.removeItem(key)
      else storage!.setItem(key, serializer.write(v))
    } catch (e) {
      onError(e)
    }
  }

  function read(event?: StorageEvent) {
    if (event && event.key !== key) return
    isWatchStorage.value = false

    try {
      const rawValue = event ? event.newValue : storage!.getItem(key)
      if (rawValue === null || rawValue === undefined) {
        if (writeDefaults && rawInit !== null)
          storage!.setItem(key, serializer.write(rawInit))
        return rawInit
      } else if (!event && mergeDefaults) {
        const value = serializer.read(rawValue)
        if (isFunction(mergeDefaults)) return mergeDefaults(value, rawInit)
        else if (typeof rawInit === 'object' && !Array.isArray(value))
          return { ...rawInit, ...value }
        return value
      } else if (typeof rawValue !== 'string') {
        return rawValue
      } else {
        return serializer.read(rawValue)
      }
    } catch (e) {
      onError(e)
    } finally {
      isWatchStorage.value = true
    }
  }

  function update(event?: StorageEvent) {
    if (event && event.key !== key) return
    data.value = read(event)
  }
}
