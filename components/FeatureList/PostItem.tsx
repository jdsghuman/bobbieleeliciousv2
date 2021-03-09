import Link from 'next/link'
import Image from 'next/image'
import Button from '../Button/Button'
import { truncateText } from '../Util/Util'

import styles from './FeatureList.module.scss'

const PostItem = ({ article, slug, lastRef }) => {
  return (
    <div className={styles.item} key={article.sys.id} ref={lastRef}>
      {article.fields.image && (
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
      <Link href={`/${slug}/` + article.fields.slug}>
        <Button className={styles.item__button} type="button" accent>
          Read more
        </Button>
      </Link>
    </div>
  )
}

export default PostItem
