import './masonry-scroll.css'

import { useVirtualizer } from '@tanstack/react-virtual'
import { flushSync } from 'react-dom'

const IMAGE_SIZES = [
  { width: 400, height: 520 },
  { width: 400, height: 300 },
  { width: 400, height: 640 },
  { width: 400, height: 450 },
  { width: 400, height: 360 },
  { width: 400, height: 580 },
  { width: 400, height: 420 },
  { width: 400, height: 700 },
]

const IMAGE_COLORS = [
  { bgColor: '1f2937', textColor: 'f8fafc' },
  { bgColor: '0f766e', textColor: 'ecfeff' },
  { bgColor: '7c2d12', textColor: 'fff7ed' },
  { bgColor: '365314', textColor: 'f7fee7' },
  { bgColor: '831843', textColor: 'fdf2f8' },
  { bgColor: '3730a3', textColor: 'eef2ff' },
]

const IMAGE_LIST = Array.from({ length: 100 }, (_, index) => {
  const size = IMAGE_SIZES[index % IMAGE_SIZES.length]
  const colors = IMAGE_COLORS[index % IMAGE_COLORS.length]
  const id = index + 1

  return {
    id,
    label: `Image ${id}`,
    width: size.width,
    height: size.height,
    bgColor: colors.bgColor,
    textColor: colors.textColor,
    url: `https://dummyjson.com/image/${size.width}x${size.height}/${colors.bgColor}/${colors.textColor}?text=${encodeURIComponent(`Image ${id}`)}`,
  }
})

// Masonry
// 响应式：根据可用宽度自动调整列数，有最大和最小列数
// 无限滚动加载 + 骨架屏
// 虚拟列表
// 图片懒加载/渐进式加载，视频懒加载 / hover 时流式加载
export default function MasonryScroll() {
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const [lanes, setLanes] = useState(3)
  const images = IMAGE_LIST

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  )

  const GAP_X = 8
  const GAP_Y = 8
  const ITEM_WIDTH = `calc((100% - ${(lanes - 1) * GAP_X}px) / ${lanes})`

  const virtualizer = useVirtualizer({
    count: images.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => 200,
    lanes: lanes,
    overscan: 5,
    // FIXME: 在非起始滚动位置进行 resize 导致 lanes 变化时，可能会导致 item 的 lane 计算不正确
    // 例如：滚动到最后，拖动窗口大小（lanes 改变），再进行上下滚动，有些列很长，有些列很短
    // 原因是虚拟列表，只有可视区域附近的 item 会被测量并更新
    // 解决办法1：放弃动态宽度，使用固定列宽，这样缓存的高度就不会因为宽度变化而不准确。
    // 解决办法2: 如果 item 的宽高比已知且固定，关闭 tanstack virtual 的 observeElementRect，手动在 resize 时进行 virtualizer.measure()
    laneAssignmentMode: 'measured',
  })

  useEffect(() => {
    const el = scrollElementRef.current
    if (!el) return

    const ro = new ResizeObserver(([entry]) => {
      const width = entry.borderBoxSize[0].inlineSize

      if (width >= 536) {
        setLanes(3)
      } else {
        setLanes(2)
      }
    })

    ro.observe(el)

    return () => ro.disconnect()
  }, [])

  return (
    <div ref={scrollElementRef} className="h-full overflow-y-auto">
      <div className="py-2 text-2xl">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore,
        laboriosam! Minima quisquam tempora sit. Officiis ipsa sunt dolor quasi
        placeat quo, omnis dignissimos aut reprehenderit natus, vero sint
        accusamus vitae!
      </div>

      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((v) => {
          if (v.index === selectedImageIndex) {
            return null
          }

          const image = images[v.index]

          const yOffset =
            selectedImageIndex === null
              ? 0
              : selectedImageIndex === v.index
                ? 0
                : selectedImageIndex < v.index
                  ? 1000
                  : -1000

          return (
            <div
              key={v.key}
              data-index={v.index}
              ref={virtualizer.measureElement}
              className="to-0 absolute flex"
              style={{
                left: `calc(${v.lane} * (100% + ${GAP_X}px) / ${lanes})`,
                width: ITEM_WIDTH,
                transform: `translateY(${v.start + yOffset}px)`,
                paddingBottom: `${GAP_Y}px`,
                transition:
                  selectedImageIndex === null
                    ? 'none'
                    : 'transform .5s ease-in',
                transitionDelay:
                  selectedImageIndex === null
                    ? '0s'
                    : `${Math.abs(v.index - selectedImageIndex) * 0.05}s`,
                viewTransitionClass: 'masonry-scroll-item',
                // viewTransitionName: `masonry-scroll-item-${v.index}`,
              }}
              onClick={async (e) => {
                e.currentTarget.style.viewTransitionName = `masonry-scroll-item-${v.index}`

                document.startViewTransition(() => {
                  flushSync(() => {
                    setSelectedImageIndex(v.index)
                  })
                })
              }}
            >
              <img
                src={image.url}
                alt={image.label}
                decoding="async"
                loading="lazy"
                className="h-fit w-stretch object-cover object-center"
                style={{
                  contentVisibility: 'auto',
                  aspectRatio: `${image.width}/${image.height} auto`,
                }}
              />

              <div className="absolute top-0 left-0 bg-[canvas] whitespace-pre-wrap">
                {v.index}
              </div>
            </div>
          )
        })}
      </div>

      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 grid place-items-center bg-black/50"
          onClick={() => setSelectedImageIndex(null)}
        >
          <img
            src={images[selectedImageIndex].url}
            style={{
              viewTransitionClass: 'masonry-scroll-item',
              viewTransitionName: `masonry-scroll-item-${selectedImageIndex}`,
            }}
            className="max-h-[min(800px,85%)] max-w-[min(1000px,85%)] object-contain object-center select-none"
          />
        </div>
      )}
    </div>
  )
}
