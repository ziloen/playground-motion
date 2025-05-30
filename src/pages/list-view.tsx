import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import type { Post } from '~/api/post'
import { getPostListApi } from '~/api/post'

export default function ListView() {
  const [searchParams, setSearchParams] = useSearchParams({ page: '1' })
  const [searchVal, setSearchVal] = useState()
  const queryClient = useQueryClient()

  const page = Number(searchParams.get('page')) || 1

  const { data: { data, dataPage } = { data: [], dataPage: 0 }, isFetching } =
    useQuery({
      queryKey: ['postList', { page }],
      queryFn: () => {
        return getPostListApi({ page: page, pageSize: 10 }).then((res) => ({
          data: res,
          dataPage: page,
        }))
      },
      placeholderData: keepPreviousData,
      staleTime: Infinity,
    })

  function deletePost(id: number) {
    queryClient.setQueryData(
      ['postList', { page }],
      (data: { data: Post[]; dataPage: number }) => ({
        ...data,
        data: data.data.filter((post: Post) => post.id !== id),
      }),
    )
  }

  return (
    <motion.div
      className="flex h-full flex-col space-y-4 p-4 pe-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <NavLink to="/">← Home</NavLink>

      <div className="flex h-full flex-col overflow-x-hidden overflow-y-auto">
        <AnimatePresence key={dataPage} initial={false}>
          {data.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, transition: { duration: 0.1 } }}
              className="my-2 rounded-md p-4 shadow-md"
              onClick={() => {
                deletePost(post.id)
                // history.push(`/detail-view/${post.id}`)
              }}
            >
              <h2 className="text-lg font-bold">{post.title}</h2>
              <p className="text-dark-gray-400">{post.body}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        {page}
        <button
          onClick={() => {
            setSearchParams({ page: String(page === 1 ? 1 : page - 1) })
          }}
          disabled={isFetching || page === 1}
        >
          Prev
        </button>
        <button
          onClick={() => {
            setSearchParams({ page: String(page + 1) })
          }}
          disabled={isFetching}
        >
          Next
        </button>
      </div>
    </motion.div>
  )
}
