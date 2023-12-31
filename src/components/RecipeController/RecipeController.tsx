import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import debounce from 'lodash.debounce'
import classNames from 'classnames/bind'
import smoothscroll from 'smoothscroll-polyfill'
import RecipeData from './RecipeData'
import RecipeTabs from './RecipeTabs'
import styles from './RecipeController.module.scss'
import RecipeDescription from './RecipeDescription'
import RecipeIngredients from './RecipeIngredients'
import RecipeDirections from './RecipeDirections'

const cx = classNames.bind(styles)

const RecipeController = ({ post }) => {
  const router = useRouter()

  const [isTop, setIsTop] = useState(true)
  const [activeTab, setActiveTab] = useState('Details')
  const [directionList, setDirectionList] = useState<{ value: string; isActive: boolean }[]>([])
  const [ingredientList, setIngredientList] = useState<{ value: string; isActive: boolean }[]>([])

  const getIngredients = (ingredients) => {
    if (ingredients) {
      const ingredientsArray = ingredients.split('--').map((item) => {
        return {
          value: item,
          isActive: false,
        }
      })
      setIngredientList(ingredientsArray)
    }
  }

  const getDirections = (directions) => {
    if (directions) {
      const directionsArray = directions.split('--').map((item) => {
        return {
          value: item,
          isActive: false,
        }
      })
      setDirectionList(directionsArray)
    }
  }

  const selectIngredient = (i: number) => {
    const newIngredientList = [...ingredientList]
    newIngredientList[i].isActive = !newIngredientList[i].isActive
    setIngredientList(newIngredientList)
  }

  const selectDirection = (i: number) => {
    const newDirectionList = [...directionList]
    newDirectionList[i].isActive = !newDirectionList[i].isActive
    setDirectionList(newDirectionList)
  }

  const handleScroll = () => {
    document.getElementById('details__hr')?.scrollIntoView({
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
    setActiveTab('Details')
  }, [router.asPath])

  useEffect(() => {
    getDirections(post.fields.recipeDirections)
    getIngredients(post.fields.ingredients)
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
      {activeTab === 'Ingredients' && (
        <RecipeIngredients ingredients={ingredientList} selectIngredient={selectIngredient} />
      )}
      {activeTab === 'Directions' && (
        <RecipeDirections directions={directionList} selectDirection={selectDirection} />
      )}
    </div>
  )
}

export default RecipeController
