import Button from "../Button/Button";
import styles from "./Banner.module.scss";

const SubscribeBanner = () => {
  return (
    <div className={styles.banner}>
      <div className={styles["banner__bg-banner"]} />
      <div className={styles.banner__container}>
        <p className={styles.banner__text}>Subscribe to receive updates!</p>
        <div className={styles.form}>
          <input
            id="email"
            name="email"
            placeholder="Email"
            className={styles.form__field}
            type="email"
            required
          />
          <label className={styles.form__label} htmlFor="email">
            Email
          </label>
          <Button className={styles.banner__button} type={"button"} accent>
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscribeBanner;
