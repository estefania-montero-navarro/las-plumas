import React from "react";
import PropTypes from "prop-types";
import logo_pluma from "../../assets/logo_pluma.png";

function NotificationModal({ isOpen, toggleModal, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="confirmation-email-modal">
      <div className="confirmation-email-content">
        <span className="close" onClick={toggleModal}>
          &times;
        </span>

        <div className="confirmation-email-title">
          <h2 className="h2-confirmation-email">{title}</h2>
          <h3 className="h3-confirmation-email">{message}</h3>
        </div>

        <div className="home-background-confirmation">
          <img className="logo-pluma" src={logo_pluma}></img>
        </div>
      </div>
    </div>
  );
}

NotificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default NotificationModal;
