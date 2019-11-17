import React from "react";
import styles from "./css-modules-green.module.css";

export const CssModulesGreenComponent = () => (
  <div className={styles.container}>
    <button className={styles.styledButton}>
      This component was styled with CSS modules
    </button>
  </div>
);
