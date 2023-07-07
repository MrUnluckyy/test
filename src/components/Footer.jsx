import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  const date = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        &copy; Copyright {date} by WorldWise inc.
      </p>
    </footer>
  );
}
