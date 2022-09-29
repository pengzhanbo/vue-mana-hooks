export const isClient = typeof window !== 'undefined'

export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'

export const isFunction = <T extends Function>(val: any): val is T =>
  typeof val === 'function'

export const hasOwn = <T extends object, K extends keyof T>(
  val: T,
  key: K
): key is K => Object.prototype.hasOwnProperty.call(val, key)
