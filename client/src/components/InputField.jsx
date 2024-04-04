import PropTypes from 'prop-types'
import { Label, TextInput } from "flowbite-react"

export const InputField = (props) => {
  const {id, label, type = "text", placeholder, registerControl, errors, defaultValue, handleChangeData} = props
  const errorMessage = errors[id]?.message ?? ''

  if (registerControl && typeof handleChangeData === 'function') {
    registerControl.onChange = (e) => {
      handleChangeData(e.target.value)
    }    
  }

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
  defaultValue: PropTypes.string,
  handleChangeData: PropTypes.func
}
