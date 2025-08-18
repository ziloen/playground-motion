import { z } from 'zod'
import { request } from './'

const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
})

const postListSchema = z.array(postSchema)

export type Post = z.infer<typeof postSchema>

export async function getPostListApi(params: {
  page: number
  pageSize: number
  userId?: number
}) {
  const start = (params.page - 1) * params.pageSize
  const limit = params.pageSize

  const search = new URLSearchParams({
    _start: String(start),
    _limit: String(limit),
  })

  if (params.userId !== undefined) {
    search.append('userId', String(params.userId))
  }

  const { data } = await request.get<Post[]>(`/posts?${search.toString()}`, {
    responseSchema: postListSchema,
  })

  return data
}

export async function getPostApi(id: number) {
  const { data } = await request.get<Post>(`/posts/${id}`, {
    responseSchema: postSchema,
  })

  return data
}
