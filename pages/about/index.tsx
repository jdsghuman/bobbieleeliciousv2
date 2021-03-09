import Head from 'next/head'
import className from 'classnames/bind'
import styles from './index.module.scss'
import { aboutText } from '../../data/data'

const cx = className.bind(styles)

const About = () => {
  const buildAboutDescription = () => {
    const descriptionAbout = aboutText.split('--')
    return descriptionAbout.map((about, i) => {
      return (
        <p key={i} className={styles['about__description-text']}>
          {about}
        </p>
      )
    })
  }

  return (
    <>
      <Head>
        <title>About</title>
        <meta name="description" content="Delicious and nutritious healthy vegetarian recipes" />
      </Head>
      <div className={styles.about}>
        <div className={styles.about__image__container}>
          <img
            className={cx('about__image--default', {
              'about__image--show': true,
            })}
            alt="profile"
            src="https://cdn.filestackcontent.com/eFCXsb8GSvWzOcZTJoEO"
          />
        </div>
        <div className={styles['about__text-container']}>{buildAboutDescription()}</div>
      </div>
    </>
  )
}

export default About
