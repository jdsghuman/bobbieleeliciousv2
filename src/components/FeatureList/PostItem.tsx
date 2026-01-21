import Link from 'next/link'
import Image from 'next/image'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import { truncateText } from '../Util/Util'
import Icon from '../Icon/Icon'
import styles from './FeatureList.module.scss'
import AuthorItem from '../Author'

const cx = classNames.bind(styles)

const PostItem = ({ article, slug, lastRef }) => {
  return (
    <div className={styles.item} key={article.sys.id} ref={lastRef}>
      {article.fields.image ? (
        <div>
          <Link href={`/${slug}/` + article.fields.slug} prefetch={false} passHref>
            <Image
              src={article.fields.image}
              alt={article.fields.title || 'author image'}
              className={styles.item__image}
              width={475}
              height={300}
              unoptimized
            />
          </Link>
        </div>
      ) : (
        <div className={cx('item__image', 'item__image--default')}></div>
      )}
      <div className={styles.item__link}>
        <Link href={`/${slug}/` + article.fields.slug} prefetch={false}>
          {truncateText(article.fields.title, 60)}
        </Link>
      </div>
      <p className={styles.item__description}>
        {article.fields.description.length > 154
          ? truncateText(article.fields.description, 154)
          : article.fields.description}
      </p>
      <div
        className={cx('item__container__button', {
          'item__container__button--center': slug !== 'blog',
        })}
      >
        <AuthorItem blog={article} slug={slug} />
        <Link
          className={styles['item__button--accent']}
          href={`/${slug}/` + article.fields.slug}
          prefetch={false}
          passHref
        >
          Read more{' '}
          <Icon
            identifier="arrowright"
            viewBox="0 0 24 24"
            dimensions={{ height: 24, width: 24 }}
            fill={'rgb(233, 206, 194)'}
            className={styles.icon__right}
          />
        </Link>
      </div>
    </div>
  )
}

PostItem.propTypes = {
  article: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  slug: PropTypes.string.isRequired,
  lastRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
}

export default PostItem
