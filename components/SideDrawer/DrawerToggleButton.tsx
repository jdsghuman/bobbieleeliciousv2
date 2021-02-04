import styles from "./DrawerToggleButton.module.scss";

const DrawerToggleButton = ({ click, show }) => (
  <button className={styles.toggle} onClick={click}>
    <div id={styles.nav__icon} className={`${show ? "open" : null}`} onClick={click}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </button>

  // <button className="toggle-button" onClick={click}>
  //   <div id="nav-icon3" className={`${show ? 'open' : null}`} onClick={click}>
  //     <span></span>
  //     <span></span>
  //     <span></span>
  //     <span></span>
  //   </div>
  // </button>
);

export default DrawerToggleButton;
