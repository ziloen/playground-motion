import { useMemoizedFn } from 'ahooks'
import { BasicTarget, getTargetElement } from 'ahooks/lib/utils/domTarget'
import useIsomorphicLayoutEffectWithTarget from 'ahooks/lib/utils/useIsomorphicLayoutEffectWithTarget'

export function useResizeObserver(target: BasicTarget, callback: ResizeObserverCallback, options?: ResizeObserverOptions) {
  const callbackRef = useMemoizedFn(callback)

  useIsomorphicLayoutEffectWithTarget(() => {
    const el = getTargetElement(target)
    if (!el) return

    const observer = new ResizeObserver(callbackRef)
    observer.observe(el, options)

    return () => observer.disconnect()
  }, [], target)
}