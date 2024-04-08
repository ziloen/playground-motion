import type { BasicTarget } from 'ahooks/lib/utils/domTarget'
import { useResizeObserver } from './useResizeObserver'

/** ahooks 的 useSize 只能返回整数 [issue](https://github.com/alibaba/hooks/issues/1302)，可能会导致精度问题 */
export function useElementSize(target: BasicTarget, options: ResizeObserverOptions = {}) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useResizeObserver(
    target,
    ([entry]) => {
      if (!entry) return
      const { box = 'content-box' } = options
      const boxSize =
        box === 'border-box'
          ? entry.borderBoxSize
          : box === 'content-box'
            ? entry.contentBoxSize
            : entry.devicePixelContentBoxSize

      if (boxSize) {
        const formatBoxSize = Array.isArray(boxSize) ? boxSize : [boxSize]
        setSize({
          width: formatBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0),
          height: formatBoxSize.reduce((acc, { blockSize }) => acc + blockSize, 0),
        })
      } else {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    },
    options
  )

  return size
}
