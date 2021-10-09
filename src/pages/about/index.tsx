/* eslint-disable @next/next/no-img-element */
import className from 'classnames/bind'
import styles from './index.module.scss'
import { aboutText } from '../../data/data'
import { MetaTags, PageType, RobotsContent } from '../../components/PropTypes/Tags'
import Meta from '../../components/Meta'
import Signature from '../../components/Signature'

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

  const postMetaTags: MetaTags = {
    canonical: 'https://www.bobbieleelicious.com',
    description: `Delicious and nutritious healthy vegetarian recipes`,
    image: `https://cdn.filestackcontent.com/eFCXsb8GSvWzOcZTJoEO`,
    robots: `${RobotsContent.follow},${RobotsContent.index}`,
    title: `Bobbieleelicious`,
    type: PageType.website,
  }

  return (
    <>
      <Meta tags={postMetaTags} />
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
        <div className={styles['about__text-container']}>
          {buildAboutDescription()}
          <Signature author={'Bobbielee'} location={'about'} />
        </div>
      </div>
    </>
  )
}

export default About
