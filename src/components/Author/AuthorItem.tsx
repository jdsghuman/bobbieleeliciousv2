import Image from 'next/image'
import classNames from 'classnames/bind'
import { formatDate } from '../Util/Util'
import { BlogPropType } from '../PropTypes/PropTypes'
import styles from './AuthorItem.module.scss'

const cx = classNames.bind(styles)

const AuthorItem = ({ blog }: BlogPropType) => {
  return (
    <div className={styles.container}>
      {blog.sys.id === 'blogPost' && (
        <>
          <div className={styles['container--image']}>
            {blog?.fields?.author?.fields?.image ? (
              <Image
                src={blog.fields.author.fields.image}
                alt={blog.fields.author.fields.name || 'author image'}
                className={styles.image}
                width={40}
                height={40}
              />
            ) : (
              <div className={cx('image', 'image--default')}></div>
            )}
          </div>
          <div className={styles['container--name']}>
            <p className={styles.name}>{blog.fields.author.fields.name}</p>
            <p className={styles.date}>{formatDate(blog.fields.publishDate)}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default AuthorItem
