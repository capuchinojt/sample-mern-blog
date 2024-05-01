import { getPostsRequest } from "@/api/postApi"
import { useQuery } from "@tanstack/react-query"

export const useGetPosts = (queryParams) => {
  console.log('useGetPosts', queryParams)
  const { userId, isAdmin, startIndex = 0 } = queryParams
  
  return useQuery({
    queryKey: ['dash_posts', userId, startIndex],
    queryFn: () => getPostsRequest({ userId: userId, startIndex }),
    enabled: !!userId && isAdmin
  })
}
