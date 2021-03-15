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

const ShareIcons = ({ postName, postImage }) => {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(String(window.location))
  }, [])
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Share the love</h3>
      <div className={styles.container__share}>
        <FacebookShareButton
          url={url}
          quote={`Bobbieleelicous - ${postName}`}
          hashtag={'Bobbieleelicious'}
          className={styles.icon}
        >
          <FacebookIcon size={'2rem'} round={true} />
        </FacebookShareButton>
        <PinterestShareButton url={url} media={postImage} className={styles.icon}>
          <PinterestIcon size={'2rem'} round />
        </PinterestShareButton>
        <EmailShareButton
          url={url}
          subject={'Check out this recipe on Bobbieleelicious'}
          className={styles.icon}
        >
          <EmailIcon size={'2rem'} round />
        </EmailShareButton>
        <WhatsappShareButton
          url={url}
          title={'Check out this recipe on Bobbieleelicous'}
          className={styles.icon}
        >
          <WhatsappIcon size={'2rem'} round={true} />
        </WhatsappShareButton>
      </div>
    </div>
  )
}

export default ShareIcons
