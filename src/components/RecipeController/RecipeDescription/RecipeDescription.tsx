import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import ReactMarkdown from 'react-markdown'
import VideoDetail from '../../VideoDetail/VideoDetail'
import PostTags from '../../PostTags'
import ShareIcons from '../../SocialMedia/ShareIcons/ShareIcons'
import { RecipePropType } from '../../PropTypes/PropTypes'
import Signature from '../../Signature'
import ShareIconItem from '../../SocialMedia/ShareIcons/ShareIconItem'
import Button from '../../Button'
import FacebookComments from '../../Comments/FacebookComments'
import Icon from '../../Icon/Icon'
import styles from './RecipeDescription.module.scss'

const cx = classNames.bind(styles)

const RecipeDescription = ({ recipe }: RecipePropType) => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [showComments, setShowComments] = useState(false)
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
      await initializeObserver()
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(callbackFunction, options)
      if (node) observer.current.observe(node)
    },
    [isVisible]
  )

  async function initializeObserver() {
    if (!('IntersectionObserver' in window)) {
      //     // This is specifically for Safari - Polyfill
      await import('intersection-observer')
    }
  }

  useEffect(() => {
    if (showComments) {
      setShowComments(false)
    }
  }, [router.asPath])

  useEffect(() => {
    setShowComments(false)
  }, [])

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
      <ShareIcons
        iconRef={iconRef}
        postImage={recipe.fields.image}
        postName={recipe.fields.title}
      />
      {recipe?.fields?.tag && <PostTags tags={recipe.fields.tag} />}
      <div
        className={cx('button__comment__container', {
          'button__comment__container--hide': showComments,
        })}
      >
        <Button
          className={styles.button__comment}
          type="button"
          onClick={() => setShowComments(!showComments)}
          accent
        >
          {!showComments ? 'Show' : 'Hide'} Comments
          <Icon
            identifier="comment"
            viewBox="0 0 24 24"
            dimensions={{ height: 22, width: 22 }}
            fill={'#333333'}
            className={styles.icon__comment}
          />
        </Button>
      </div>
      {showComments && <FacebookComments post={recipe} />}
    </div>
  )
}

export default RecipeDescription
