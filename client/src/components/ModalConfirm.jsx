import { Modal, Button } from 'flowbite-react'
import PropTypes from 'prop-types'
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export const ModalConfirm = ({  isOpenModal, toggleModalFunc, onConfirmFuc, messageConfirm, titleBtnYes, titleBtnNo }) => {
  const handleConfirmUpdate = () => {
    if (typeof onConfirmFuc === 'function') {
      onConfirmFuc()
      handleClose()
    }
  }

  const handleClose = () => {
    if (typeof toggleModalFunc === 'function') {
      toggleModalFunc(false)
    }
  }

  return (
    <Modal show={isOpenModal} size="md" onClose={() => toggleModalFunc(false)} popup>
    <Modal.Header />
    <Modal.Body>
      <div className="text-center">
        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
          {messageConfirm || "Data has changed. Are you sure you want to update information?"}
        </h3>
        <div className="flex justify-center gap-4">
          <Button color="failure" onClick={handleConfirmUpdate}>
            {titleBtnYes || "Yes, I'm sure"}
          </Button>
          <Button color="gray" onClick={() => toggleModalFunc(false)}>
            {titleBtnNo || "No, cancel"}
          </Button>
        </div>
      </div>
    </Modal.Body>
  </Modal>
  )
}

ModalConfirm.propTypes = {
  toggleModalFunc: PropTypes.func,
  isOpenModal: PropTypes.bool.isRequired,
  onConfirmFuc: PropTypes.func,
  messageConfirm: PropTypes.string,
  titleBtnYes: PropTypes.string,
  titleBtnNo: PropTypes.string
}

ModalConfirm.defaultProps = {
  toggleModalFunc: () => {},
  onConfirmFuc: () => {}
}
