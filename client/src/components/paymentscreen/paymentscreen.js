import React, { useState, useEffect, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import RequestSender from "../../common/requestSender";
import CheckoutForm from "../checkoutForm/checkoutForm";
import whiteLogo from "../../assets/whiteLogo.png";
import { AuthContext } from "../../contexts/authContext";
import { ReservationContext } from "../../contexts/reservation";
import rates from "../../common/rates.json";

const PaymentScreen = () => {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [reservationInfo, setReservationInfo] = useState({});

  useEffect(() => {
    // Load data from sessionStorage
    const storedReservationInfo = sessionStorage.getItem("reservationInfo");
    if (storedReservationInfo) {
      // Parse the JSON string to an object and update the state
      setReservationInfo(JSON.parse(storedReservationInfo));
    }
  }, []);

  useEffect(() => {
    const requestSender = new RequestSender();
    requestSender.sendRequest("payment-config", "GET").then((response) => {
      if (response.status === 200) {
        setStripePromise(loadStripe(response.data.data.publishableKey));
      }
    });
  }, []);
  useEffect(() => {
    const storedReservationInfo = sessionStorage.getItem("reservationInfo");
    const reservationInfoJSON = JSON.parse(storedReservationInfo);
    const totalPrice = reservationInfoJSON.totalPrice;
    const requestSender = new RequestSender();
    requestSender
      .sendRequest("new-payment-intent", "POST", {
        totalPrice: totalPrice,
      })
      .then((response) => {
        if (response.status === 200) {
          setClientSecret(response.data.data.clientSecret);
        }
      });
  }, []);

  const stripTime = (date) => {
    return (
      date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()
    );
  };

  const generateRoomsSection = () => {
    let rooms = [];
    const nights = reservationInfo.nights;
    let roomsTotal = 0;
    for (let room in reservationInfo.rooms) {
      const amount = reservationInfo.rooms[room];
      const roomPrice = rates.rooms[room];
      const roomTotal = roomPrice * nights;
      for (let i = 0; i < amount; i++) {
        rooms.push(
          <div className="text-left justify-start w-full pt-4 pl-8">
            <div class="grid grid-cols-3 gap-4 items-center">
              <p class="text-white font-roboto font-bold text-xl text-center">
                {getRoomDisplayName(room)}
              </p>
              <p class="text-white font-roboto font-normal text-xl text-center">
                ${roomPrice} x {nights} nights
              </p>
              <p class="text-white font-roboto font-normal text-xl text-center">
                ${roomTotal}
              </p>
            </div>
          </div>
        );
      }
      roomsTotal = roomsTotal + roomTotal * amount;
    }
    if (rooms.length > 0) {
      rooms.unshift(
        <h2 className="text-white font-roboto font-bold text-xl uppercase">
          Rooms
        </h2>
      );
      rooms.unshift(<hr className="text-air-force-blue w-3/4 m-4"></hr>);
    }
    return rooms;
  };

  const generateServicesSection = () => {
    let services = [];
    for (let service in reservationInfo.services) {
      const guests = reservationInfo.services[service].guests;
      if (guests) {
        const servicePrice = rates.services[service];
        services.push(
          <div className="text-left justify-start w-full pt-4 pl-8">
            <div class="grid grid-cols-3 gap-4 items-center">
              <p class="text-white font-roboto font-bold text-xl text-center">
                {service}
              </p>
              <p class="text-white font-roboto font-normal text-xl text-center">
                ${servicePrice} x {guests} guests
              </p>
              <p class="text-white font-roboto font-normal text-xl text-center">
                ${servicePrice * guests}
              </p>
            </div>
          </div>
        );
      }
    }

    if (services.length > 0) {
      services.unshift(
        <h2 className="text-white font-roboto font-bold text-xl uppercase">
          Services
        </h2>
      );
      services.unshift(<hr className="text-air-force-blue w-3/4 m-4"></hr>);
    }
    return services;
  };

  const getRoomDisplayName = (room) => {
    let displayName = "";
    switch (room) {
      case "suite":
        displayName = "Suite oceanfront";
        break;
      case "bungalow":
        displayName = "Beach Bungalow";
        break;
      case "vista":
        displayName = "Garden view";
        break;
      case "familiar":
        displayName = "Family suite";
        break;
      case "estandar":
        displayName = "Standard room";
        break;
    }
    return displayName;
  };

  return (
    <div class="flex w-full">
      <div class="flex w-3/5 min-h-screen bg-white bg-cover mb-[-100px] justify-content-end pr-6 pb-20">
        <div class="flex flex-col w-full font-roboto text-black p-8 pr-12">
          <h1 className="text-black font-roboto font-bold text-4xl uppercase">
            1. Confirm your payment
          </h1>
          <p className="text-gray-700 font-roboto font-normal text-xl  p-4">
            Upon proceeding with the purchase, the charges indicated on the
            right side of the screen will be applied. You will receive an email
            with all the relevant reservation details.
          </p>
          <hr className="text-black text-bold w-3/4 mb-2"></hr>
          <h2 className="text-black font-roboto font-bold text-xl uppercase p-4">
            Cancelation policy
          </h2>
          <p className="text-gray-700 font-roboto font-normal text-xl p-4">
            This reservation is non-refundable.
          </p>
          <p className="text-gray-700 font-roboto text-md p-4">
            By selecting the button below, I agree to the following policies: 
            Fundamental Guest Rules, Refund Policy and Assistance for
            Reservation Changes. Additionally, I consent to Las Plumas charging
            me through my payment method if I am responsible for any damages. I
            also agree to the updated Terms of Service, the Payment Terms of
            Service, and the Privacy Policy.
          </p>
          <h1 className="text-black font-roboto font-bold text-4xl uppercase m-6">
            2. Fill in your card details
          </h1>
          <div class="flex flex-col w-full items-center p-4 rounded-xl border-2 border-gray">
            {clientSecret && stripePromise && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            )}
          </div>
        </div>
      </div>
      <div class="flex-col w-2/5 min-h-screen bg-gradient-to-r from-[#33665B] to-[#48744C] bg-cover rounded-tl-xl rounded-bl-xl  ml-[-20px] mb-[-100px] b-0 justify-content-end center-items">
        <div class="flex flex-col items-center w-full font-roboto text-black mt-8">
          <h1 className="text-white font-roboto font-bold text-4xl uppercase">
            Your reservation
          </h1>
          <p className="text-white font-roboto font-normal text-xl p-4 m-4">
            Please check the details of your reservation before proceeding with
            payment.
          </p>
          <h2 className="text-white font-roboto font-bold text-xl uppercase">
            General information
          </h2>
          <div className="flex flex-col text-left w-full pl-8">
            <p className="text-white font-roboto font-bold text-xl pb-0">
              Dates
            </p>
            <p className="text-white font-roboto font-normal text-xl pb-4">
              {reservationInfo.checkIn} -{reservationInfo.checkOut}
            </p>
            <p className="text-white font-roboto font-bold text-xl pb-0">
              Guests
            </p>
            <p className="text-white font-roboto font-normal text-xl pb-4">
              {reservationInfo.guests} guests
            </p>
          </div>

          <hr className="color-white text-white"></hr>
          {generateRoomsSection()}
          {generateServicesSection()}
          <hr className="text-air-force-blue w-3/4 m-4"></hr>
          <h2 className="text-white font-roboto font-bold text-xl uppercase m-4 mb-10">
            Total price: ${reservationInfo.totalPrice}
          </h2>
        </div>
        {/* <img src={whiteLogo} className="h-1/8 r-0"></img> */}
      </div>
    </div>
  );
};

export default PaymentScreen;
