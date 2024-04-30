import { fetchData, postData } from "@/lib/api"

export const createPostRequest = async (reqData) => {
  const response = await postData('/api/post/create', reqData)
  return response
}

export const getPostsRequest = async (reqData) => {
  const response = await fetchData(`/api/post/getPosts?userId=${reqData?.userId}`)
  return response
}
