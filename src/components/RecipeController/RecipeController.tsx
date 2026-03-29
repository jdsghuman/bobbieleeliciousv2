import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import debounce from 'lodash.debounce'
import classNames from 'classnames/bind'
import smoothscroll from 'smoothscroll-polyfill'
import RecipeData from './RecipeData'
import styles from './RecipeController.module.scss'
import RecipeDescription from './RecipeDescription'
import RecipeIngredients from './RecipeIngredients'
import RecipeDirections from './RecipeDirections'
import RecipeFooter from './RecipeFooter'
import { loadPolyfills } from '../Util/polyfills'

const cx = classNames.bind(styles)

const RecipeController = ({ post }) => {
  const router = useRouter()

  const [isTop, setIsTop] = useState(true)
  const [directionList, setDirectionList] = useState<{ value: string; isActive: boolean }[]>([])
  const [ingredientList, setIngredientList] = useState<{ value: string; isActive: boolean }[]>([])
  const [finished, setFinished] = useState<boolean>(false)
  const [footerShareVisible, setFooterShareVisible] = useState(false)
  const observer = useRef<any>()

  const iconRef = useCallback(async (node) => {
    await loadPolyfills()
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setFooterShareVisible(entry.isIntersecting || entry.boundingClientRect.top < 400)
      },
      { root: null, rootMargin: '0px', threshold: 1.0 }
    )
    if (node) observer.current.observe(node)
  }, [])

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

  useEffect(() => {
    setFinished(false)
    getDirections(post.fields.recipeDirections)
    getIngredients(post.fields.ingredients)
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
      <RecipeDescription recipe={post} footerShareVisible={footerShareVisible} />

      <RecipeIngredients ingredients={ingredientList} selectIngredient={selectIngredient} />

      <RecipeDirections
        finished={finished}
        setFinished={setFinished}
        directions={directionList}
        selectDirection={selectDirection}
      />
      <RecipeFooter recipe={post} iconRef={iconRef} />
    </div>
  )
}

export default RecipeController
