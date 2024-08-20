import React, { useState, useContext } from "react";
import "../../components/global.css";
import { useNavigate } from "react-router-dom";
import pass_change from "../../assets/pass_change.jpeg";

import { AuthContext } from "../../contexts/authContext";
import RequestSender from "../../common/requestSender";
import Notification from "../notification/notification";

function PasswordChange2() {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [password, setPassword] = useState("");
  const [passConf, setPassConf] = useState("");
  const [notificactionTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  const handleClose = () => {
    window.location.href = "/";
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!hasStartedTyping) {
      setHasStartedTyping(true);
    }
  };

  const handlePassConfChange = (e) => {
    setPassConf(e.target.value);
  };

  const isPaswValidLength = password.length >= 8 && password.length <= 15;
  const isPaswNum = /\d/.test(password);
  const isPaswChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPaswUpper = /[A-Z]/.test(password);

  const verifyFields = () => {
    if (!password || !passConf) {
      setNotificationTitle("Error");
      setNotificationMessage(
        "Please fill all the required fields before continuing"
      );
      toggleNotification();
      return -1;
    }

    if (!isPaswValidLength || !isPaswNum || !isPaswChar || !isPaswUpper) {
      setNotificationTitle("Error");
      setNotificationMessage("Invalid password. Please meet all criteria.");
      toggleNotification();
      return -1;
    }

    if (passConf !== password) {
      setNotificationTitle("Error");
      setNotificationMessage("Password confirmation does not match.");
      toggleNotification();
      return -1;
    }

    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verifyFields() === -1) {
      return;
    }

    const credentials = {
      email: user.email, // Assuming user email is obtained from AuthContext
      newPassword: password,
    };

    const requestSender = new RequestSender();
    requestSender
      .sendRequest("update", "POST", credentials)
      .then((response) => {
        console.log(
          "_____________Status = ",
          response.status,
          " Message = ",
          response.data.message
        );
        if (response.status === 202) {
          setNotificationTitle("Success");
          setNotificationMessage("Password updated successfully.");
          toggleNotification();
          navigate("/home");
        } else {
          setNotificationTitle("Error");
          setNotificationMessage(
            "Failed to update password. Please try again."
          );
          toggleNotification();
        }
      })
      .catch((error) => {
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
            <div className="mb-2 relative">
              <label htmlFor="password" className="label-form">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#33665B] focus:border-[#33665B] block w-full p-2.5"
                required
              />
              {hasStartedTyping && (
                <>
                  {!isPaswValidLength && (
                    <span className="psw-validation-criteria-change invalid">
                      Password length must be between 8 and 15 characters
                    </span>
                  )}
                  {!isPaswNum && (
                    <span className="psw-validation-criteria-change invalid">
                      Password must contain at least one number
                    </span>
                  )}
                  {!isPaswChar && (
                    <span className="psw-validation-criteria-change invalid">
                      Password must contain at least one special character
                    </span>
                  )}
                  {!isPaswUpper && (
                    <span className="psw-validation-criteria-change invalid">
                      Password must contain at least one uppercase letter
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password_conf" className="label-form">
                Confirm Password
              </label>
              <input
                type="password"
                id="password_conf"
                value={passConf}
                onChange={handlePassConfChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#33665B] focus:border-[#33665B] block w-full p-2.5"
                required
              />
              <span className="absolute top-1 right-2 text-[#33665B]">*</span>
            </div>
            <div className="login-button-container">
              <button type="submit" className="login-button">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordChange2;
