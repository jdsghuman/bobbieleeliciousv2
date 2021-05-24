import { useEffect } from 'react'
import Modal from 'react-modal'
import Icon from '../Icon/Icon'
import styles from './ModalDisplay.module.scss'

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: '400',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #cebf37',
    paddingBottom: '40px',
  },
}

const ModalDisplay = ({ isOpen, closeModal, ...props }) => {
  useEffect(() => {
    if (document.getElementById('modal')) {
      Modal.setAppElement('#modal')
    }
  }, [])
  return (
    <div>
      <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Modal">
        <Icon
          identifier="close"
          viewBox="0 0 500 512"
          dimensions={{ height: 18, width: 18 }}
          className={styles.icon}
          click={closeModal}
        />
        {props.children}
      </Modal>
    </div>
  )
}

export default ModalDisplay
