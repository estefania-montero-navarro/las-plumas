import React from "react";
import PropTypes from "prop-types";
import "../../components/global.css";

function NotificationWithAction({
  isOpen,
  toggleModal: toggle,
  message,
  action,
  actionMessage,
}) {
  if (!isOpen) return null;

  return (
    <div
      id="toast-default"
      className="flex fixed top-0 left-1/2 transform -translate-x-1/2 flex-col z-10 items-center w-full max-w-lg p-2 text-myrtle-green bg-white rounded-lg shadow p-3 mt-4"
      role="alert"
    >
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 "
        data-dismiss-target="#toast-message-cta"
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
      <div className="flex flex-row ">
        <div
          id="title"
          className="self-center ms-3 mb-2 text-myrtle-green text-lg font-normal font-sans"
        >
          {message}
        </div>
      </div>
      {actionMessage && (
        <button
          href="#"
          className="inline-flex px-2.5 py-1.5 text-xs font-medium text-center text-white bg-air-force-blue rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
          onClick={action}
        >
          {actionMessage}
        </button>
      )}
    </div>
  );
}

NotificationWithAction.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  actionMessage: PropTypes.string.isRequired,
};

export default NotificationWithAction;
