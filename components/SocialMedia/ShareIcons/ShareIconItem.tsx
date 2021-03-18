import { useEffect, useState } from 'react'

import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share'

import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  RedditIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share'
import styles from './ShareIcons.module.scss'

const colorIcons = 'rgb(233, 206, 194)'

const ShareIconItem = ({ postImage, postName }) => {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(String(window.location))
  }, [])
  return (
    <div className={styles.container__share}>
      <FacebookShareButton
        url={url}
        quote={`Bobbieleelicous - ${postName}`}
        hashtag={'Bobbieleelicious'}
        className={styles.icon}
      >
        <FacebookIcon size={'2rem'} round={true} bgStyle={{ fill: `${colorIcons}` }} />
      </FacebookShareButton>
      <PinterestShareButton url={url} media={postImage} className={styles.icon}>
        <PinterestIcon size={'2rem'} round bgStyle={{ fill: `${colorIcons}` }} />
      </PinterestShareButton>
      <EmailShareButton
        url={url}
        subject={'Check out this recipe on Bobbieleelicious'}
        className={styles.icon}
      >
        <EmailIcon size={'2rem'} round bgStyle={{ fill: `${colorIcons}` }} />
      </EmailShareButton>
      <WhatsappShareButton
        url={url}
        title={'Check out this recipe on Bobbieleelicous'}
        className={styles.icon}
      >
        <WhatsappIcon size={'2rem'} round={true} bgStyle={{ fill: `${colorIcons}` }} />
      </WhatsappShareButton>
    </div>
  )
}

export default ShareIconItem
