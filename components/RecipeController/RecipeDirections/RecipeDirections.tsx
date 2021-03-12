/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import styles from './RecipeDirections.module.scss'

const cx = classNames.bind(styles)

const RecipeDirections = ({ directions }) => {
  const [directionList, setDirectionList] = useState([])

  const getDirections = () => {
    if (directions) {
      const directionsArray = directions.split('--')
      setDirectionList(directionsArray)
    }
  }

  const selectDirection = (event) => event.target.classList.toggle(styles.active)

  const displayDirectionsList = () => {
    return directionList && directionList.length ? (
      directionList.map((direction, i) => {
        return direction.includes('*') ? (
          <h3 key={i} className={cx('reset', 'unselectable')}>
            {direction.substr(1)}
          </h3>
        ) : (
          <p key={i} onClick={selectDirection} className={cx('list', 'unselectable')}>
            {direction}
          </p>
        )
      })
    ) : (
      <h3 className={styles.error}>Directions unavailable</h3>
    )
  }

  useEffect(() => {
    getDirections()
  }, [directions])

  return (
    <div className={styles.container}>
      <div className={styles.container__directions}>{displayDirectionsList()}</div>
    </div>
  )
}
export default RecipeDirections
