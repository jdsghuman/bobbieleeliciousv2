import { useState } from 'react'
import classNames from 'classnames/bind'
import styles from './RecipeTabs.module.scss'

const cx = classNames.bind(styles)

const RecipeTabs = () => {
  const [activeTab, setActiveTab] = useState('Details')
  return (
    <div className={styles.tab}>
      <div onClick={() => setActiveTab('Details')}>
        <h3
          className={cx('tab__title', {
            'tab__title--active': activeTab === 'Details',
          })}
        >
          Details
        </h3>
      </div>
      <div onClick={() => setActiveTab('Ingredients')}>
        <h3
          className={cx('tab__title', {
            'tab__title--active': activeTab === 'Ingredients',
          })}
        >
          Ingredients
        </h3>
      </div>
      <div onClick={() => setActiveTab('Directions')}>
        <h3
          className={cx('tab__title', {
            'tab__title--active': activeTab === 'Directions',
          })}
        >
          Directions
        </h3>
      </div>
    </div>
  )
}

export default RecipeTabs
