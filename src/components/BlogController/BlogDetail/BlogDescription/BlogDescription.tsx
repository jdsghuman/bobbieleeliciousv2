import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import ReactMarkdown from 'react-markdown'
import AuthorItem from '../../../Author'
import { BlogPropType } from '../../../PropTypes/PropTypes'
import PostTags from '../../../PostTags'
import ShareIconItem from '../../../SocialMedia/ShareIcons/ShareIconItem'
import Button from '../../../Button'
import FacebookComments from '../../../Comments/FacebookComments'
import Icon from '../../../Icon/Icon'
import styles from './BlogDescription.module.scss'
import Signature from '../../../Signature'

const cx = classNames.bind(styles)

const BlogDescription = ({ blog }: BlogPropType) => {
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
          postImage={blog.fields.image}
          postName={blog.fields.title}
          iconSize={'3rem'}
        />
      </div>
      <ReactMarkdown
        linkTarget="_blank"
        className={styles.markdown}
        source={blog.fields.description}
      />
      <Signature author={blog.fields.author.fields.name} />
      <div className={styles['container--blog--icons']}>
        <AuthorItem blog={blog} />
        <ShareIconItem
          iconRef={iconRef}
          postImage={blog.fields.image}
          postName={blog.fields.title}
        />
      </div>
      {blog?.fields?.tag && <PostTags tags={blog.fields.tag} />}
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
      {showComments && <FacebookComments post={blog} />}
    </div>
  )
}

export default BlogDescription
