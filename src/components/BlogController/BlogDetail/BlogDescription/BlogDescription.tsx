import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import ReactMarkdown from 'react-markdown'
import AuthorItem from '../../../Author'
import { BlogPropType } from '../../../PropTypes/PropTypes'
import PostTags from '../../../PostTags'
import ShareIconItem from '../../../SocialMedia/ShareIcons/ShareIconItem'
import BlogComments from '../../../Comments/BlogComments'
import styles from './BlogDescription.module.scss'
import Signature from '../../../Signature'
import { loadPolyfills } from '../../../Util/polyfills'

const cx = classNames.bind(styles)

const BlogDescription = ({ blog }: BlogPropType) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <BlogComments slug={blog.fields.slug} />
    </div>
  )
}

export default BlogDescription
