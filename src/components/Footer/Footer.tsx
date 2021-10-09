/* eslint-disable @next/next/no-img-element */
import styles from './Footer.module.scss'
import SocialMediaDisplay from '../Icon/SocialMedia/SocialMediaDisplay/SocialMediaDisplay'

const Footer = () => {
  const getCopyrightYear = () => {
    const currentDate = new Date()
    return currentDate.getFullYear()
  }

  return (
    <footer className={styles.footer}>
      <div>
        <img
          className={styles.footer__logo}
          alt="logo"
          src="/images/BobbieLeeLicious-logo-transparent.png"
        />
      </div>
      <SocialMediaDisplay />
      <div className={styles.footer__copy}>Bobbieleelicious &copy; {getCopyrightYear()}</div>
    </footer>
  )
}

export default Footer
