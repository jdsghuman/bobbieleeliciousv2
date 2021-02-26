import Link from 'next/link'
import Button from '../Button/Button'
import styles from './FeatureList.module.scss'

const FeatureList = ({ articles, slug, title }) => {
  const truncateDescription = (description) => {
    return description && description.length > 154
      ? `${description.substring(0, 154)}...`
      : description
  }

  return (
    <div className={styles.container}>
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
                <a>{article.fields.title}</a>
              </Link>
            </div>
            <p>
              {article.fields.description.length > 154
                ? truncateDescription(article.fields.description)
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
