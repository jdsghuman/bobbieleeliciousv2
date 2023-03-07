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
import styles from './BlogDescription.module.scss'
import Signature from '../../../Signature'
import { loadPolyfills } from '../../../Util/polyfills'
import { BiCommentDetail } from 'react-icons/bi'

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
      await loadPolyfills()
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(callbackFunction, options)
      if (node) observer.current.observe(node)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isVisible]
  )

  useEffect(() => {
    if (showComments) {
      setShowComments(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <BiCommentDetail className={styles.icon} />
          {!showComments ? 'Show' : 'Hide'} comments
        </Button>
      </div>
      {showComments && <FacebookComments post={blog} />}
    </div>
  )
}

export default BlogDescription
