import Link from 'next/link'
import Image from 'next/image'
import styles from './FeatureList.module.scss'

const FeatureList = ({ articles, slug, title }) => {
  console.log('FeatureList----', articles)
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
                <img
                  src={article.fields.image}
                  alt={article.fields.title}
                  className={styles.item__image}
                  // layout="fill"
                />
              </div>
            )}
            <div className={styles.item__link}>
              <Link href={`/${slug}s/` + article.fields.slug}>
                <a>{article.fields.title}</a>
              </Link>
            </div>
            <p>
              {article.fields.description.length > 154
                ? truncateDescription(article.fields.description)
                : article.fields.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeatureList
