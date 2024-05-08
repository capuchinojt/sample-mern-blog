export const createResponse = ({success, data = null, error = null, message = ''}) => ({
  success,
  data,
  error,
  message
})
