import { useState } from 'react'
import axios from 'axios'
import classNames from 'classnames/bind'
import Button from '../Button/Button'
import styles from './Banner.module.scss'

const cx = classNames.bind(styles)

const SubscribeBanner = () => {
  const [email, setEmail] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [required, setRequired] = useState(false)

  const handleChange = (e) => {
    setEmail(e.target.value.trim())
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
      // localStorage.setItem('submit', 'subscribed')
      try {
        const response = await axios.post('/api/subscribe', { email })
        setLoading(false)
        setEmail('')
        setSuccessMessage('Thank you for subscribing!')
        setErrorMessage(null)
        setLoading(false)
      } catch (e) {
        setErrorMessage(e.response.data.error)
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

  console.log('email', email)
  return (
    <div className={styles.banner}>
      <div className={styles['banner__bg-banner']} />
      <div className={styles.banner__container}>
        {successMessage && (
          <p
            className={cx('banner__text', {
              'banner__text--success': successMessage,
            })}
          >
            Thank you for subscribing!
          </p>
        )}
        {errorMessage && (
          <p
            className={cx('banner__text', {
              'banner__text--error': errorMessage || required,
            })}
          >
            {errorMessage}
          </p>
        )}
        {!errorMessage && !successMessage && (
          <p className={styles.banner__text}>Subscribe to receive updates!</p>
        )}
        <div className={styles.form}>
          <input
            id="email"
            name="email"
            placeholder="Email"
            className={cx('form__field', {
              'form__field--error': errorMessage || required,
            })}
            onChange={handleChange}
            value={email}
            type="email"
            required
          />
          <label className={styles.form__label} htmlFor="email">
            Email
          </label>
          <Button
            onClick={handleSubmit}
            className={styles.banner__button}
            type={'button'}
            disabled={loading}
            accent
          >
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SubscribeBanner
