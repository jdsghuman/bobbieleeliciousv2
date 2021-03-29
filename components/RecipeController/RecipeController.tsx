import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import debounce from 'lodash.debounce'
import classNames from 'classnames/bind'
import smoothscroll from 'smoothscroll-polyfill'
import RecipeData from './RecipeData/RecipeData'
import RecipeTabs from './RecipeTabs/RecipeTabs'
import styles from './RecipeController.module.scss'
import RecipeDescription from './RecipeDescription/RecipeDescription'
import RecipeIngredients from './RecipeIngredients/RecipeIngredients'
import RecipeDirections from './RecipeDirections/RecipeDirections'

const cx = classNames.bind(styles)

const RecipeController = ({ post }) => {
  const router = useRouter()

  const [isTop, setIsTop] = useState(true)
  const [activeTab, setActiveTab] = useState('Details')

  const handleScroll = () => {
    document.getElementById('details__hr').scrollIntoView({
      behavior: 'smooth',
    })
  }

  const scrollUp = () => {
    window.scrollY > 75 ? setIsTop(false) : setIsTop(true)
  }

  const setTab = (tab) => {
    setActiveTab(tab)
  }

  useEffect(() => {
    console.log('pathname changed')
    setActiveTab('Details')
  }, [router.asPath])

  useEffect(() => {
    window.scrollTo(0, 0)
    smoothscroll.polyfill()
    const checkScroll = debounce(() => scrollUp(), 100)
    window.addEventListener('scroll', checkScroll)
    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  return (
    <div
      className={cx('container', {
        'container--scrolled': !isTop,
      })}
    >
      <div onClick={handleScroll} id="details__hr" className={styles.details__hr} />
      <RecipeData
        cooktime={post.fields.cooktime}
        prep={post.fields.prep}
        servings={post.fields.servings}
      />
      <RecipeTabs activeTab={activeTab} setTab={setTab} />
      {activeTab === 'Details' && <RecipeDescription recipe={post} />}
      {activeTab === 'Ingredients' && <RecipeIngredients ingredients={post.fields.ingredients} />}
      {activeTab === 'Directions' && <RecipeDirections directions={post.fields.recipeDirections} />}
    </div>
  )
}

export default RecipeController
