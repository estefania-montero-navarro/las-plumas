import React, { useState, useContext } from "react";
import "../../components/global.css";
import { useNavigate } from "react-router-dom";
import login_bg from "../../assets/login_bg.png";

import { AuthContext } from "../../contexts/authContext";
import RequestSender from "../../common/requestSender";
import Notification from "../notification/notification";

function Login() {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
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

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setNotificationTitle("Error");
      setNotificationMessage("Please fill in the fields before proceeding");
      toggleNotification();
      return;
    }
    const credentials = {
      email: email,
      password: password,
    };

    const requestSender = new RequestSender();
    requestSender
      .sendRequest("login", "POST", credentials) // considerar la mayuscula is falla
      .then((response) => {
        // Handle the response
        if (response.status === 200) {
          //get the data from the response
          const { token, email, name, role, uuid } = response.data.data;
          sessionStorage.setItem("token", token);
          const userData = {
            email: email,
            name: name,
            role: role,
            uuid: uuid,
          };
          login(userData);
          setNotificationTitle("Succesful login");
          setNotificationMessage("Welcome " + name);
          setNotificationOpen(true);
          navigate("/home");
        } else {
          const status_code = response.status;
          if (status_code === 401 || status_code === 403) {
            setNotificationTitle("Error");
            setNotificationMessage("Invalid credentials");
            toggleNotification();
            return;
          }
        }
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

        <img className="login_bg" src={login_bg}></img>
      </div>
      <div className="right-section">
        <div className="close-forms-container">
          <span className="close-forms" onClick={handleClose}>
            &times;
          </span>
        </div>
        <div className="login-form-container">
          <h1 className="h1-naranja">LOGIN</h1>
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

            <label className="label-form">Password</label>
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
                LOGIN
              </button>
            </div>
          </form>
          <div>
            <div className="login-links">
              <p className="small-text">Don’t have an account yet?</p>
              <a href="/signin" className="small-link">
                Click here to sign up!
              </a>
            </div>
            <div className="login-links">
              <p className="small-text">Forgot your password?</p>
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

export default Login;
