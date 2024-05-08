import { useState } from "react"
import { Table } from "flowbite-react"
import { Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import PropTypes from 'prop-types'

import { ModalConfirm } from "@/components/ModalConfirm"
import { userInfoStore } from "@/services/zustandStore/userStore"
import { deletePostRequest } from "@/api/postApi"

export const PostTable = ({ posts, refetchFunc }) => {
  const [toggleDeletePostModal, setToggleDeletePostModal] = useState(false)
  const currentUser = userInfoStore(state => state.userInfo)
  const [postDeleteId, setPostDeleteId] = useState(null)
  const deletePostMutation = useMutation({
    mutationFn: (requestData) => deletePostRequest(requestData),
    onSuccess: () => {
      typeof refetchFunc === 'function' && refetchFunc()
    },
    onError: (error) => {
      console.log('Error while delete post:: ', error)
    }
  })
  const handleOnDelete = () => {
    deletePostMutation.mutate({ userId: currentUser?._id, postId: postDeleteId })
  }

  const handleOnClickDeleteBtn = (deletePostId) => {
    setToggleDeletePostModal(true)
    setPostDeleteId(deletePostId)
  }

  return (
    <>
      <Table hoverable className="shadow-md w-full">
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
          <Table.Body key={post._id} className="divide-y" data-attr={post._id}>
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
                <span className="font-medium text-red-500 hover:underline cursor-pointer" role="button" onClick={() => handleOnClickDeleteBtn(post._id)} tabIndex={0}>Delete</span>
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
      <ModalConfirm type="confirm" isOpenModal={toggleDeletePostModal} toggleModalFunc={(toggleValue) => setToggleDeletePostModal(toggleValue)} messageConfirm="Are you sure you want to delete this post?" onConfirmFuc={handleOnDelete} />
    </>
  )
}

PostTable.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  refetchFunc: PropTypes.func
}
