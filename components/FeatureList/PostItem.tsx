import Link from 'next/link'
import Image from 'next/image'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import Button from '../Button/Button'
import { formatDate, truncateText } from '../Util/Util'
import styles from './FeatureList.module.scss'

const cx = classNames.bind(styles)

const PostItem = ({ article, slug, lastRef }) => {
  return (
    <div className={styles.item} key={article.sys.id} ref={lastRef}>
      {article.fields.image ? (
        <div>
          <Link href={`/${slug}/` + article.fields.slug}>
            <Image
              src={article.fields.image}
              alt={article.fields.title}
              className={styles.item__image}
              width={475}
              height={300}
            />
          </Link>
        </div>
      ) : (
        <div className={cx('item__image', 'item__image--default')}></div>
      )}
      <div className={styles.item__link}>
        <Link href={`/${slug}/` + article.fields.slug}>
          <a>{truncateText(article.fields.title, 30)}</a>
        </Link>
      </div>
      <p className={styles.item__description}>
        {article.fields.description.length > 154
          ? truncateText(article.fields.description, 154)
          : article.fields.description}
      </p>
      <div
        className={cx('item__container__button', {
          'item__container__button--center': article.sys.contentType.sys.id !== 'blogPost',
        })}
      >
        <div className={styles.item__container__button__author}>
          {article.sys.contentType.sys.id === 'blogPost' && (
            <>
              <div className={styles.item__container__button__author__image__container}>
                {article?.fields?.author?.fields?.image ? (
                  <Image
                    src={article.fields.author.fields.image}
                    alt={article.fields.author.fields.name}
                    className={styles.item__container__button__image}
                    width={40}
                    height={40}
                  />
                ) : (
                  <div
                    className={cx(
                      'item__container__button__image',
                      'item__container__button__image--default'
                    )}
                  ></div>
                )}
              </div>
              <div className={styles.item__container__button__author__name__container}>
                <p className={styles.item__container__button__author__name}>
                  {article.fields.author.fields.name}
                </p>
                <p className={styles.item__container__button__author__date}>
                  {formatDate(article.fields.publishDate)}
                </p>
              </div>
            </>
          )}
        </div>
        <Link href={`/${slug}/` + article.fields.slug}>
          <Button className={styles.item__button} type="button" accent>
            Read more
          </Button>
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
