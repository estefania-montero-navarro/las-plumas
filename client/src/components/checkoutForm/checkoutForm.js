import { PaymentElement } from "@stripe/react-stripe-js";
import React, { useState, useContext } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

import { AuthContext } from "../../contexts/authContext";
import { ReservationContext } from "../../contexts/reservation";
import Notification from "../notification/notification";
import RequestSender from "../../common/requestSender";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page

        return_url: `${window.location.origin + "/confirmation"}`,
      },
    });
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
        setIsNotificationOpen(true);
      } else {
        setMessage("An unexpected error occured.");
        setIsNotificationOpen(true);
      }

      setIsProcessing(false);
    } else {
      setMessage("amo a mi novia");
      setIsNotificationOpen(true);
    }
  };

  return (
    <div>
      <Notification
        isOpen={isNotificationOpen}
        toggleModal={toggleNotification}
        message={message}
      ></Notification>
      <form
        className="flex-col justify-content-center w-full"
        id="payment-form"
        onSubmit={handleSubmit}
      >
        <PaymentElement id="payment-element" />
        <div class="flex justify-center">
          <button
            className="bg-fern-green text-white text-lg font-bold py-2 px-4 rounded mt-4 align-center w-1/2"
            disabled={isProcessing || !stripe || !elements}
            id="submit"
          >
            <span id="button-text">
              {isProcessing ? "Processing ... " : "Confirm and pay"}
            </span>
          </button>
        </div>
        {/* Show any error or success messages */}
        {/* {message && (
          <div id="payment-message" className="text-lg">
            {message}
          </div>
        )} */}
      </form>
    </div>
  );
};

export default CheckoutForm;
