import { useMutationObserver } from '@vue-mana-hooks/useMutationObserver'
import type { MaybeComputedRef } from '@vue-mana-hooks/utils'
import { isFunction, resolveRef } from '@vue-mana-hooks/utils'
import type { WritableComputedRef } from 'vue'
import { watch } from 'vue'

export interface UseTitleOptions {
  observer?: boolean
}
export function useTitle(
  initialTitle: MaybeComputedRef<string | null | undefined> = null,
  options: UseTitleOptions = {}
) {
  const title: WritableComputedRef<string | null | undefined> =
    resolveRef(initialTitle)
  const isReadOnly = isFunction(initialTitle)

  watch(
    title,
    (t, o) => {
      if (t !== o) {
        document.title = t ?? ''
      }
    },
    { immediate: true }
  )

  if (options.observer && !isReadOnly) {
    useMutationObserver(
      document.head?.querySelector('title'),
      () => {
        if (document.title !== title.value) {
          title.value = document.title
        }
      },
      { childList: true }
    )
  }

  return title
}
