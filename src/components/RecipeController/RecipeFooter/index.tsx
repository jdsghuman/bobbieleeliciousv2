import type { RefCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PostTags from '../../PostTags'
import ShareIcons from '../../SocialMedia/ShareIcons/ShareIcons'
import Button from '../../Button'
import RecipeReviews from '../../Reviews/RecipeReviews'
import { AiOutlinePrinter } from 'react-icons/ai'
import styles from './RecipeFooter.module.scss'
import { RecipePropType } from '@components/PropTypes/PropTypes'

interface RecipeFooterProps extends RecipePropType {
  iconRef: RefCallback<HTMLDivElement>
}

const RecipeFooter = ({ recipe, iconRef }: RecipeFooterProps) => {
  const router = useRouter()

  return (
    <div>
      <div className={styles.print}>
        <Link passHref href={`${router.asPath}/print`} target="_blank" prefetch={false}>
          <Button type="button" className={styles.print__button}>
            <AiOutlinePrinter className={styles.icon} />
            Print recipe
          </Button>
        </Link>
      </div>
      <ShareIcons
        iconRef={iconRef}
        postImage={recipe.fields.image}
        postName={recipe.fields.title}
      />
      {recipe?.fields?.tag && <PostTags tags={recipe.fields.tag} />}
      <RecipeReviews slug={recipe.fields.slug} />
    </div>
  )
}

export default RecipeFooter
