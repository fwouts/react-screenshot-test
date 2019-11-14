import React from "react";
import styles from "./css-modules.module.css";

export const CssModulesComponent = () => (
  <div className={styles.container}>
    <button className={styles.styledButton}>
      This component was styled with CSS modules
    </button>
  </div>
);
