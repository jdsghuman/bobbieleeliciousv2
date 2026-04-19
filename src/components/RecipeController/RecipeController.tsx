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

  const parseList = (str: string | undefined) =>
    str ? str.split('--').map((value) => ({ value, isActive: false })) : []

  const [isTop, setIsTop] = useState(true)
  const [directionList, setDirectionList] = useState(() => parseList(post.fields.recipeDirections))
  const [ingredientList, setIngredientList] = useState(() => parseList(post.fields.ingredients))
  const [finished, setFinished] = useState<boolean>(false)
  const [footerShareVisible, setFooterShareVisible] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)

  const iconRef = useCallback(async (node: HTMLDivElement | null) => {
    if (observer.current) {
      observer.current.disconnect()
      observer.current = null
    }
    if (!node) return
    await loadPolyfills()
    observer.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setFooterShareVisible(entry.isIntersecting || entry.boundingClientRect.top < 400)
      },
      { root: null, rootMargin: '0px', threshold: 1.0 }
    )
    observer.current.observe(node)
  }, [])

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect()
        observer.current = null
      }
    }
  }, [])

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
    setDirectionList(parseList(post.fields.recipeDirections))
    setIngredientList(parseList(post.fields.ingredients))
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
