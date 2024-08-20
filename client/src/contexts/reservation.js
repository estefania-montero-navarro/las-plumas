import React, { createContext, useState, useEffect } from "react";

import RequestSender from "../common/requestSender";
export const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [isPayed, setIsPayed] = useState(false);
  const [reservationInfo, setReservationInfo] = useState({
    email: "wuu",
    checkIn: "10 / 2 / 26",
    checkOut: "14 / 2 / 26",
    guests: 2,
    nights: 4,
    rooms: {
      suite: 1,
      bungalow: 0,
      vista: 0,
      familiar: 0,
      estandar: 0,
    },
    services: {
      Spa: {
        guests: 0,
        date: null,
      },
      Gym: {
        guests: 0,
        date: null,
      },
      Transportation: {
        guests: 2,
        date: 10 / 2 / 26,
      },
    },
    totalPrice: 500,
  });

  const changeReservationInfo = (newInfo) => {
    setReservationInfo(newInfo);
    sessionStorage.setItem("reservationInfo", newInfo);
  };

  const calculateNights = () => {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(reservationInfo.checkIn);
    const secondDate = new Date(reservationInfo.checkOut);
    const nights = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    return nights;
  };

  const getRoomPrice = (room) => {
    let price = 0;
    switch (room) {
      case "suite":
        price = 550;
        break;
      case "bungalow":
        price = 400;
        break;
      case "vista":
        price = 300;
        break;
      case "familiar":
        price = 250;
        break;
      case "estandar":
        price = 150;
        break;
    }
    return price;
  };

  const getServicePrice = (service) => {
    let price = 0;
    switch (service) {
      case "Spa":
        price = 50;
        break;
      case "Gym":
        price = 10;
        break;
      case "Transportation":
        price = 30;
        break;
    }
    return price;
  };

  const notifyIfPayed = () => {
    console.log("ispayed: ", isPayed);
    if (isPayed) {
      setReservNotificationMssg(
        "Reservation and payment completed successfully. An email will be sent with all the relevant information"
      );
    }
    setIsPayed(false);
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    const nights = calculateNights(
      reservationInfo.checkIn,
      reservationInfo.checkOut
    );
    for (let room in reservationInfo.rooms) {
      const amount = reservationInfo.rooms[room];
      const roomPrice = getRoomPrice(room);
      totalPrice = totalPrice + roomPrice * nights * amount;
    }
    for (let service in reservationInfo.services) {
      const servicePrice = getServicePrice(service);
      totalPrice = totalPrice + servicePrice * reservationInfo.guests;
    }
    return totalPrice;
  };

  const stripTime = (date) => {
    return (
      date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()
    );
  };

  return (
    <ReservationContext.Provider
      value={{
        reservationInfo,
        changeReservationInfo,
        setIsPayed,
        calculateNights,
        getRoomPrice,
        getServicePrice,
        calculateTotalPrice,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
