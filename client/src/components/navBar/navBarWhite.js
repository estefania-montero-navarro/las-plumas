import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../contexts/authContext";
import NotificationWithAction from "../notificationWithAction/notificacionWithAction";

function NavBarWhite({
  openEmployeeModal: openEmployeeModal,
  openClientModal: openClientModal,
  openAdminModal: openAdminModal,
}) {
  const navigation = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, getSessionStatus } = useContext(AuthContext);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  const handleUserIconClick = async (e) => {
    e.preventDefault(); // Prevent default Link behavior
    const sessionStatus = await getSessionStatus();
    if (sessionStatus === 200) {
      const role = user.role;
      if (role === "employee") {
        openEmployeeModal(); // Call the openModal function passed as props
      } else if (role === "client") {
        openClientModal();
      } else if (role === "administrator") {
        openAdminModal();
      }
    } else {
      toggleNotification();
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={`nav-bar ${menuOpen ? "open" : ""}`}>
      <NotificationWithAction
        isOpen={notificationOpen}
        toggleModal={toggleNotification}
        message="Session not active, please log in"
        action={() => navigation("/login")}
        actionMessage={"Log in"}
      />

      <div className="menu-icon" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <div className="links bg-[#33665B] rounded-l-lg shadow-lg opacity-80 h-full">
        <Link
          className={`link-white ${
            location.pathname === "/home" ? "active" : ""
          }`}
          to="/home"
        >
          <p className="font-roboto uppercase text-white">Home</p>
        </Link>
        <Link
          className={`link-white ${
            location.pathname === "/information" ? "active" : ""
          }`}
          to="/information"
        >
          <p className="font-roboto uppercase text-white">Information</p>
        </Link>
        <Link
          className={`link-white ${
            location.pathname === "/amenities" ? "active" : ""
          }`}
          to="/amenities"
        >
          <p className="font-roboto uppercase text-white">Amenities</p>
        </Link>
        <Link
          className={`link-white ${
            location.pathname === "/rooms" ? "active" : ""
          }`}
          to="/rooms"
        >
          <p className="font-roboto uppercase text-white">Rooms</p>{" "}
        </Link>
        <Link
          className={`link-white ${
            location.pathname === "/contact" ? "active" : ""
          }`}
          to="/contact"
        >
          <p className="font-roboto uppercase text-white">Contact</p>
        </Link>
        <Link
          className={`link-white ${
            location.pathname === "/login" ? "active" : ""
          }`}
          to="/login"
        >
          <p className="font-roboto uppercase text-white">Log-in</p>
        </Link>
        <Link
          className={`link-white ${location.pathname === "/" ? "active" : ""}`}
          to="/"
          onClick={handleUserIconClick}
        >
          <FontAwesomeIcon className="user_icon-white" icon={faCircleUser} />
        </Link>
      </div>
    </div>
  );
}

NavBarWhite.propTypes = {
  openEmployeeModal: PropTypes.func,
  openClientModal: PropTypes.func,
  openAdminModal: PropTypes.func,
};

export default NavBarWhite;
