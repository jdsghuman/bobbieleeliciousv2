import Link from 'next/link'
import { useRouter } from 'next/router'
import Button from '../Button'
import PostItem from './PostItem'
import styles from './FeatureList.module.scss'

const FeatureList = ({ articles, slug, title }) => {
  const router = useRouter()
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.items}>
        {articles.map((article) => (
          <PostItem article={article} slug={slug} key={article.sys.id} />
        ))}
      </div>
      {router.pathname === '/' && (
        <Button primary className={styles['container__button--all']} type="button">
          <Link href={`/${slug}s`} passHref>
            Go <span className={styles['container__button--all__cursive']}>to</span> {slug}s
          </Link>
        </Button>
      )}
    </div>
  )
}

export default FeatureList
