import { useMemo } from "react"
import { Spinner } from "flowbite-react"
import { useInfiniteQuery } from "@tanstack/react-query"

import { userInfoStore } from "@/services/zustandStore/userStore"
import { PostTable } from "@/components/PostTable"
import { getPostsRequest } from "@/api/postApi"

export const DashPosts = () => {
  const currentUser = userInfoStore(state => state.userInfo)

  const { isFetching, isError, data, error, refetch, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['dash_posts'],
    queryFn: ({ pageParam = 0 }) => getPostsRequest({
      userId: currentUser._id,
      startIndex: pageParam,
      limit: 9
    }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.totalPosts > allPages.length * 9 ? allPages.length * 9 : undefined
    },
    enabled: !!currentUser?._id && currentUser?.isAdmin
  })

  const posts = useMemo(() => data?.pages && data?.pages.length > 0 ? data.pages.flatMap(page => page.data.posts) : [], [data])

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  const handleShowMore = () => {
    fetchNextPage()
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {
        currentUser?.isAdmin && <PostTable posts={posts} refetchFunc={refetch} />
      }
      <div>
        {
          isFetching ? (
            <div className="text-center py-7">
              <Spinner size='sm' />
              <span className="pl-3">Loading...</span>
            </div> 
          ) : (
            hasNextPage && (
              <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                Show more
              </button>
            )
          )
        }
      </div>
    </div>
  )
}
