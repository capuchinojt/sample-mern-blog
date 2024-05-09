import PropTypes from 'prop-types'

export const Blank = ({ messObj }) => {
  const { message, code } = messObj
  return <div className='w-full h-40 text-center align-middle content-center'>
    <div className=''>
      { code && <span className='font-bold'>{code}</span>} <br />
      <span className='font-medium'>{message}</span>
    </div>
  </div>
}

Blank.propTypes = {
  messObj: PropTypes.object.isRequired,
}
