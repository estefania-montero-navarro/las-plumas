import React from "react";
import PropTypes from "prop-types";
import "../../components/global.css";

function Notification({ isOpen, toggleModal: toggle, message }) {
  if (!isOpen) return null;

  return (
    <div
      id="toast-default"
      className="flex fixed top-0 left-1/2 transform -translate-x-1/2 flex-row z-10 items-center w-full max-w-lg p-5 text-myrtle-green bg-white rounded-lg shadow mt-5"
      role="alert"
    >
      <div
        id="title"
        className="self-center ms-3 mb-2 text-myrtle-green text-lg font-normal font-sans"
      >
        {message}
      </div>

      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 bg-white text-myrtle-green-400 hover:text-myrtle-green-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-linen-700 inline-flex items-center justify-center h-8 w-8 "
        data-dismiss-target="#toast-default"
        aria-label="Close"
        onClick={toggle}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
}

Notification.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default Notification;
