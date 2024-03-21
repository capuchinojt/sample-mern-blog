import PropTypes from 'prop-types'
import { Link } from "react-router-dom"

export const Logo = ({customClasses}) => {
  return (
    <Link to="/" className={`${customClasses} self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white`}>
      <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 rounded-lg text-white">CapuchinoJT's</span>{' '}
      Blog
    </Link>
  )
}

Logo.propTypes = {
  customClasses: PropTypes.string
}
