type ImageListItem = {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

// 响应式 Masonry 布局，根据宽度自动调整列数
// 无限滚动加载 + 骨架屏
// 虚拟列表
// 图片懒加载/渐进式加载，视频懒加载 / hover 时流式加载
export default function MasonryScroll() {
  const [images, setImages] = useState<ImageListItem[]>([])

  const scrollElementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('https://picsum.photos/v2/list?page=2&limit=100')
      .then<ImageListItem[]>((res) => res.json())
      .then((data) => setImages(data))
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
          display: 'grid-lanes',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {images.map((image) => (
          <img
            key={image.id}
            src={`https://picsum.photos/id/${image.id}/400/${Math.round(
              (image.height / image.width) * 400,
            )}`}
            alt={image.author}
            decoding="async"
            loading="lazy"
            className="w-full object-cover object-center"
            style={{
              contentVisibility: 'auto',
              aspectRatio: `${image.width}/${image.height} auto`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
