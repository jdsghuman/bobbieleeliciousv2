import { useEffect, useState } from 'react'
import { BlogsPropType, RecipesPropType } from '../PropTypes/PropTypes'
import Spinner from '../Spinner/Spinner'
import styles from './FacebookComments.module.scss'

interface CommentsPropType {
  post: BlogsPropType | RecipesPropType
}

const FacebookComments = ({ post }: CommentsPropType) => {
  const [showSpinner, setShowSpinner] = useState(true)
  const postType = post.sys.contentType.sys.id === 'recipe' ? 'recipe' : 'blog'

  console.log('render CommentsFacebook')

  useEffect(() => {
    console.log('load facebook script')
    const facebookScript = document.createElement('script')
    facebookScript.async = true
    facebookScript.src = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v7.0&appId=${process.env.FACEBOOK_APP_ID}&autoLogAppEvents=1`
    document.body.appendChild(facebookScript)
    setShowSpinner(false)
  }, [])

  useEffect(() => {
    FB.init({
      appId: process.env.FACEBOOK_APP_ID,
      xfbml: true,
      version: 'v2.6',
    })
    FB.XFBML.parse()
  }, [])

  return (
    <div className={styles.container}>
      {showSpinner && (
        <div>
          <Spinner />
        </div>
      )}
      <div id="fb-root"></div>
      <div
        className="fb-comments"
        data-href={`https://bobbieleelicious.com/${postType}/${post.fields.slug}`}
        data-numposts="10"
        data-mobile="true"
      ></div>
    </div>
  )
}

export default FacebookComments
