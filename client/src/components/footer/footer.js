import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhone,
  faAt,
  faCopyright,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faWhatsapp,
  faFacebook,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer>
      <div className="footer-section">
        <h2 className="footer-section1">Las Plumas Hotel</h2>
        <p className="p-footer">
          <FontAwesomeIcon
            className="footer-icon mr-2"
            icon={faLocationDot}
          ></FontAwesomeIcon>
          Puntaneras, Costa Rica <br /> Bahía Drake, 300 meters from Colorada{" "}
          <br /> 60503
        </p>
      </div>
      <div className="footer-section">
        <h2 className="footer-section2">Contact Us</h2>
        <p className="p-footer">
          <FontAwesomeIcon
            className="footer-icon-text"
            icon={faPhone}
          ></FontAwesomeIcon>
          +506 2200-2200 <br />
          <FontAwesomeIcon
            className="footer-icon-text"
            icon={faWhatsapp}
          ></FontAwesomeIcon>
          +506 7252-0010 <br />
          <FontAwesomeIcon
            className="footer-icon-text"
            icon={faAt}
          ></FontAwesomeIcon>
          contacto@lasplumas.com
        </p>
      </div>
      <div className="footer-section">
        <h2 className="footer-section3"></h2>
        <Link to="/additionalInfo">
          <FontAwesomeIcon className="footer-icons" icon={faInstagram} />
        </Link>
        <Link to="/additionalInfo">
          <FontAwesomeIcon className="footer-icons" icon={faFacebook} />
        </Link>
        <Link to="/additionalInfo">
          <FontAwesomeIcon className="footer-icons" icon={faYoutube} />
        </Link>
        <Link to="/additionalInfo">
          <FontAwesomeIcon className="footer-icons" icon={faTwitter} />
        </Link>
        <p className="p-footer" id="footer-privacy">
          Privacy policy <br /> 2024{" "}
          <FontAwesomeIcon
            className="footer-icon-text"
            icon={faCopyright}
          ></FontAwesomeIcon>{" "}
          all rights reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;
