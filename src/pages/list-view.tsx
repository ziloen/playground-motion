import { getPostListApi, Post } from '~/api/post'

export default function ListView() {
  const [searchVal, setSearchVal] = useState()
  const [postList, setPostList] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [listKey, setListKey] = useState('')

  useEffect(() => {
    getPostListApi({ page: page, pageSize: 10 }).then(res => {
      console.log(res)
      setPostList(res)
      setListKey(crypto.randomUUID())
    })
  }, [page])

  function deletePost(id: number) {
    setPostList(postList.filter(post => post.id !== id))
  }

  return (
    <motion.div
      className="flex h-full flex-col space-y-4 p-4 pe-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <NavLink to="/">← Home</NavLink>

      <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden" key={listKey}>
        <AnimatePresence initial={false}>
          {postList.map(post => (
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
              <h1 className="text-lg font-bold">{post.title}</h1>
              <p className="text-dark-gray-400">{post.body}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            setPage(page === 1 ? 1 : page - 1)
          }}
        >
          Prev
        </button>
        <button
          onClick={() => {
            setPage(page + 1)
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  )
}
