import { Table } from "flowbite-react"
import { Link } from "react-router-dom"
import PropTypes from 'prop-types'

export const PostTable = ({ posts }) => {
  return (
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
  )
}

PostTable.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object)
}
