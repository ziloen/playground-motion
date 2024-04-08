import type { CSSProperties, PropsWithChildren } from 'react'
import { Children, cloneElement, isValidElement } from 'react'
import { useElementSize } from '~/hooks'

type Props = PropsWithChildren<{
  ratio: number
  className?: string
}>

/**
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16 / 9} className="w-200px h-200px">
 *   <img src="" className="" />
 * </AspectRatio>
 * ```
 */
export const AspectRatio = forwardRef<HTMLDivElement, Props>(
  ({ children, ratio, className }: Props, ref) => {
    const containerRef = useRef<HTMLElement | null>(null)
    const { width, height } = useElementSize(containerRef)

    const [w, h] = useMemo(() => {
      if (width === 0 || height === 0) return [0, 0]
      if (width / height > ratio) return [height * ratio, '100%']
      return ['100%', width / ratio]
    }, [width, height, ratio])

    const child = Children.only(children)

    return (
      <div
        ref={el => {
          containerRef.current = el
          if (typeof ref === 'function') ref(el)
          else if (ref) ref.current = el
        }}
        className={className}
      >
        {isValidElement<{ style?: CSSProperties }>(child)
          ? cloneElement(child, {
              style: {
                width: w,
                height: h,
                ...child.props.style,
              },
            })
          : child}
      </div>
    )
  }
)
