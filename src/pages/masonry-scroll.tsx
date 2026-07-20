import './masonry-scroll.css'

import { useVirtualizer } from '@tanstack/react-virtual'
import { clsx } from 'clsx'
import { clamp } from 'es-toolkit'
import { type RefCallback } from 'react'
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
  const size = IMAGE_SIZES[index % IMAGE_SIZES.length]!
  const colors = IMAGE_COLORS[index % IMAGE_COLORS.length]!
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

  const [selectedImage, setSelectedImage] = useState<{
    index: number
    image: (typeof images)[number]
    lane: number
  } | null>(null)

  const virtualizer = useVirtualizer({
    count: images.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => 200,
    lanes: lanes,
    overscan: 5,
    gap: 8,
    // FIXME: 在非起始滚动位置进行 resize 导致 lanes 变化时，可能会导致 item 的 lane 计算不正确
    // 例如：在 lane = 2 时滚动到最后，拖动窗口大小（lanes 改变），再进行上下滚动，有些列很长，有些列很短
    // 原因是虚拟列表，只有可视区域附近的 item 会被测量并更新
    // 解决办法1：放弃动态宽度，使用固定列宽，这样缓存的高度就不会因为宽度变化而不准确。
    // 解决办法2: 如果 item 的宽高比已知且固定，关闭 tanstack virtual 的 observeElementRect，手动在 resize 时进行 virtualizer.measure()
    laneAssignmentMode: 'measured',
  })

  const observeRef = useRef<RefCallback<HTMLDivElement>>((el) => {
    scrollElementRef.current = el

    if (!el) return

    setLanes(clamp(~~(el.offsetWidth / 180), 2, 6))

    const ro = new ResizeObserver(([entry]) => {
      const width = entry!.borderBoxSize[0]!.inlineSize

      const lanes = clamp(~~(width / 180), 2, 6)
      setLanes(lanes)
    })

    ro.observe(el)

    return () => ro.disconnect()
  }).current

  useEffect(() => {
    virtualizer.measure()
  }, [lanes])

  return (
    <div ref={observeRef} className="h-full overflow-y-auto">
      <div className="py-2 text-2xl">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore,
        laboriosam! Minima quisquam tempora sit. Officiis ipsa sunt dolor quasi
        placeat quo, omnis dignissimos aut reprehenderit natus, vero sint
        accusamus vitae!
      </div>

      <div
        className="flex w-full gap-2 overflow-clip"
        style={{ minHeight: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer
          .getVirtualItems()
          .reduce(
            (acc, v) => {
              const image = images[v.index]!

              const delay = selectedImage
                ? getDelay(
                    v.index,
                    v.lane,
                    selectedImage.index,
                    selectedImage.lane,
                  )
                : 0

              acc[v.lane]!.start = Math.min(acc[v.lane]!.start, v.start)
              acc[v.lane]!.children.push(
                <div
                  key={v.key}
                  data-index={v.index}
                  data-masonry-index={v.index}
                  ref={virtualizer.measureElement}
                  className={clsx(
                    'flex transition-transform duration-400',
                    v.index === selectedImage?.index && 'opacity-0',
                  )}
                  style={{
                    viewTransitionClass: 'masonry-scroll-item',
                    transitionDelay: `${delay}s`,
                    transform:
                      selectedImage === null || v.index === selectedImage.index
                        ? 'translateY(0)'
                        : `translateY(${v.index - selectedImage.index > 0 ? 'calc(100% + 100vh)' : 'calc(-100% - 100vh)'})`,
                  }}
                  onClick={(e) => {
                    const target = e.currentTarget

                    target.style.viewTransitionName = `masonry-scroll-item-${v.index}`

                    document.startViewTransition(() => {
                      flushSync(() => {
                        setSelectedImage({
                          image: image,
                          index: v.index,
                          lane: v.lane,
                        })
                      })

                      target.style.viewTransitionName = ''
                    })
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.label}
                    decoding="async"
                    loading="lazy"
                    className="h-auto w-full object-cover object-center"
                    style={{
                      contentVisibility: 'auto',
                      aspectRatio: `${image.width}/${image.height} auto`,
                    }}
                  />
                </div>,
              )

              return acc
            },
            Array.from({ length: lanes }, () => ({
              start: Number.MAX_SAFE_INTEGER,
              children: [] as React.ReactNode[],
            })),
          )
          .map((v, i) => (
            <div
              key={i}
              className="flex flex-1 shrink-0 flex-col gap-2"
              style={{
                paddingTop: `${v.start}px`,
              }}
            >
              {v.children}
            </div>
          ))}
      </div>

      {selectedImage !== null && (
        <div
          className="@container-size fixed inset-0 grid place-items-center bg-black/50 transition-colors starting:bg-transparent"
          onClick={() => {
            let vtTarget: HTMLDivElement | null = null

            document
              .startViewTransition(() => {
                flushSync(() => {
                  setSelectedImage(null)
                })
                vtTarget = document.querySelector(
                  `[data-masonry-index="${selectedImage.index}"]`,
                )
                if (vtTarget) {
                  vtTarget.style.viewTransitionName = `masonry-scroll-item-${selectedImage.index}`
                }
              })
              .finished.finally(() => {
                if (vtTarget) {
                  vtTarget.style.viewTransitionName = ''
                }
              })
          }}
        >
          <img
            src={selectedImage.image.url}
            decoding="async"
            loading="lazy"
            style={{
              viewTransitionClass: 'masonry-scroll-item',
              viewTransitionName: `masonry-scroll-item-${selectedImage.index}`,
              '--aspect-ratio': `${selectedImage.image.width} / ${selectedImage.image.height}`,
              width: 'min(85cqw, calc(85cqh * var(--aspect-ratio)))',
              height: 'auto',
              aspectRatio: 'var(--aspect-ratio) auto',
            }}
            className="object-contain object-center select-none"
          />
        </div>
      )}
    </div>
  )
}

function getDelay(
  itemIndex: number,
  lane: number,
  centerIndex: number,
  centerLane: number,
) {
  const tMax = 1 // 最大延迟
  const k = 0.5 // 衰减系数
  const weight = 2.5 // 列权重

  const dist =
    Math.abs(itemIndex - centerIndex) + weight * Math.abs(lane - centerLane)

  return tMax * Math.exp(-k * dist)
}
