/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import classNames from 'classnames/bind'
import { IoIosSquareOutline, IoIosCheckboxOutline } from 'react-icons/io'
import Realistic from 'react-canvas-confetti/dist/presets/fireworks'
import ProgressBar from '@components/ProgressBar/ProgressBar'

import styles from './RecipeDirections.module.scss'

const cx = classNames.bind(styles)

interface RecipeDirectionsPropTypes {
  directions: {
    value: string
    isActive: boolean
  }[]
  selectDirection: (i: number) => void
  finished: boolean
  setFinished: (i: boolean) => void
}

const RecipeDirections = ({
  directions,
  selectDirection,
  finished,
  setFinished,
}: RecipeDirectionsPropTypes) => {
  const totalCount = directions.filter((direction) => !direction.value.includes('*')).length
  const completed = directions.filter((direction) => direction.isActive !== false).length
  const progress = Math.ceil((completed / totalCount) * 100)

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
            <span>
              {direction.isActive ? (
                <IoIosCheckboxOutline className={styles.list__icon} />
              ) : (
                <IoIosSquareOutline className={styles.list__icon} />
              )}
            </span>
            <span className={styles.number}>{direction.value}</span>
          </p>
        )
      })
    ) : (
      <h3 className={styles.error}>Directions unavailable</h3>
    )
  }

  const callAfterConfetti = () => {
    setTimeout(() => {
      setFinished(true)
    }, 2000)
  }
  return (
    <div className={styles.container}>
      <ProgressBar progress={progress} location={'top'} />
      {progress === 100 && finished === false && (
        <Realistic autorun={{ speed: 3, duration: 800 }} onInit={callAfterConfetti} />
      )}

      <div className={styles.container__directions}>{displayDirectionsList()}</div>
      <ProgressBar progress={progress} location="bottom" />
    </div>
  )
}
export default RecipeDirections
