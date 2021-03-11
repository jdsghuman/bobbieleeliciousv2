import Icon from '../../Icon/Icon'
import styles from './RecipeData.module.scss'

const RecipeData = ({ cooktime, prep, servings }) => {
  return (
    <div className={styles.container}>
      <div className={styles.container__icon}>
        <p className={styles.icon__title}>Prep</p>
        <Icon identifier="rollingpin" viewBox="0 0 45 25" dimensions={{ height: 23, width: 22 }} />
        <p className={styles.icon__details}>{prep}</p>
      </div>
      <div className={styles.container__icon}>
        <p className={styles.icon__title}>Cook Time</p>
        <Icon identifier="clock" viewBox="0 0 74 45" dimensions={{ height: 23, width: 22 }} />
        <p className={styles.icon__details}>{cooktime}</p>
      </div>
      <div className={styles.container__icon}>
        <p className={styles.icon__title}>Servings</p>
        <Icon identifier="user" viewBox="0 0 300 200" dimensions={{ height: 22, width: 15 }} />
        <p className={styles.icon__details}>{servings}</p>
      </div>
    </div>
  )
}

export default RecipeData
