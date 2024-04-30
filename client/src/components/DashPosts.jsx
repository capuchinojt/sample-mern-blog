import { getPostsRequest } from "@/api/postApi"
import { userInfoStore } from "@/services/zustandStore/userStore"
import { useQuery } from "@tanstack/react-query"
import { Table } from "flowbite-react"
import { useMemo } from "react"
import { Link } from "react-router-dom"

export const DashPosts = () => {
  const currentUser = userInfoStore(state => state.userInfo)
  console.log('currentUser::', currentUser)

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['dash_posts', currentUser?._id],
    queryFn: () => getPostsRequest({ userId: currentUser._id}),
    enabled: !!currentUser && currentUser?.isAdmin
  })

  const posts = useMemo(() => data?.data?.posts || [], [data])

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  console.log('dash_posts::', data?.data?.posts)

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-trach-slate-100 scrollbar-thumb-slate-300 dark:crollbar-trach-slate-100 dark:scrollbar-thumb-slate-500">
      {
        currentUser?.isAdmin && posts.length > 0 ? (
          <div>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Post Image</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>
              {
                posts.map(post => (
                  <Table.Body key={post._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${post.slug}`}>
                          <img src={post.image} alt={post.title} className="w-20 h-10 object-cover bg-gray-500" />
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}>
                          {post.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                      <Table.Cell>
                        <span className="font-medium text-red-500 hover:underline cursor-pointer">Delete</span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`}>
                          <span>Edit</span>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))
              }
            </Table>
          </div>
        ) : (
          <p>You have no post yet!</p>
        )
      }
    </div>
  )
}
