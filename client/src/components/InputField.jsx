import PropTypes from 'prop-types'
import { Label, TextInput } from "flowbite-react"

export const InputField = (props) => {
  const {id, label, type, placeholder, registerControl, errors, defaultValue} = props
  const errorMessage = errors[id]?.message ?? ''
  return (
    <div> 
      {label && <Label htmlFor={id} color={'black'} value={label} />}
      <TextInput type={type} placeholder={placeholder} id={id} {...registerControl} color={errorMessage ? 'failure' : undefined} helperText={errorMessage && <span className="font-medium">{errorMessage[0].toUpperCase() + errorMessage.slice(1)}</span>} defaultValue={defaultValue} />
    </div>
  )
}

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  registerControl: PropTypes.shape({}),
  errors: PropTypes.shape({}),
  defaultValue: PropTypes.string
}

InputField.defaultProps = {
  type: 'text'
};