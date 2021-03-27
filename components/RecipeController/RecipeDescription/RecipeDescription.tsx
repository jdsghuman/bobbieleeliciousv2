import { useCallback, useRef, useState } from 'react'
import classNames from 'classnames/bind'
import ReactMarkdown from 'react-markdown'
import VideoDetail from '../../VideoDetail/VideoDetail'
import PostTags from '../../PostTags/PostTags'
import ShareIcons from '../../SocialMedia/ShareIcons/ShareIcons'
import { RecipePropType } from '../../PropTypes/PropTypes'
import Signature from '../../Signature/Signature'
import ShareIconItem from '../../SocialMedia/ShareIcons/ShareIconItem'
import styles from './RecipeDescription.module.scss'

const cx = classNames.bind(styles)

const RecipeDescription = ({ recipe }: RecipePropType) => {
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
      {recipe?.fields?.recipeNotes && (
        <p className={cx('markdown', 'markdown__notes')}>
          <span className={styles.markdown__notes__description}>Notes: </span>
          {recipe.fields.recipeNotes}
        </p>
      )}
      {recipe?.fields?.tools && (
        <p className={cx('markdown', 'markdown__tools')}>
          <span className={styles.markdown__notes__description}>Tools: </span>
          <ReactMarkdown>{recipe.fields.tools}</ReactMarkdown>
        </p>
      )}
      <Signature author={recipe.fields.author[0].fields.name} />
      <ShareIcons
        iconRef={iconRef}
        postImage={recipe.fields.image}
        postName={recipe.fields.title}
      />
      {recipe?.fields?.tag && <PostTags tags={recipe.fields.tag} />}
    </div>
  )
}

export default RecipeDescription
