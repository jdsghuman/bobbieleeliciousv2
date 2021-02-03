import Link from "next/link";
import classNames from "classnames/bind";
import styles from "./CarouselItem.module.scss";
import Button from "../../Button/Button";

const cx = classNames.bind(styles);

const CarouselItem = ({ imageDetails }) => {
  const truncateDescription = (description) => {
    return description && description.length > 154
      ? `${description.substring(0, 154)}...`
      : description;
  };

  return (
    <div className={styles.item__container}>
      <div className={styles.item}>
        <h3 className={styles.item__title}>{imageDetails.label}</h3>
        <p className={styles.item__description}>
          {truncateDescription(imageDetails.description)}
        </p>
        <Link
          href={`${imageDetails.type === "recipe" ? "/recipes" : "/blogs"}/${
            imageDetails.slug
          }`}
        >
          <a className={styles.item__button}>Read More</a>
        </Link>
      </div>
    </div>
  );
};

export default CarouselItem;
