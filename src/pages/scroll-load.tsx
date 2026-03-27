import { switchLatest } from '@wai-ri/core'
import { isAxiosError } from 'axios'
import clsx from 'clsx'
import type { Variants } from 'motion/react'
import { stagger } from 'motion/react'
import type { RefCallback } from 'react'
import type { Post } from '~/api/post'
import { getPostListApi } from '~/api/post'
import { useGetState, useMemoizedFn } from '~/hooks'
import CarbonReset from '~icons/carbon/reset'
import LineMdLoadingTwotoneLoop from '~icons/line-md/loading-twotone-loop'

const getPostListLatest = switchLatest(getPostListApi)

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

export default function ScrollLoad() {
  // #region useState, useHookState
  const [list, setList] = useState<Post[]>([])
  const [isFetching, setIsFetching, getIsFetching] = useGetState(false)
  const [userId, setUserId, getUserId] = useGetState<number | undefined>(
    undefined,
  )
  const [searchText, setSearchText, getSearchText] = useGetState('')
  const [hasNextPage, setHasNextPage, getHasNextPage] = useGetState(true)
  const [nextPage, setNextPage, getNextPage] = useGetState(1)
  const [error, setError, getError] = useGetState<Error | null>(null)
  // #endregion

  // #region useRef

  // #endregion

  // #region useMemo
  // #endregion

  // #region functions, useImperativeHandle
  const fetchNextPage = useMemoizedFn(async () => {
    if (getIsFetching() || !getHasNextPage()) {
      return
    }

    const pageSize = 7

    setIsFetching(true)
    setError(null)
    getPostListLatest({
      page: getNextPage(),
      pageSize,
      query: getSearchText(),
      userId: getUserId(),
    })
      .then((res) => {
        if (res.posts.length < pageSize) {
          setHasNextPage(false)
        } else {
          setNextPage(getNextPage() + 1)
        }

        setList((list) => {
          return [...list, ...res.posts]
        })
      })
      .catch((e: unknown) => {
        if (isAxiosError(e)) {
          setError(e)
        } else if (Error.isError(e)) {
          setError(e)
        } else if (typeof e === 'string') {
          setError(new Error(e))
        } else {
          setError(new Error('Unknown error'))
        }
      })
      .finally(() => {
        setIsFetching(false)
      })
  })

  const resetAndFetch = useMemoizedFn(() => {
    setNextPage(1)
    setHasNextPage(true)
    setList([])
    setError(null)
    setIsFetching(false)
    fetchNextPage()
  })
  // #endregion

  // #region useHookEffect, useEffect

  // initial load
  useLayoutEffect(() => {
    fetchNextPage()
  }, [])

  const trackIntersection = useMemoizedFn<RefCallback<Element>>((el) => {
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (getError() === null) {
            fetchNextPage()
          }
        }
      },
      { rootMargin: '10px' },
    )

    observer.observe(el)

    return () => observer.disconnect()
  })
  // #endregion

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
            resetAndFetch()
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
            resetAndFetch()
          }}
        />
      </div>

      <div className="overflow-y-auto pt-4">
        {!isFetching && !error && list.length === 0 && (
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
            error ? (
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
