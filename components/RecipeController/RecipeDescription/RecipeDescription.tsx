import classNames from 'classnames/bind'
import ReactMarkdown from 'react-markdown'
import VideoDetail from '../../VideoDetail/VideoDetail'
import PostTags from '../../PostTags/PostTags'
import ShareIcons from '../../SocialMedia/ShareIcons/ShareIcons'
import { RecipePropType } from '../../PropTypes/PropTypes'
import styles from './RecipeDescription.module.scss'

const cx = classNames.bind(styles)

const RecipeDescription = ({ recipe }: RecipePropType) => {
  return (
    <div className={styles.container}>
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
      <ShareIcons postImage={recipe.fields.image} postName={recipe.fields.title} />
      {recipe?.fields?.tag && <PostTags tags={recipe.fields.tag} />}
    </div>
  )
}

export default RecipeDescription
