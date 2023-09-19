import React from "react";

import AlertIcon from "../assets/images/AlertIcon";
import styles from "../styles";

const Alert = ({ type, message }) => (
  <div
    className={`fixed z-50 top-20 left-0 right-0 flex items-center justify-center `}
  >
    <div className={`p-4 rounded-lg font-rajdhani font-semibold text-lg ${styles[type]}`} role="alert">
      <AlertIcon type={type} /> {message}
    </div>
  </div>
);

export default Alert;
