import { postData } from "@/lib/api"

export const createPostRequest = async (reqData) => {
  const response = await postData('/api/post/create', reqData)
  return response
}
