import type { ComputedRef, Ref } from 'vue'

export interface Pauseable {
  isActive: Ref<boolean>
  resume: () => void
  pause: () => void
}

export interface Stoppable {
  isPending: Ref<boolean>
  start: (...arg: unknown[]) => void
  stop: () => void
}

export interface StorageLike {
  setItem: (key: string, value: string) => void
  getItem: (key: string) => string | null
  removeItem: (key: string) => void
}

export type MaybeRef<T> = T | Ref<T>

export type MaybeReadonlyRef<T> = T | ComputedRef<T>

export type MaybeComputedRef<T> = MaybeReadonlyRef<T> | MaybeRef<T>

export type RemovableRef<T> = Omit<Ref<T>, 'value'> & {
  get value(): T
  set value(value: T | null | undefined)
}
