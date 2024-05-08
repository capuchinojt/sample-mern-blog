import { deleteData, fetchData, postData, updateData } from "@/lib/api"

export const createPostRequest = async (reqData) => {
  const response = await postData('/api/post/create', reqData)
  return response
}

export const getPostsRequest = async (reqData) => {
  const params = new URLSearchParams(reqData).toString()
  const response = await fetchData(`/api/post/getPosts?${params}`)
  return response
}

export const getPostRequest = async (postId) => {
  const response = await fetchData(`/api/post/getPosts?postId=${postId}`)
  return response
}

export const deletePostRequest = async (reqData) => {
  const { userId, postId } = reqData
  const response = await deleteData(`/api/post/deletePost/${userId}/${postId}`)
  return response
}

export const updatePostRequest = async (reqData) => {
  const { userId, postId } = reqData
  const response = await updateData(`/api/post/updatePost/${userId}/${postId}`, reqData)
  return response
}
