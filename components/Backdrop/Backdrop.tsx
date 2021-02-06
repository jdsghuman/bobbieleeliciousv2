import styles from './Backdrop.module.scss';

const Backdrop = ({ click }) => (
  <div className={styles.backdrop} onClick={click} />
);

export default Backdrop;
