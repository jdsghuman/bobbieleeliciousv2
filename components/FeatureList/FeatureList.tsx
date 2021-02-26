import Link from 'next/link'
import Button from '../Button/Button'
import { truncateText } from '../Util/Util'
import styles from './FeatureList.module.scss'

const FeatureList = ({ articles, slug, title }) => {
  return (
    <div className={styles.container}>
      {console.log('title length----', title)}
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.items}>
        {articles.map((article) => (
          <div className={styles.item} key={article.sys.id}>
            {article.fields.image && (
              <div>
                <Link href={`/${slug}/` + article.fields.slug}>
                  <img
                    src={article.fields.image}
                    alt={article.fields.title}
                    className={styles.item__image}
                  />
                </Link>
              </div>
            )}
            <div className={styles.item__link}>
              <Link href={`/${slug}/` + article.fields.slug}>
                <a>{truncateText(article.fields.title, 30)}</a>
              </Link>
            </div>
            <p>
              {article.fields.description.length > 154
                ? truncateText(article.fields.description, 154)
                : article.fields.description}
            </p>
            <Link href={`/${slug}/` + article.fields.slug}>
              <Button className={styles.item__button} accent>
                Read more
              </Button>
            </Link>
          </div>
        ))}
      </div>
      <Link href={`/${slug}s`}>
        <Button primary className={styles['container__button--all']}>
          Go to {slug}s
        </Button>
      </Link>
    </div>
  )
}

export default FeatureList
