import { useState } from "react"
import { Table } from "flowbite-react"
import { Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { FaCheck, FaTimes } from "react-icons/fa"
import PropTypes from 'prop-types'

import { ModalConfirm } from "@/components/ModalConfirm"
import { deleteUserByAdmin } from "@/api/userApi"

export const UserTable = ({ users, refetchFunc }) => {
  const [toggleDeletePostModal, setToggleDeletePostModal] = useState(false)
  const [userDeleteId, setUserDeleteId] = useState(null)
  const deletePostMutation = useMutation({
    mutationFn: (requestData) => deleteUserByAdmin(requestData),
    onSuccess: () => {
      typeof refetchFunc === 'function' && refetchFunc()
    },
    onError: (error) => {
      console.log('Error while delete user:: ', error)
    }
  })
  const handleOnDelete = () => {
    deletePostMutation.mutate({ userId: userDeleteId })
  }

  const handleOnClickDeleteBtn = (deletedUserId) => {
    setToggleDeletePostModal(true)
    setUserDeleteId(deletedUserId)
  }

  return (
    <>
      <Table hoverable className="shadow-md w-full">
      <Table.Head>
        <Table.HeadCell>Date Updated</Table.HeadCell>
        <Table.HeadCell>Username</Table.HeadCell>
        <Table.HeadCell>Avatar</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>User Type</Table.HeadCell>
        <Table.HeadCell>Delete</Table.HeadCell>
      </Table.Head>
      {
        users?.length > 0 && users.map(user => (
          <Table.Body key={user._id} className="divide-y" data-attr={user._id}>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell>{new Date(user.updatedAt).toLocaleDateString()}</Table.Cell>
              <Table.Cell>
                <Link className="font-medium text-gray-900 dark:text-white" to={`/user/${user._id}`}>
                  {user.username}
                </Link>
              </Table.Cell>
              <Table.Cell>
                <Link to={`/user/${user._id}`}>
                  <img src={user.profilePicture} alt={user.profilePicture} className="w-10 h-10 object-cover bg-gray-500 rounded-full" />
                </Link>
              </Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.isAdmin ? (<FaCheck className="text-green-500" />) : (<FaTimes className="text-red-500" />)}</Table.Cell>
              <Table.Cell>
                <span className="font-medium text-red-500 hover:underline cursor-pointer" role="button" onClick={() => handleOnClickDeleteBtn(user._id)} tabIndex={0}>Delete</span>
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

UserTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  refetchFunc: PropTypes.func
}
