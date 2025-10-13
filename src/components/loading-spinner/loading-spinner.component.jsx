import "./loading-spinner.component.scss";
import { CircleNotch } from "@phosphor-icons/react";
import PropTypes from "prop-types";

export default function LoadingSpinner({ message = "Carregando..." }) {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner-content">
        <CircleNotch size={64} weight="bold" className="spinner-icon" />
        <p>{message}</p>
      </div>
    </div>
  );
}

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};
