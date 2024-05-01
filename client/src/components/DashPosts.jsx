import { userInfoStore } from "@/services/zustandStore/userStore"
import { useEffect, useState } from "react"

import { PostTable } from "@/components/PostTable"
import { useGetPosts } from "@/services/hooks/useGetPosts.hook"

export const DashPosts = () => {
  const currentUser = userInfoStore(state => state.userInfo)

  const [showMore, setShowMore] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  const [posts, setPosts] = useState([])

  const { isPending, isError, data, error, refetch } = useGetPosts({
    userId: currentUser?._id,
    isAdmin: currentUser?.isAdmin,
    startIndex
  })

  useEffect(() => {
    const { postCount, totalPosts } = data?.data || {}
    postCount === 9 && totalPosts > 9 ? setShowMore(true) : setShowMore(false)
    if (Array.isArray(data?.data?.posts) && data?.data?.posts.length > 0) {
      startIndex === 0 ? setPosts(data?.data?.posts || []) : setPosts(prevPost => [...prevPost, ...data?.data?.posts || []]) 
    }
  }, [data])

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  const handleShowMore = () => {
    setStartIndex(posts.length)
    refetch()
  }

  console.log('dash_posts::', data?.data?.posts)

  return (
    <div className="bg-white table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {
        currentUser?.isAdmin && <PostTable posts={posts} />
      }
      <div>
        { showMore && (
          <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
            Show more
          </button>
        )}
      </div>
    </div>
  )
}
