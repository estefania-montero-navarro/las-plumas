import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "../../components/global.css";

import RequestSender from "../../common/requestSender";
import Notification from "../notification/notification";

function NuevaReservaForm() {
  const [roomVisible, setRoomVisible] = useState(false);

  const [suiteQuantity, setSuiteQuantity] = useState(0);
  const [suiteGuests, setSuiteGuests] = useState(0);
  const increaseSuiteQuantity = () => {
    setSuiteQuantity(suiteQuantity + 1);
  };

  const decreaseSuiteQuantity = () => {
    if (suiteQuantity > 0) {
      setSuiteQuantity(suiteQuantity - 1);
    }
  };

  const increaseSuiteGuests = () => {
    setSuiteGuests(suiteGuests + 1);
  };

  const decreaseSuiteGuests = () => {
    if (suiteGuests > 0) {
      setSuiteGuests(suiteGuests - 1);
    }
  };

  const [bungalowQuantity, setBungalowQuantity] = useState(0);
  const [bungalowGuests, setBungalowGuests] = useState(0);
  const increaseBungalowQuantity = () => {
    setBungalowQuantity(bungalowQuantity + 1);
  };

  const decreaseBungalowQuantity = () => {
    if (bungalowQuantity > 0) {
      setBungalowQuantity(bungalowQuantity - 1);
    }
  };

  const increaseBungalowGuests = () => {
    setBungalowGuests(bungalowGuests + 1);
  };

  const decreaseBungalowGuests = () => {
    if (bungalowGuests > 0) {
      setBungalowGuests(bungalowGuests - 1);
    }
  };

  const [vistaQuantity, setVistaQuantity] = useState(0);
  const [vistaGuests, setVistaGuests] = useState(0);
  const increaseVistaQuantity = () => {
    setVistaQuantity(vistaQuantity + 1);
  };
  const decreaseVistaQuantity = () => {
    if (vistaQuantity > 0) {
      setVistaQuantity(vistaQuantity - 1);
    }
  };
  const increaseVistaGuests = () => {
    setVistaGuests(vistaGuests + 1);
  };
  const decreaseVistaGuests = () => {
    if (vistaGuests > 0) {
      setVistaGuests(vistaGuests - 1);
    }
  };

  const [familiarQuantity, setFamiliarQuantity] = useState(0);
  const [familiarGuests, setFamiliarGuests] = useState(0);
  const increaseFamiliarQuantity = () => {
    setFamiliarQuantity(familiarQuantity + 1);
  };
  const decreaseFamiliarQuantity = () => {
    if (familiarQuantity > 0) {
      setFamiliarQuantity(familiarQuantity - 1);
    }
  };
  const increaseFamiliarGuests = () => {
    setFamiliarGuests(familiarGuests + 1);
  };
  const decreaseFamiliarGuests = () => {
    if (familiarGuests > 0) {
      setFamiliarGuests(familiarGuests - 1);
    }
  };

  const [estandarQuantity, setEstandarQuantity] = useState(0);
  const [estandarGuests, setEstandarGuests] = useState(0);
  const increaseEstandarQuantity = () => {
    setEstandarQuantity(estandarQuantity + 1);
  };
  const decreaseEstandarQuantity = () => {
    if (estandarQuantity > 0) {
      setEstandarQuantity(estandarQuantity - 1);
    }
  };
  const increaseEstandarGuests = () => {
    setEstandarGuests(estandarGuests + 1);
  };
  const decreaseEstandarGuests = () => {
    if (estandarGuests > 0) {
      setEstandarGuests(estandarGuests - 1);
    }
  };

  const [serviceVisible, setServiceVisible] = useState(false);
  const [serviceDaysQuantity, setServiceDaysQuantity] = useState(0);
  const [serviceGuests, setServiceGuests] = useState(0);
  const [email, setEmail] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [errors, setErrors] = useState({});

  const handleCheckInChange = (event) => {
    const value = event.target.value;
    setCheckIn(value);
    validateDates(value, checkOut);
  };

  const handleCheckOutChange = (event) => {
    const value = event.target.value;
    setCheckOut(value);
    validateDates(checkIn, value);
  };

  const validateDates = (checkInDate, checkOutDate) => {
    const errors = {};
    const today = new Date().toISOString().split("T")[0];

    if (checkInDate && checkInDate <= today) {
      errors.checkIn = "Check-in date must be after today";
    }

    if (checkOutDate && checkOutDate <= today) {
      errors.checkOut = "Check-out date must be after today";
    }

    if (checkInDate && checkOutDate && checkOutDate <= checkInDate) {
      errors.checkOut = "Check-out date must be after check-in date";
    }

    setErrors(errors);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = getTodayDate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const toggleRoom = () => {
    setRoomVisible(!roomVisible);
  };

  const toggleService = () => {
    setServiceVisible(!serviceVisible);
  };

  const increaseServiceDaysQuantity = () => {
    setServiceDaysQuantity(serviceDaysQuantity + 1);
  };

  const decreaseServiceDaysQuantity = () => {
    if (suiteQuantity > 1) {
      setServiceDaysQuantity(serviceDaysQuantity - 1);
    }
  };

  const increaseServiceGuestsQuantity = () => {
    setServiceGuests(serviceGuests + 1);
  };

  const decreaseServiceGuestsQuantity = () => {
    if (serviceGuests > 1) {
      setServiceGuests(serviceGuests - 1);
    }
  };

  const reservationInfoJSON = {
    email: email,
    checkIn: checkIn,
    checkOut: checkOut,
    rooms: {
      suite: suiteQuantity,
      bungalow: bungalowQuantity,
      vista: vistaQuantity,
      familiar: familiarQuantity,
      estandar: estandarQuantity,
    },
  };


  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const saveReservation = () => {
    const requestSender = new RequestSender();
    requestSender
      .sendRequest("reservation", "POST", reservationInfoJSON) // considerar la mayuscula is falla
      .then((response) => {
        // Handle the response
        const responseStatus = response.status;
        console.log("Reservation:", responseStatus);
        if (responseStatus === 201) {
          setModalTitle("");
          setModalMessage(
            "Reservation created succesfully! An email has been sent to the client with the reservation details."
          );
          setShowModal(true);
        } else {
          const status_message = response.data.message;
          console.error("Error:" + responseStatus + " " + status_message);
          setModalTitle("An error has occurred...");
          setModalMessage(status_message);
          setShowModal(true);
        }
      });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#6B98B4]/50  min-h-screen p-8">
      <h1 className="text-center font-roboto text-6xl font-black text-white mt-2 mb-4">New Reservation</h1>
      <div className="bg-[#6B98B4] rounded-lg shadow-md p-8 w-full max-w-3xl mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-white mt-4 pb-2" htmlFor="nombre">Client Name</label>
            <input
              className="input-new-reservation"
              type="text"
              id="nombre"
              name="nombre"
            />
            <label className="text-white mt-4 pb-2" htmlFor="checkin">Check In</label>
            <input
              className="input-new-reservation"
              type="date"
              id="checkin"
              name="checkin"
              value={checkIn}
              min={today}
              onChange={handleCheckInChange}
            />
            {errors.checkIn && <span className="text-red-500">{errors.checkIn}</span>}
          </div>
          <div className="flex flex-col">
            <label className="text-white mt-4 pb-2" htmlFor="email">Client Email</label>
            <input
              className="input-new-reservation"
              type="email"
              id="email"
              name="email"
              onChange={handleEmailChange}
            />
            <label className="text-white mt-4 pb-2" htmlFor="checkout">Check Out</label>
            <input
              className="input-new-reservation"
              type="date"
              id="checkout"
              name="checkout"
              value={checkOut}
              min={checkIn || today}
              onChange={handleCheckOutChange}
            />
            {errors.checkOut && <span className="text-red-500">{errors.checkOut}</span>}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h1 className="text-white text-2xl font-semibold" htmlFor="habitaciones">Rooms</h1>
      </div>
      <hr className="border-white mt-2 w-full"/>
      {/* Toggle visibility of room */}
      <div className="mt-4">
        <button
          className="bg-myrtle-green text-white py-2 px-4 rounded-lg flex items-center space-x-2"
          type="button"
          onClick={toggleRoom}
        >
          <FontAwesomeIcon className="text-white" icon={faPlus} />
          <span className="text-white">Add a room(s)</span>
        </button>
      </div>
      <div className="flex justify-start items-start font-roboto" name="suite">
        {/* Display room if visible */}
        {roomVisible && (
          <div className="flex items-center justify-start mt-5 bg-myrtle-green rounded-full px-7 py-2.5 mr-auto mb-7.5">
            {/* Dropdown for room type */}
            <label className="text-white font-semibold font-roboto">Suite</label>
            {/* Counter for room quantity */}
            <div className="flex items-center mr-2.5">
              <p className="mx-2.5 text-[25px] text-white"> | </p>
              <label className="text-white font-normal font-roboto mr-2">Amount</label>
              <button className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5" onClick={decreaseSuiteQuantity}>
                -
              </button>
              <span className="border-2 rounded-full px-2 py-1.5 text-[#33665b] text-center bg-white ">
                {suiteQuantity}
              </span>
              <button className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5" onClick={increaseSuiteQuantity}>
                +
              </button>
            </div>
            {/* Counter for room guests */}
            <div className="flex items-center mr-2.5 font-['Averia Serif Libre'] text-[18px] ">
              <p className="mx-2.5 text-[25px] text-white"> | </p>
              <label className="text-white font-normal font-roboto mr-2">Guests</label>
              <button className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5" onClick={decreaseSuiteGuests}>
                -
              </button>
              <span className="border-2 rounded-full px-2 py-1.5 text-[#33665b] text-center bg-white">
                {suiteGuests}
              </span>
              <button className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5" onClick={increaseSuiteGuests}>
                +
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-start items-start" name="bungalow">
        {/* Display room if visible */}
        {roomVisible && (
          <div className="flex items-center justify-start mt-5 bg-myrtle-green rounded-full px-7 py-2.5 mr-auto mb-7.5r">
            {/* Dropdown for room type */}
            <label className="text-white font-semibold font-roboto">Bungalow</label>
            {/* Counter for room quantity */}
            <div className="flex items-center mr-2.5">
              <p className="mx-2.5 text-[25px] text-white"> | </p>
              <label className="text-white font-normal font-roboto mr-2">Amount</label>
              <button
                className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5"
                onClick={decreaseBungalowQuantity}
              >
                -
              </button>
              <span className="border-2 rounded-full px-2 py-1.5 text-[#33665b] text-center bg-white"> {bungalowQuantity} </span>
              <button
                className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5"
                onClick={increaseBungalowQuantity}
              >
                +
              </button>
            </div>
            {/* Counter for room guests */}
            <div className="flex items-center mr-2.5">
              <p className="mx-2.5 text-[25px] text-white"> | </p>
              <label className="text-white font-normal font-roboto mr-2">Guests</label>
              <button className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5" onClick={decreaseBungalowGuests}>
                -
              </button>
              <span className="border-2 rounded-full px-2 py-1.5 text-[#33665b] text-center bg-white"> {bungalowGuests} </span>
              <button className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5" onClick={increaseBungalowGuests}>
                +
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-start items-start" name="vista">
        {/* Display room if visible */}
        {roomVisible && (
          <div className="flex items-center justify-start mt-5 bg-myrtle-green rounded-full px-7 py-2.5 mr-auto mb-7.5r">
            {/* Dropdown for room type */}
            <label className="text-white font-semibold font-roboto">Garden View</label>
            {/* Counter for room quantity */}
            <div className="flex items-center mr-2.5">
              <p className="mx-2.5 text-[25px] text-white"> | </p>
              <label className="text-white font-normal font-roboto mr-2">Amount</label>
              <button className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5" onClick={decreaseVistaQuantity}>
                -
              </button>
              <span className="border-2 rounded-full px-2 py-1.5 text-[#33665b] text-center bg-white"> {vistaQuantity} </span>
              <button className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5" onClick={increaseVistaQuantity}>
                +
              </button>
            </div>
            {/* Counter for room guests */}
            <div className="flex items-center mr-2.5">
              <p className="mx-2.5 text-[25px] text-white"> | </p>
              <label className="text-white font-normal font-roboto mr-2">Guests</label>
              <button className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5" onClick={decreaseVistaGuests}>
                -
              </button>
              <span className="border-2 rounded-full px-2 py-1.5 text-[#33665b] text-center bg-white"> {vistaGuests} </span>
              <button className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5" onClick={increaseVistaGuests}>
                +
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-start items-start" name="familiar">
        {/* Display room if visible */}
        {roomVisible && (
          <div className="flex items-center justify-start mt-5 bg-myrtle-green rounded-full px-7 py-2.5 mr-auto mb-7.5r">
            {/* Dropdown for room type */}
            <label className="text-white font-semibold font-roboto">Family Suite</label>
            {/* Counter for room quantity */}
            <div className="flex items-center mr-2.5">
              <p className="mx-2.5 text-[25px] text-white"> | </p>
              <label className="text-white font-normal font-roboto mr-2">Amount</label>
              <button
                className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5"
                onClick={decreaseFamiliarQuantity}
              >
                -
              </button>
              <span className="border-2 rounded-full px-2 py-1.5 text-[#33665b] text-center bg-white"> {familiarQuantity} </span>
              <button
                className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5"
                onClick={increaseFamiliarQuantity}
              >
                +
              </button>
            </div>
            {/* Counter for room guests */}
            <div className="flex items-center mr-2.5">
              <p className="mx-2.5 text-[25px] text-white"> | </p>
              <label className="text-white font-normal font-roboto mr-2">Guests</label>
              <button className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5" onClick={decreaseFamiliarGuests}>
                -
              </button>
              <span className="border-2 rounded-full px-2 py-1.5 text-[#33665b] text-center bg-white"> {familiarGuests} </span>
              <button className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5" onClick={increaseFamiliarGuests}>
                +
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-start items-start" name="estandar">
        {/* Display room if visible */}
        {roomVisible && (
          <div className="flex items-center justify-start mt-5 bg-myrtle-green rounded-full px-7 py-2.5 mr-auto mb-7.5r">
            {/* Dropdown for room type */}
            <label className="text-white font-semibold font-roboto">Standard</label>
            {/* Counter for room quantity */}
            <div className="flex items-center mr-2.5">
              <p className="mx-2.5 text-[25px] text-white"> | </p>
              <label className="text-white font-normal font-roboto mr-2">Amount</label>
              <button
                className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5"
                onClick={decreaseEstandarQuantity}
              >
                -
              </button>
              <span className="border-2 rounded-full px-2 py-1.5 text-[#33665b] text-center bg-white"> {estandarQuantity} </span>
              <button
                className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5"
                onClick={increaseEstandarQuantity}
              >
                +
              </button>
            </div>
            {/* Counter for room guests */}
            <div className="flex items-center mr-2.5">
              <p className="mx-2.5 text-[25px] text-white"> | </p>
              <label className="text-white font-normal font-roboto mr-2">Guests</label>
              <button className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5" onClick={decreaseEstandarGuests}>
                -
              </button>
              <span className="border-2 rounded-full px-2 py-1.5 text-[#33665b] text-center bg-white"> {estandarGuests} </span>
              <button className="bg-transparent border-none cursor-pointer text-[16px] mx-2 font-roboto text-[18px] text-white p-0.5" onClick={increaseEstandarGuests}>
                +
              </button>
            </div>
          </div>
        )}
      </div>
  
      <div className="mt-8">
        <h1 className="text-white text-2xl font-semibold" htmlFor="servicios">Services</h1>
      </div>
      <hr className="border-white mt-2 w-full" />
      <div className="mt-4">
        <button
          className="bg-myrtle-green text-white py-2 px-4 rounded-lg flex items-center space-x-2"
          type="button"
          onClick={toggleService}
        >
          <FontAwesomeIcon className="text-white" icon={faPlus} />
          <span className="text-white">Add a service</span>
        </button>
      </div>
  
      <div className="mt-4">
        {serviceVisible && (
          <div className="flex flex-col mt-4">
            <div className="flex space-x-4 items-center mt-2 bg-myrtle-green rounded-xl p-4">
              <label className="text-white font-md">Spa</label>
              <div className="flex items-center">
                <button className="bg-white text-[#33665b] py-1 px-2 rounded-md" onClick={decreaseServiceDaysQuantity}>-</button>
                <span className="mx-2 text-white">{serviceDaysQuantity}</span>
                <button className="bg-white text-[#33665b] py-1 px-2 rounded-md" onClick={increaseServiceDaysQuantity}>+</button>
              </div>
            </div>
          </div>
        )}
      </div>
  
      <div className="mt-4">
        <button className="bg-[#6B98B4] hover:[#6B98B4]/50 text-white mt-4 py-2 px-4 rounded-lg" onClick={saveReservation}>Submit</button>
      </div>
  
      <Notification
        isOpen={showModal}
        toggleModal={closeModal}
        title={modalTitle}
        message={modalMessage}
      />
    </div>
  );  
}

export default NuevaReservaForm;
