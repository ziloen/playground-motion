import { useInfiniteQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import type { Variants } from 'motion/react'
import { stagger } from 'motion/react'
import type { RefCallback } from 'react'
import { getPostListApi } from '~/api/post'
import { useLatest, useMemoizedFn } from '~/hooks'
import CarbonReset from '~icons/carbon/reset'
import LineMdLoadingTwotoneLoop from '~icons/line-md/loading-twotone-loop'

const containerVariants: Variants = {
  animate: {
    transition: {
      delayChildren: /* #__PURE__ */ stagger(0.12),
    },
  },
}

const itemVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

const PAGE_SIZE = 7

export default function ScrollLoad() {
  const [userId, setUserId] = useState<number | undefined>(undefined)
  const [searchText, setSearchText] = useState('')

  const { data, hasNextPage, isFetching, isError, fetchNextPage, error } =
    useInfiniteQuery({
      queryKey: ['posts', userId, searchText],
      initialPageParam: 1,
      queryFn: async ({ pageParam }) => {
        const res = await getPostListApi({
          page: pageParam,
          pageSize: PAGE_SIZE,
          query: searchText,
          userId: userId,
        })
        return res
      },
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.posts.length < PAGE_SIZE) {
          return undefined
        }

        const total = lastPage.total
        const loaded = allPages.reduce(
          (sum, page) => sum + page.posts.length,
          0,
        )

        if (loaded < total) {
          return allPages.length + 1
        }

        return undefined
      },
    })

  const isErrorLatest = useLatest(isError)

  const list = useMemo(() => {
    return data?.pages.flatMap((page) => page.posts) ?? []
  }, [data])

  const trackIntersection = useMemoizedFn<RefCallback<Element>>((el) => {
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isErrorLatest.current) {
          fetchNextPage()
        }
      },
      { root: null, rootMargin: '10px', threshold: 1 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  })

  return (
    <div className="flex max-h-full flex-col">
      <div className="">
        <select
          value={userId}
          onChange={(e) => {
            setUserId(
              e.currentTarget.value === ''
                ? undefined
                : Number(e.currentTarget.value),
            )
          }}
        >
          <option value="">All Users</option>
          <option value="1">User 1</option>
          <option value="2">User 2</option>
          <option value="3">User 3</option>
          <option value="100">User 100</option>
        </select>

        <input
          type="text"
          className="bg-[field]"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.currentTarget.value)
          }}
        />
      </div>

      <div className="overflow-y-auto pt-4">
        {!isFetching && !isError && list.length === 0 && (
          <div>No posts available.</div>
        )}

        {list.length > 0 && (
          <motion.div
            className="flex flex-col gap-6 px-4"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {list.map((post) => (
              <motion.div
                key={post.id}
                className="flex flex-col gap-1.5 px-2 py-1"
                variants={itemVariants}
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
        )}

        {!isFetching && <div ref={trackIntersection} />}

        <div className="flex-center py-2">
          {hasNextPage ? (
            isError ? (
              <div className="flex-center min-h-10 gap-2 text-red-400">
                <span>{error?.message}</span>
                <CarbonReset
                  className="cursor-pointer"
                  onClick={() => {
                    fetchNextPage()
                  }}
                />
              </div>
            ) : (
              <LineMdLoadingTwotoneLoop
                width={40}
                height={40}
                className={clsx(!isFetching && 'invisible opacity-0')}
              />
            )
          ) : (
            <div className="min-h-10">{'Showing all posts.'}</div>
          )}
        </div>
      </div>
    </div>
  )
}
