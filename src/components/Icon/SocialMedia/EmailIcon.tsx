import React from 'react'
import styles from './SocialMediaDisplay/SocialMediaDisplay.module.scss'
import { IconPropType } from '../../PropTypes/PropTypes'

const EmailIcon = ({ fill, link, position, className, viewBox }: IconPropType) => {
  return (
    <div className={className}>
      <a
        className={styles.icon__link}
        href={`mailto:${link}?subject=Bobbieleelicious`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {position === 'navbar' ? (
          <svg
            aria-labelledby="email-id"
            viewBox={viewBox}
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
          >
            <title id="email-id">email for Bobbieleelicious</title>
            <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"></path>
          </svg>
        ) : (
          <svg
            aria-labelledby="email-id"
            viewBox={viewBox}
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
          >
            <title id="email-id">email for Bobbieleelicious</title>
            <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"></path>
          </svg>
        )}
      </a>
    </div>
  )
}

export default EmailIcon
