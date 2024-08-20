import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../../components/global.css";
import login_bg from "../../assets/login_bg.png";
import NotificationWithAction from "../notificationWithAction/notificacionWithAction";

function SignInForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passConf, setPassConf] = useState("");
  const [phone, setPhone] = useState("");
  const [bd_day, setDay] = useState("");
  const [bd_month, setMonth] = useState("");
  const [bd_year, setYear] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationActionMessage, setNotificationActionMessage] =
    useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  const showNotification = (message, actionMessage) => {
    setNotificationMessage(message);
    setNotificationActionMessage(actionMessage);
    toggleNotification();
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  // Event handler
  // e is the event object
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (!hasStartedTyping) {
      setHasStartedTyping(true);
    }
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePassConfChange = (e) => {
    setPassConf(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const handleDayChange = (e) => {
    setDay(e.target.value);
  };
  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };
  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const isPaswValidLenght = password.length >= 8 && password.length <= 15;
  const isPaswNum = /\d/.test(password);
  const isPaswChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPaswUpper = /[A-Z]/.test(password);

  const verifyFields = () => {
    if (
      !email ||
      !password ||
      !passConf ||
      !name ||
      !lastName ||
      !phone ||
      !bd_day ||
      !bd_month ||
      !bd_year
    ) {
      showNotification(
        "Please fill all the required fields before continuing",
        ""
      );
      return -1;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification("Invalid email", "");
      return -1;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).+/;
    if (!passwordRegex.test(password)) {
      showNotification("Invalid password", "");
      return -1;
    }

    if (passConf != password) {
      showNotification("Invalid password confirmation", "");
      return -1;
    }

    const phoneRegex = /^\+?[0-9\-().\s]{7,}$/;
    if (!phoneRegex.test(phone)) {
      showNotification("Invalid phone number", "");
      return -1;
    }

    const dayMonthRegex = /^\d{2}$/;
    const yearRegex = /^\d{4}$/;
    if (
      !dayMonthRegex.test(bd_day) ||
      !dayMonthRegex.test(bd_month) ||
      !yearRegex.test(bd_year)
    ) {
      showNotification("Invalid date", "");
      return -1;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verifyFields() === -1) {
      return;
    }

    const b_day = bd_year + "-" + bd_month + "-" + bd_day;
    const new_user_data = {
      email: email,
      password: password,
      passConf: passConf,
      name: name,
      lastName: lastName,
      role: "client",
      phone: phone,
      b_day: b_day,
    };

    axios
      .post("http://localhost:3000/api/v1/register", new_user_data)
      .then(() => {
        showNotification("User created successfully", "Go to login");
      })
      .catch((error) => {
        const status_code = error.response.status;
        const status_message = error.response.data.message;
        console.error("Error:" + status_code + " " + status_message);
        showNotification(status_message, "");
      });
  };

  return (
    <div className="bg-[#FFFCF7] h-screen overflow-hidden">
      <NotificationWithAction
        isOpen={notificationOpen}
        toggleModal={toggleNotification}
        message={notificationMessage}
        actionMessage={notificationActionMessage}
        action={goToLogin}
      />
      <div className="flex flex-col sm:flex-row h-full">
        <div className="sm:w-1/2 h-full overflow-y-auto">
          <div className="flex justify-center items-center h-full mt-16">
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
              <div className="mb-2 py-2">
                <label className="font-roboto block mb-2 text-4xl font-bold text-[#33665B] uppercase p-2">
                  Create account
                </label>
              </div>
              <div className="mb-4 relative">
                <label
                  htmlFor="first-name"
                  className="block mb-2 text-sm font-medium text-[#33665B]"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="first-name"
                  value={name}
                  onChange={handleNameChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#33665B] focus:border-[#33665B] block w-full p-2.5"
                  placeholder="Enter your first name"
                  required
                />
                <span className="absolute top-1 right-2 text-[#33665B]">*</span>
              </div>
              <div className="mb-4 relative">
                <label
                  htmlFor="last-name"
                  className="block mb-2 text-sm font-medium text-[#33665B]"
                >
                  Last name
                </label>
                <input
                  type="text"
                  id="last-name"
                  value={lastName}
                  onChange={handleLastNameChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#33665B] focus:border-[#33665B] block w-full p-2.5"
                  placeholder="Enter your last name"
                  required
                />
                <span className="absolute top-1 right-2 text-[#33665B]">*</span>
              </div>
              <div className="mb-4 relative">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-[#33665B]"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#33665B] focus:border-[#33665B] block w-full p-2.5"
                  placeholder="youremail@email.com"
                  required
                />
                <span className="absolute top-1 right-2 text-[#33665B]">*</span>
              </div>
              <div className="mb-2 relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-[#33665B]"
                >
                  Password
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
                    {!isPaswValidLenght && (
                      <span className="psw-validation-criteria invalid">
                        Password length must be between 8 and 15 characters
                      </span>
                    )}
                    {!isPaswNum && (
                      <span className="psw-validation-criteria invalid">
                        Password must contain at least one number
                      </span>
                    )}
                    {!isPaswChar && (
                      <span className="psw-validation-criteria invalid">
                        Password must contain at least one special character
                      </span>
                    )}
                    {!isPaswUpper && (
                      <span className="psw-validation-criteria invalid">
                        Password must contain at least one uppercase letter
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="mb-4 relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-[#33665B]"
                >
                  Confirm password
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
              <div className="mb-4 relative">
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-[#33665B]"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#33665B] focus:border-[#33665B] block w-full p-2.5"
                />
              </div>
              <div className="mb-2 relative">
                <label className="block mb-2 text-sm font-medium text-[#33665B]">
                  Date of Birth
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    id="day"
                    min="1"
                    max="31"
                    value={bd_day}
                    onChange={handleDayChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#33665B] focus:border-[#33665B] flex-1 p-2.5"
                    placeholder="DD"
                    required
                  />
                  <input
                    type="number"
                    id="month"
                    min="1"
                    max="12"
                    value={bd_month}
                    onChange={handleMonthChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#33665B] focus:border-[#33665B] flex-1 p-2.5"
                    placeholder="MM"
                    required
                  />
                  <input
                    type="number"
                    id="year"
                    min="1900"
                    max="2099"
                    value={bd_year}
                    onChange={handleYearChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#33665B] focus:border-[#33665B] flex-1 p-2.5"
                    placeholder="YYYY"
                    required
                  />
                  <span className="absolute top-1 right-2 text-[#33665B]">
                    *
                  </span>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 border border-[#33665B] rounded bg-gray-50 focus:ring-3 focus:ring-[#33665B]"
                  />
                </div>
                <label
                  htmlFor="remember"
                  className="ms-2 text-sm font-medium text-[#33665B]"
                >
                  Remember me
                </label>
              </div>
              <div className="flex justify-center mb-4">
                <button
                  type="submit"
                  className="text-white bg-[#4C83A5] shadow-md hover:bg-[#4C83A5]-800 focus:ring-4 focus:outline-none focus:ring-[#4C83A5] font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 align-center text-center uppercase"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
              <div className="flex text-center mb-4">
                <p className="text-normal text-[#33665B] text-sm">
                  {" "}
                  When creating the account, you agree to be contacted by the
                  hotel through the communication means provided in the form.
                </p>
              </div>
            </form>
          </div>
        </div>
        <div className="sm:w-1/2">
          <img src={login_bg} className="w-full" />
        </div>
      </div>
    </div>
  );
}

export default SignInForm;
