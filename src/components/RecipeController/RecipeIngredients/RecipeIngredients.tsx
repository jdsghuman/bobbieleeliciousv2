/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import styles from './RecipeIngredients.module.scss'

const cx = classNames.bind(styles)

interface RecipeIngredientsPropTypes {
  ingredients: string
}
const RecipeIngredients = ({ ingredients }: RecipeIngredientsPropTypes) => {
  const [ingredientList, setIngredientList] = useState([])

  const getIngredients = () => {
    if (ingredients) {
      const ingredientsArray = ingredients.split('--')
      setIngredientList(ingredientsArray)
    }
  }

  const selectIngredient = (event) => event.target.classList.toggle(styles.active)

  const displayIngredientList = () => {
    return ingredientList && ingredientList.length > 0 ? (
      ingredientList.map((ing, i) => {
        return ing.includes('*') ? (
          <p className={cx('subtitle', 'unselectable')} key={i}>
            {ing.substr(1)}
          </p>
        ) : (
          <li className={cx('list', 'unselectable')} onClick={selectIngredient} key={i}>
            {ing}
          </li>
        )
      })
    ) : (
      <h3 className={styles.error}>Ingredients unavailable</h3>
    )
  }

  useEffect(() => {
    getIngredients()
  }, [ingredients])

  return (
    <div className={styles.container}>
      <ul>{displayIngredientList()}</ul>
    </div>
  )
}

export default RecipeIngredients
