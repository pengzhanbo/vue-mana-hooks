import type { ToRefs } from 'vue'
import { toRefs as _toRefs, customRef, isRef } from 'vue'
import type { MaybeRef } from '../utils'

/**
 * extended `toRefs` that also accepts refs of an object
 * @param objRef
 */
export function toRefs<T extends object>(objRef: MaybeRef<T>): ToRefs<T> {
  if (!isRef(objRef)) return _toRefs(objRef)

  const result: any = Array.isArray(objRef.value)
    ? new Array(objRef.value.length)
    : {}

  for (const key in objRef.value) {
    result[key] = customRef<T[typeof key]>(() => ({
      get() {
        return objRef.value[key]
      },
      set(v) {
        if (Array.isArray(objRef.value)) {
          const copy: any = [...objRef.value]
          copy[key] = v
          objRef.value = copy
        } else {
          const newObj = { ...objRef.value, [key]: v }
          Object.setPrototypeOf(newObj, objRef.value)
          objRef.value = newObj
        }
      },
    }))
  }

  return result
}
