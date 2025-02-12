import { userInfoStore } from '@/services/zustandStore/userStore'
import { Button, Textarea } from 'flowbite-react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export const CommentSection = ({ postId }) => {
  const currentUser = userInfoStore((state) => state.userInfo)

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      <div>CommentSection:: {postId}</div>
      {
        currentUser ? (
          <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
            <p>Sign in as: </p>
            <img className='h-5 object-cover rounded-full' src={currentUser.profilePicture} alt="User avatar" />
            <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
              @{currentUser.username}
            </Link>
          </div>
        ) : (
          <div className="text-sm text-teal-500 my-5 flex gap-1">
            You must be sign in to comment.
            <Link to={'/signIn'} className='text-blue-500 hover:underline'>
              Sign In
            </Link>
          </div>
        )
      }
      {
        currentUser && (
          <form className='border border-teal-500 rounded-md p-3'>
            <Textarea
              placeholder='Add a comment...'
              rows='3'
              maxLength='200'
            />
            <div className="flex justify-between items-center mt-5">
              <p className='text-gray-500 text-xs'>200 characters remaining</p>
              <Button outline gradientDuoTone='purpleToBlue' type='submit'>
                Submit
              </Button>
            </div>
          </form>
        )
      }
    </div>
  )
}

CommentSection.propTypes = {
  postId: PropTypes.string.isRequired
}
