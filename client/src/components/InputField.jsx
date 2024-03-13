import PropTypes from 'prop-types'
import { Label, TextInput } from "flowbite-react"

export const InputField = (props) => {
  const {id, label, type, placeholder, registerControl} = props
  return (
    <div> 
      <Label color={'black'} value={label} />
      <TextInput type={type} placeholder={placeholder} id={id} {...registerControl} />
    </div>
  )
}

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  registerControl: PropTypes.shape({})
}
