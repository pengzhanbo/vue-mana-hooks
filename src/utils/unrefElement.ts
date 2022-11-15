import type { ComponentPublicInstance } from 'vue'
import { resolveUnref } from './resolveUnref'
import type { MaybeComputedRef, MaybeRef } from './types'

export type MaybeElement =
  | HTMLElement
  | SVGElement
  | ComponentPublicInstance
  | undefined
  | null

export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>
export type MaybeComputedElementRef<T extends MaybeElement = MaybeElement> =
  MaybeComputedRef<T>

export type UnRefElementReturn<T extends MaybeElement = MaybeElement> =
  T extends ComponentPublicInstance
    ? Exclude<MaybeElement, ComponentPublicInstance>
    : T | undefined

export function unrefElement<T extends MaybeElement>(
  elRef: MaybeComputedElementRef<T>
): UnRefElementReturn<T> {
  const plain = resolveUnref(elRef)
  return (plain as ComponentPublicInstance).$el ?? plain
}
