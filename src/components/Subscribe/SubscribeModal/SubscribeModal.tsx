import { useState } from 'react'
import axios from 'axios'
import classNames from 'classnames/bind'
import Button from '../../Button'
import styles from './SubscribeModal.module.scss'

const cx = classNames.bind(styles)

interface SubscribeModalPropTypes {
  closeModal: () => void
}

const SubscribeModal = ({ closeModal }: SubscribeModalPropTypes) => {
  const [email, setEmail] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [required, setRequired] = useState<boolean>(false)

  const handleChange = (e) => {
    setEmail(e.target.value.trim())
  }

  const close = () => {
    setTimeout(() => {
      closeModal()
    }, 2000)
  }

  const handleSubmit = async () => {
    setLoading(true)
    if (email) {
      setRequired(false)
      if (!validateEmail(email)) {
        setLoading(false)
        setSuccessMessage(null)
        return setErrorMessage('Please enter a valid email')
      }
      try {
        await axios.post('/api/subscribe', { email })
        setLoading(false)
        setEmail('')
        setSuccessMessage('Thank you for subscribing!')
        setErrorMessage(null)
        setLoading(false)
        localStorage.setItem('submit', 'subscribed')
        close()
      } catch (e) {
        setErrorMessage(e.response.data.error)
        console.log(e.response.data)
        setLoading(false)
      }
    } else {
      setRequired(true)
    }
  }

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
  }
  return (
    <div className={styles.modal}>
      <div className={styles.modal__container}>
        {successMessage && (
          <p
            className={cx('modal__text', {
              'modal__text--success': successMessage,
            })}
          >
            Thank you for subscribing!
          </p>
        )}
        {errorMessage && (
          <p
            className={cx('modal__text', {
              'modal__text--error': errorMessage || required,
            })}
          >
            {errorMessage}
          </p>
        )}
        {!errorMessage && !successMessage && (
          <p className={styles.modal__text}>Subscribe to receive updates!</p>
        )}
        <div className={styles.form}>
          <input
            id="emailModal"
            name="emailModal"
            placeholder="Email"
            className={cx('form__field', {
              'form__field--error': errorMessage || required,
            })}
            onChange={handleChange}
            value={email}
            type="email"
            required
          />
          <label
            className={cx('form__label', {
              'form__label--error': errorMessage || required,
            })}
            htmlFor="emailModal"
          >
            Email
          </label>
          <Button
            onClick={handleSubmit}
            className={styles.modal__button}
            type={'button'}
            disabled={loading}
            primary
          >
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SubscribeModal
