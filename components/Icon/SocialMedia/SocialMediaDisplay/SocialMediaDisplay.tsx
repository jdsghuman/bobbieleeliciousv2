import classNames from 'classnames/bind'
import FacebookIcon from '../FacebookIcon'
import InstagramIcon from '../InstagramIcon'
import EmailIcon from '../EmailIcon'
import BlogIcon from '../BlogIcon'
import styles from './SocialMediaDisplay.module.scss'

const cx = classNames.bind(styles)
import { SocialMediaLinks } from '../../../../data/data'

interface propTypes {
  position?: string
}

const SocialMediaIcons = ({ position }: propTypes) => {
  return (
    <div
      className={cx('footer__social', {
        'footer__social--sidebar': position === 'sidebar',
      })}
    >
      {SocialMediaLinks.Instagram && (
        <InstagramIcon
          fill={'#555555'}
          className={cx('icon__container', {
            icon__container__sidebar: position === 'sidebar',
          })}
          viewBox={`${position === 'navbar' ? '0 0 820 512' : '0 0 720 512'}`}
          link={`https://${SocialMediaLinks.Instagram}`}
        />
      )}
      {SocialMediaLinks.Facebook && (
        <FacebookIcon
          position={position}
          fill={'#555555'}
          className={cx('icon__container', {
            icon__container__sidebar: position === 'sidebar',
          })}
          viewBox={`${position === 'navbar' ? '0 10 820 512' : '0 10 700 512'}`}
          link={`https://${SocialMediaLinks.Facebook}`}
        />
      )}
      {SocialMediaLinks.Email && (
        <EmailIcon
          position="sidebar"
          fill={'#555555'}
          className={cx('icon__container', {
            icon__container__sidebar: position === 'sidebar',
          })}
          viewBox={`${position === 'navbar' ? '0 10 820 512' : '0 10 700 512'}`}
          link={SocialMediaLinks.Email}
        />
      )}
      {SocialMediaLinks.Blog && (
        <BlogIcon
          fill={'#555555'}
          className={cx('icon__container', {
            icon__container__sidebar: position === 'sidebar',
          })}
          viewBox={'0 10 700 512'}
          link="/blogs"
        />
      )}
      {/* {SocialMediaLinks.Youtube && (
        <YoutubeIcon
          fill={"#555555"}
          className={cx("icon__container", {
            icon__container__sidebar: position === "sidebar",
          })}
          viewBox={"0 10 700 512"}
          link={`https://${SocialMediaLinks.Youtube}`}
        />
      )} */}
    </div>
  )
}

export default SocialMediaIcons
