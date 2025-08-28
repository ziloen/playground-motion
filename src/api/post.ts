import { z } from 'zod'
import { request } from './'

const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
  views: z.number(),
  tags: z.array(z.string()),
})

const postListSchema = z.object({
  posts: z.array(postSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
})

export type Post = z.infer<typeof postSchema>

type PostListResponse = z.infer<typeof postListSchema>

export async function getPostListApi(params: {
  page: number
  pageSize: number
  userId?: number
  query?: string
}) {
  const search = new URLSearchParams({
    skip: String((params.page - 1) * params.pageSize),
    limit: String(params.pageSize),
  })

  let endpoint = `/posts`

  if (typeof params.userId === 'number') {
    endpoint = `/posts/user/${params.userId}`
  }

  if (params.query) {
    endpoint = `/posts/search`
    search.set('q', params.query)
  }

  const { data } = await request.get<PostListResponse>(
    `${endpoint}?${search.toString()}`,
    { responseSchema: postListSchema },
  )

  return data
}

export async function getPostApi(id: number) {
  const { data } = await request.get<Post>(`/posts/${id}`, {
    responseSchema: postSchema,
  })

  return data
}
