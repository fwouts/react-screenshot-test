import React from "react";
import styles from "./css-modules-red.module.css";

export const CssModulesRedComponent = () => (
  <div className={styles.container}>
    <button className={styles.styledButton}>
      This component was styled with CSS modules
    </button>
  </div>
);
