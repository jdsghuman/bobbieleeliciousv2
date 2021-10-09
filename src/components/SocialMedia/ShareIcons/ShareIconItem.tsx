import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  WhatsappShareButton,
} from 'react-share'

import { EmailIcon, FacebookIcon, PinterestIcon, WhatsappIcon } from 'react-share'
import styles from './ShareIcons.module.scss'

const cx = classNames.bind(styles)

const colorIcons = 'rgb(233, 206, 194)'

interface ShareIconItemProps {
  postImage?: string
  postName?: string
  className?: string
  iconSize?: string
  iconRef?: any
}

const ShareIconItem = ({
  postImage,
  postName,
  className,
  iconSize,
  iconRef,
}: ShareIconItemProps) => {
  const [url, setUrl] = useState('')
  const defaultIconSize = iconSize ? iconSize : '2rem'
  useEffect(() => {
    setUrl(String(window.location))
  }, [])
  return (
    <div ref={iconRef} className={cx('container__share', className)}>
      <FacebookShareButton
        url={url}
        quote={`Bobbieleelicous - ${postName}`}
        hashtag={'Bobbieleelicious'}
        className={styles.icon}
      >
        <FacebookIcon size={defaultIconSize} round={true} bgStyle={{ fill: `${colorIcons}` }} />
      </FacebookShareButton>
      <PinterestShareButton url={url} media={postImage} className={styles.icon}>
        <PinterestIcon size={defaultIconSize} round bgStyle={{ fill: `${colorIcons}` }} />
      </PinterestShareButton>
      <EmailShareButton
        url={url}
        subject={'Check out this recipe on Bobbieleelicious'}
        className={styles.icon}
      >
        <EmailIcon size={defaultIconSize} round bgStyle={{ fill: `${colorIcons}` }} />
      </EmailShareButton>
      <WhatsappShareButton
        url={url}
        title={'Check out this recipe on Bobbieleelicous'}
        className={styles.icon}
      >
        <WhatsappIcon size={defaultIconSize} round={true} bgStyle={{ fill: `${colorIcons}` }} />
      </WhatsappShareButton>
    </div>
  )
}

export default ShareIconItem
