import { getPostsRequest } from "@/api/postApi"
import { useQuery } from "@tanstack/react-query"
import { Button, Spinner } from "flowbite-react"
import { Link, useParams } from "react-router-dom"
import { Blank } from "./Blank"
import { apiErrorMessages } from "@/constant/errorCode.constants"
import { useMemo } from "react"


export const PostPage = () => {
  const { postSlug } = useParams()

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['post', postSlug],
    queryFn: () => getPostsRequest({
      slug: postSlug
    }),
    enabled: !!postSlug
  })

  const post = useMemo(() => data?.data?.posts[0], [data])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    )
  }

  if (isError) {
    return <Blank messObj={apiErrorMessages.CONFLICT} />
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">{post?.title}</h1>
      <Link to={`/search?category=${post.category}`} className="self-center mt-5">
        <Button color="gray" pill size={'xs'}>{post?.category}</Button>
      </Link>
      <img src={post?.image} className="mt-10 p-3 max-h-[600px] w-full object-cover" alt={post?.title} />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleString()}</span>
        <span className="italic">{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{__html: post?.content}} />
    </main>
  )
}
