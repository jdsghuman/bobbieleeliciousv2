import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import VideoDetail from '../../VideoDetail/VideoDetail'
import PostTags from '../../PostTags'
import ShareIcons from '../../SocialMedia/ShareIcons/ShareIcons'
import { RecipePropType } from '../../PropTypes/PropTypes'
import Signature from '../../Signature'
import ShareIconItem from '../../SocialMedia/ShareIcons/ShareIconItem'
import Button from '../../Button'
import RecipeReviews from '../../Reviews/RecipeReviews'
import styles from './RecipeDescription.module.scss'
import { loadPolyfills } from '../../Util/polyfills'
import { AiOutlinePrinter } from 'react-icons/ai'

const cx = classNames.bind(styles)

const RecipeDescription = ({ recipe }: RecipePropType) => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const observer = useRef<any>()

  const callbackFunction = (entries) => {
    const [entry] = entries
    setIsVisible(entry.isIntersecting || entry.boundingClientRect.top < 400)
  }
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
  }

  const iconRef = useCallback(
    async (node) => {
      await loadPolyfills()
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(callbackFunction, options)
      if (node) observer.current.observe(node)
    },
    [isVisible]
  )

  return (
    <div className={styles.container}>
      <div
        className={cx('share', {
          'share--hide': isVisible,
        })}
      >
        <ShareIconItem
          className={'container__share__side'}
          postImage={recipe.fields.image}
          postName={recipe.fields.title}
          iconSize={'3rem'}
        />
      </div>
      <ReactMarkdown
        linkTarget="_blank"
        className={styles.markdown}
        source={recipe.fields.description}
      />
      {recipe?.fields?.youtubeLink && (
        <div className={cx('markdown', 'markdown__video')}>
          <VideoDetail url={recipe.fields.youtubeLink} />
        </div>
      )}
      <Signature author={recipe.fields.author[0].fields.name} />
      {recipe?.fields?.recipeNotes && (
        <div className={cx('markdown', 'markdown__notes')}>
          <span className={styles.markdown__notes__description}>Notes: </span>
          {recipe.fields.recipeNotes}
        </div>
      )}
      {recipe?.fields?.tools && (
        <div className={cx('markdown', 'markdown__tools')}>
          <span className={styles.markdown__notes__description}>Tools: </span>
          <ReactMarkdown>{recipe.fields.tools}</ReactMarkdown>
        </div>
      )}
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

export default RecipeDescription
