import classNames from 'classnames/bind'
import styles from './RecipeTabs.module.scss'

const cx = classNames.bind(styles)

interface RecipeTabsPropTypes {
  activeTab: string
  setTab: (tab: string) => void
}

const RecipeTabs = ({ activeTab, setTab }: RecipeTabsPropTypes) => {
  return (
    <div className={styles.tab}>
      <div onClick={() => setTab('Details')}>
        <h3
          className={cx('tab__title', {
            'tab__title--active': activeTab === 'Details',
          })}
        >
          Details
        </h3>
      </div>
      <div onClick={() => setTab('Ingredients')}>
        <h3
          className={cx('tab__title', {
            'tab__title--active': activeTab === 'Ingredients',
          })}
        >
          Ingredients
        </h3>
      </div>
      <div onClick={() => setTab('Directions')}>
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
