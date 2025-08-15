import type { Variants } from 'motion/react'
import { stagger } from 'motion/react'
import type { RefCallback } from 'react'
import type { Post } from '~/api/post'
import { getPostListApi } from '~/api/post'
import { useMemoizedFn } from '~/hooks'
import LineMdLoadingTwotoneLoop from '~icons/line-md/loading-twotone-loop'

const itemVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
}

export default function ScrollLoad() {
  // #region useState, useHookState
  const [list, setList] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  // #endregion

  // #region useRef
  // #endregion

  // #region useMemo
  // #endregion

  // #region functions, useImperativeHandle
  const loadMore = useMemoizedFn(async () => {
    if (isLoading || !hasMore) {
      return
    }

    setIsLoading(true)
    getPostListApi({ page, pageSize: 10 })
      .then((res) => {
        setList((list) => {
          if (res.length < 10) {
            setHasMore(false)
          } else {
            setPage((p) => p + 1)
          }
          return [...list, ...res]
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  })
  // #endregion

  // #region useHookEffect, useEffect
  const observeScrollEnd = useMemoizedFn<RefCallback<HTMLDivElement>>((el) => {
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      {
        root: null,
        rootMargin: '10px',
        threshold: 1,
      },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  })
  // #endregion

  return (
    <div className="max-h-full overflow-y-auto pt-4">
      <motion.div
        className="flex flex-col gap-6 px-4"
        style={{
          perspective: '1000px',
          perspectiveOrigin: 'center 50%',
        }}
        variants={{
          animate: {
            transition: {
              delayChildren: stagger(0.12),
            },
          },
        }}
        transition={{}}
        initial="initial"
        animate="animate"
      >
        {list.map((post) => (
          <motion.div
            key={post.id}
            className="flex flex-col gap-1.5 px-2 py-1"
            variants={itemVariants}
            style={{ transformOrigin: 'center bottom' }}
            transition={{
              opacity: {
                type: 'tween',
                duration: 0.5,
                ease: 'easeIn',
              },
            }}
          >
            <div className="text-2xl leading-tight">{post.title}</div>
            <div className="text-neutral-tertiary">{post.body}</div>
          </motion.div>
        ))}
      </motion.div>

      {isLoading ? (
        <div className="flex-center py-2">
          <LineMdLoadingTwotoneLoop width={40} height={40} />
        </div>
      ) : (
        <div ref={observeScrollEnd}></div>
      )}
    </div>
  )
}
