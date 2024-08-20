import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import RequestSender from "../../common/requestSender";
import logo from "../../assets/logo_pluma.png";
import sea from "../../assets/confirmation.jpg";

function ReservationConfirmation() {
  const [reservationSuccess, setReservationSuccess] = useState(true);
  useEffect(() => {
    const reservationInfo = sessionStorage.getItem("reservationInfo");
    const reservationInfoJSON = JSON.parse(reservationInfo);
    const requestSender = new RequestSender();
    requestSender
      .sendRequest("reservation", "POST", reservationInfoJSON) // considerar la mayuscula is falla
      .then((response) => {
        const responseStatus = response.status;
        if (responseStatus === 201) {
          const reservationId = response.data.reservationId;
          const receiptAmount = reservationInfoJSON.totalPrice;
          generateReceipt(reservationId, receiptAmount);
        } else {
          setReservationSuccess(false);
        }
      });
  }, []);

  const generateReceipt = (reservationId, receiptAmount) => {
    const receiptInfo = {
      uuid: sessionStorage.getItem("uuid"),
      reservationId: reservationId,
      receiptAmount: receiptAmount,
    };
    const requestSender = new RequestSender();
    requestSender
      .sendRequest("receipt", "POST", receiptInfo) // considerar la mayuscula is falla
      .then((response) => {
        const responseStatus = response.status;
        if (responseStatus === 201) {
        } else {
          setReservationSuccess(false);
        }
      });
  };

  if (reservationSuccess) {
    return (
      <div class="w-screen h-screen bg-cover flex items-center justify-center">
        <img
          src={sea}
          class="absolute object-cover w-full h-full"
          alt="Image 8"
        ></img>
        <div class="absolute z-4 self-center bg-myrtle-green bg-cover w-1/3 h-2/3 rounded-xl p-8">
          <Link
            to="/home"
            className="text-white font-roboto font-bold text-4xl text-center top-0 mr-2 right-0 absolute"
          >
            x
          </Link>
          <p className="text-white font-roboto font-normal text-xl text-center mb-4">
            Your reservation was created succesfully!
          </p>

          <p className="text-white font-roboto font-normal text-xl text-center mb-4">
            You will receive an email with the details of your reservation and
            you can find your reservation
            <Link
              to="/myReservations"
              className="text-white font-roboto font-normal text-xl text-center underline ml-2"
            >
              here.
            </Link>
          </p>

          <p className="text-white font-roboto font-normal text-xl text-center mb-4">
            Thank you for choosing Las Plumas Hotel. See you soon!
          </p>
          <img src={logo} class=" w-1/5 mx-auto bottom-1" alt="logo"></img>
        </div>
      </div>
    );
  } else {
    return (
      <div class="w-screen h-screen bg-cover bg-white flex items-center justify-center">
        <div class="absolute z-4 self-center bg-myrtle-green bg-cover w-1/2 h-2/3 rounded-xl p-8">
          <Link
            to="/home"
            className="text-white font-roboto font-bold text-4xl text-center top-0 mr-2 right-0 absolute"
          >
            x
          </Link>
          <h2 className="text-white font-roboto font-normal text-2xl text-center mb-4">
            We're sorry
          </h2>
          <p className="text-white font-roboto font-normal text-xl text-center mb-4">
            An error occurred while saving your reservation. Please contact us
            at your earliest convinience through email at
            clientservice@lasplumas.com or call us at +506 8488 2545. Our team
            is ready to assist you and ensure your reservation is completed
            successfully.
          </p>
          <p className="text-white font-roboto font-normal text-xl text-center mb-4">
            Thank you for your understanding and patience.
          </p>

          <img src={logo} class=" w-1/5 mx-auto bottom-1" alt="logo"></img>
        </div>
      </div>
    );
  }
}

export default ReservationConfirmation;
