import type { ToRefs } from 'vue'
import type { UseVModelOptions } from '../useVModel'
import { useVModel } from '../useVModel'

/**
 * v-model binding.  like toRefs(props)
 * @param props
 * @param emit
 * @param options
 */
export function useVModels<P extends object>(
  props: P,
  emit?: (name: string, ...args: any[]) => void,
  options: UseVModelOptions<any> = {},
): ToRefs<P> {
  const ret: any = {}

  for (const key in props) ret[key] = useVModel(props, key, emit, options)

  return ret
}
