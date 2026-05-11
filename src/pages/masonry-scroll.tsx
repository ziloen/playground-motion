import { useVirtualizer } from '@tanstack/react-virtual'

type ImageListItem = {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

// Masonry
// 响应式：根据可用宽度自动调整列数，有最大和最小列数
// 无限滚动加载 + 骨架屏
// 虚拟列表
// 图片懒加载/渐进式加载，视频懒加载 / hover 时流式加载
export default function MasonryScroll() {
  const [images, setImages] = useState<ImageListItem[]>([])

  const scrollElementRef = useRef<HTMLDivElement>(null)

  const [lanes, setLanes] = useState(3)

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
    fetch('https://picsum.photos/v2/list?page=2&limit=100')
      .then<ImageListItem[]>((res) => res.json())
      .then((data) => setImages(data))

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
          const image = images[v.index]
          const src = `https://picsum.photos/id/${image.id}/400/${Math.round(
            (image.height / image.width) * 400,
          )}`

          return (
            <div
              key={v.key}
              data-index={v.index}
              ref={virtualizer.measureElement}
              className="to-0 absolute flex"
              style={{
                left: `calc(${v.lane} * (100% + ${GAP_X}px) / ${lanes})`,
                width: ITEM_WIDTH,
                transform: `translateY(${v.start}px)`,
                paddingBottom: `${GAP_Y}px`,
              }}
            >
              <img
                src={src}
                alt={image.author}
                decoding="async"
                loading="lazy"
                className="w-full object-cover object-center"
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
    </div>
  )
}
