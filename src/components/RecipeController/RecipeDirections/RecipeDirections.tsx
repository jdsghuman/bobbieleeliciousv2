/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import classNames from 'classnames/bind'
import styles from './RecipeDirections.module.scss'

const cx = classNames.bind(styles)

interface RecipeDirectionsPropTypes {
  directions: {
    value: string
    isActive: boolean
  }[]
  selectDirection: (i: number) => void
}

const RecipeDirections = ({ directions, selectDirection }: RecipeDirectionsPropTypes) => {
  const displayDirectionsList = () => {
    return directions && directions.length ? (
      directions.map((direction, i) => {
        return direction.value.includes('*') ? (
          <h3 key={i} className={cx('reset', 'unselectable')}>
            {direction.value.substr(1)}
          </h3>
        ) : (
          <p
            key={i}
            onClick={() => selectDirection(i)}
            className={cx('list', 'unselectable', {
              active: direction.isActive,
            })}
          >
            {direction.value}
          </p>
        )
      })
    ) : (
      <h3 className={styles.error}>Directions unavailable</h3>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.container__directions}>{displayDirectionsList()}</div>
    </div>
  )
}
export default RecipeDirections
