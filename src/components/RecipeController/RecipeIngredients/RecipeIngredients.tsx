/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import classNames from 'classnames/bind'
import styles from './RecipeIngredients.module.scss'

const cx = classNames.bind(styles)

interface RecipeIngredientsPropTypes {
  ingredients: {
    value: string
    isActive: boolean
  }[]
  selectIngredient: (i: number) => void
}

const RecipeIngredients = ({ ingredients, selectIngredient }: RecipeIngredientsPropTypes) => {
  const displayIngredientList = () => {
    return ingredients && ingredients.length > 0 ? (
      ingredients.map((ingredient, i) => {
        return ingredient.value.includes('*') ? (
          <p className={cx('subtitle', 'unselectable')} key={i}>
            {ingredient.value.substr(1)}
          </p>
        ) : (
          <li
            className={cx('list', 'unselectable', {
              active: ingredient.isActive,
            })}
            onClick={() => selectIngredient(i)}
            key={i}
          >
            {ingredient.value}
          </li>
        )
      })
    ) : (
      <h3 className={styles.error}>Ingredients unavailable</h3>
    )
  }

  return (
    <div className={styles.container}>
      <ul>{displayIngredientList()}</ul>
    </div>
  )
}

export default RecipeIngredients
