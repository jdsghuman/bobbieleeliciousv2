import Button from '../Button/Button'
import styles from "./Banner.module.scss";

const SubscribeBanner = () => {
  return (
    <div className={styles.banner}>
      <div className={styles["banner__bg-banner"]} />
      <div>
        <input type="text" />
        <p>Subscribe to receive updates!</p>
        <Button
        className={styles.banner__button}
        type={'button'}
        accent
        >
          Subscribe
          </Button>
      </div>
    </div>
  );
};

export default SubscribeBanner;
