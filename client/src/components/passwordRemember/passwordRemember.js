import React, { useState, useContext } from "react";
import "../../components/global.css";
import { useNavigate } from "react-router-dom";
import pass_remember from "../../assets/pass_remember.jpeg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../../contexts/authContext";
import RequestSender from "../../common/requestSender";
import Notification from "../notification/notification";

function PasswordRemember() {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [notificactionTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  const handleClose = () => {
    window.location.href = "/";
  };

  // Event handler
  // e is the event object
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Prevents page reload
  // login logic here
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setNotificationTitle("Error");
      setNotificationMessage("Please enter your email before proceeding.");
      toggleNotification();
      return;
    }
    const credentials = {
      email: email,
    };
    const requestSender = new RequestSender();
    requestSender
      .sendRequest("remember", "POST", credentials)
      .then((response) => {
        if (response.status === 202) {
          setNotificationTitle("Success");
          setNotificationMessage(
            "An email has been sent with password recovery instructions."
          );
          setNotificationOpen(true);
        } else {
          setNotificationTitle("Error");
          setNotificationMessage(
            "Failed to send password recovery email. Please try again."
          );
          toggleNotification();
        }
      })
      .catch((error) => {
        console.log("ERROR = ", error);
        setNotificationTitle("Error");
        setNotificationMessage(
          "An unexpected error occurred. Please try again."
        );
        toggleNotification();
      });
  };

  return (
    <div className="login-div">
      <Notification
        isOpen={notificationOpen}
        toggleModal={toggleNotification}
        title={notificactionTitle}
        message={notificationMessage}
      />
      <div className="left-section">
        <div className="flex fixed z-10 self-center inset-0"></div>

        <img className="pass_change" src={pass_remember}></img>
      </div>
      <div className="right-section">
        <div className="close-forms-container">
          <span className="close-forms" onClick={handleClose}>
            &times;
          </span>
        </div>
        <div className="login-form-container">
          <h1 className="h1-naranja-pass">
            <span>RECOVER</span>
            <span>PASSWORD</span>
          </h1>
          <div className="login-links">
            <p className="small-text">
              Enter your email to recover your account
            </p>
            <br></br>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <label className="label-form">Email</label>
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
              className="input-form"
              required
            />
            <span className="absolute top-1 right-2 text-white">*</span>

            <div className="login-button-container">
              <button
                type="submit"
                className="login-button"
                onClick={handleSubmit}
              >
                DONE
              </button>
            </div>
            <div className="login-button-container">
              <button
                type="submit"
                className="login-button"
                onClick={() => navigate("/")}
              >
                <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
                &nbsp; HOME
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordRemember;
