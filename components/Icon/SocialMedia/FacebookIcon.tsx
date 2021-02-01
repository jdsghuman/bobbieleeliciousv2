import React from 'react';
import styles from './SocialMediaDisplay/SocialMediaDisplay.module.scss';
import { IconPropType } from '../../PropTypes/PropTypes'

const FacebookIcon = ({ fill, link, position, className, viewBox }: IconPropType) => {
  return (
    <div className={className}>
      <a className={styles.icon__link}
        href={link}
        target="_blank"
        rel="noopener noreferrer">
        {position === 'navbar' ?
          <svg viewBox={viewBox} fill={fill} xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" /></svg> :
          <svg viewBox={viewBox} fill={fill} xmlns="http://www.w3.org/2000/svg"><path d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"></path></svg>
        }
      </a>
    </div>
  )
}

export default FacebookIcon;
