import React, { useState, useContext } from "react";
import "../../components/global.css";
import { useNavigate } from "react-router-dom";
import pass_change from "../../assets/pass_change.jpeg";

import { AuthContext } from "../../contexts/authContext";
import RequestSender from "../../common/requestSender";
import Notification from "../notification/notification";

function PasswordChange1() {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [password, setPassword] = useState("");
  const [notificactionTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  const handleClose = () => {
    window.location.href = "/";
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Prevents page reload
  // login logic here
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setNotificationTitle("Error");
      setNotificationMessage(
        "Please fill in all the fields before proceeding."
      );
      toggleNotification();
      return;
    }
    const credentials = {
      email: user.email, // Change this to the email of the user logged in this session
      oldPassword: password,
    };

    const requestSender = new RequestSender();
    requestSender
      .sendRequest("verify", "POST", credentials)
      .then((response) => {
        // Handle the response
        console.log(
          "_____________Status = ",
          response.status,
          " Message = ",
          response.data.message
        );
        if (response.status === 202) {
          // Check for status code 202
          navigate("/changePassword2"); // Navigate to the next page
        } else {
          // Handle other status codes as needed
          setNotificationTitle("Error");
          setNotificationMessage("Invalid password. Please try again.");
          toggleNotification();
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the fetch
        console.error("Error updating password:", error);
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

        <img className="pass_change-pas" src={pass_change}></img>
      </div>
      <div className="right-section">
        <div className="close-forms-container">
          <span className="close-forms" onClick={handleClose}>
            &times;
          </span>
        </div>
        <div className="login-form-container">
          <h1 className="h1-naranja-pass">
            <span>CHANGE</span>
            <span>PASSWORD</span>
          </h1>
          <form onSubmit={handleSubmit} className="login-form">
            <span className="absolute top-1 right-2 text-white">*</span>
            <label className="label-form">Old Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="input-form"
              required
            />
            <div className="login-button-container">
              <button
                type="submit"
                className="login-button"
                onClick={handleSubmit}
              >
                CONTINUE
              </button>
            </div>
          </form>
          <div>
            <div className="login-links">
              <p className="small-text">Dont know your current password?</p>
              <a href="/rememberPassword" className="small-link">
                Click here to recover it!
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordChange1;
