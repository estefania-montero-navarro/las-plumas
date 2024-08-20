import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import { AuthContext } from "../../contexts/authContext";

function ProfileModalEmployee({ isOpen, toggleModal }) {
  if (!isOpen) return null;

  const { user } = useContext(AuthContext);
  const { name, email } = user;

  return (
    <div className="modal-profile">
      <div className="modal-content-profile">
        <span className="close" onClick={toggleModal}>
          &times;
        </span>
        <h2 className="h2-modal-profile">Hello, {name}</h2>
        <div className="contact-info-profile">
          <h3 className="h3-modal-profile">Contact information</h3>
          <p className="p-modal-profile">
            <FontAwesomeIcon
              className="modal-profile-icon-text"
              icon={faEnvelope}
            ></FontAwesomeIcon>
            {email} <br />
          </p>
          <a className="links-change-password" href="/changePassword1">
            Change Password
          </a>
        </div>
        <div>
          <Link to="/employee-booking">
            <a className="links-modal-profile">Reservations</a>
          </Link>

          <a className="links-modal-profile" href="/recepits">
            Receipts
          </a>
          <a className="links-modal-profile" href="/">
            Log Out
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProfileModalEmployee;
