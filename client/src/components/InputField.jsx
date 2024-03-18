import PropTypes from 'prop-types'
import { Label, TextInput } from "flowbite-react"

export const InputField = (props) => {
  const {id, label, type, placeholder, registerControl, errors} = props
  const errorMessage = errors[id]?.message ?? ''
  return (
    <div> 
      <Label htmlFor={id} color={'black'} value={label} />
      <TextInput type={type} placeholder={placeholder} id={id} {...registerControl} color={errorMessage ? 'failure' : undefined} helperText={errorMessage && <span className="font-medium">{errorMessage[0].toUpperCase() + errorMessage.slice(1)}</span>} />
    </div>
  )
}

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  registerControl: PropTypes.shape({}),
  errors: PropTypes.shape({})
}

InputField.defaultProps = {
  type: 'text'
};