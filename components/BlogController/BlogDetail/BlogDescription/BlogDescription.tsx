import { useCallback, useRef, useState } from 'react'
import classNames from 'classnames/bind'
import ReactMarkdown from 'react-markdown'
import AuthorItem from '../../../Author/AuthorItem'
import { BlogPropType } from '../../../PropTypes/PropTypes'
import PostTags from '../../../PostTags/PostTags'
import ShareIconItem from '../../../SocialMedia/ShareIcons/ShareIconItem'
import Button from '../../../Button/Button'
import DisqusComments from '../../../DisqusComments/DisqusComments'
import Icon from '../../../Icon/Icon'
import styles from './BlogDescription.module.scss'
import Signature from '../../../Signature/Signature'

const cx = classNames.bind(styles)

const BlogDescription = ({ blog }: BlogPropType) => {
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
      <div className={styles.button__comment__container}>
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
      {showComments && <DisqusComments post={blog} />}
    </div>
  )
}

export default BlogDescription
