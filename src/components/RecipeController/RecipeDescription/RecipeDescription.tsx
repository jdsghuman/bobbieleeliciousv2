import classNames from 'classnames/bind'
import ReactMarkdown from 'react-markdown'
import VideoDetail from '../../VideoDetail/VideoDetail'
import { RecipePropType } from '../../PropTypes/PropTypes'
import Signature from '../../Signature'
import ShareIconItem from '../../SocialMedia/ShareIcons/ShareIconItem'
import styles from './RecipeDescription.module.scss'

const cx = classNames.bind(styles)

interface RecipeDescriptionProps extends RecipePropType {
  footerShareVisible: boolean
}

const RecipeDescription = ({ recipe, footerShareVisible }: RecipeDescriptionProps) => {
  return (
    <div className={styles.container}>
      <div
        className={cx('share', {
          'share--hide': footerShareVisible,
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
    </div>
  )
}

export default RecipeDescription
