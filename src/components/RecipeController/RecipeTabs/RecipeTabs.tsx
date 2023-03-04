import classNames from 'classnames/bind'
// import { MdOutlineTimer } from 'react-icons/md'

import styles from './RecipeTabs.module.scss'

const cx = classNames.bind(styles)

interface RecipeTabsPropTypes {
  activeTab: string
  setTab: (tab: string) => void
}

const RecipeTabs = ({ activeTab, setTab }: RecipeTabsPropTypes) => {
  return (
    <div
      className={styles.tab}
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <div onClick={() => setTab('Details')}>
        <button className={styles.tab__title__btn}>
          <h3
            className={cx('tab__title', {
              'tab__title--active': activeTab === 'Details',
            })}
          >
            Details
          </h3>
        </button>
      </div>
      <div onClick={() => setTab('Ingredients')}>
        <button className={styles.tab__title__btn}>
          <h3
            className={cx('tab__title', {
              'tab__title--active': activeTab === 'Ingredients',
            })}
          >
            Ingredients
          </h3>
        </button>
      </div>
      <div onClick={() => setTab('Directions')}>
        <button className={styles.tab__title__btn}>
          <h3
            className={cx('tab__title', {
              'tab__title--active': activeTab === 'Directions',
            })}
          >
            Directions
          </h3>
        </button>
      </div>
    </div>
  )
}

export default RecipeTabs
