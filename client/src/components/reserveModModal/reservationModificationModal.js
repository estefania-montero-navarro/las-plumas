import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import RequestSender from "../../common/requestSender";

import { Datepicker } from "flowbite-react";
import { Dropdown } from "flowbite-react";

function ReservationModModal({
  isOpen,
  toggleModal,
  reservationId,
  minCheckInDate,
  minCheckOutDate,
}) {
  if (!isOpen) return null;
  const [notification, setNotification] = useState("");
  const [user, setUser] = useState("");
  const [rooms, setRooms] = useState([]);
  const [amenities, setAmenities] = useState([]);

  if (user === "" || rooms.length === 0) {
    const reqInfo = {
      reservationId: reservationId,
    };
    const endpoint = "reservation?id=" + reservationId;
    const requestSender = new RequestSender();
    requestSender.sendRequest(endpoint, "GET", reqInfo).then((response) => {
      if (response.status === 200) {
        setUser(response.data.reservationData.user);
        setRooms(switchDBRoomsToFERooms(response.data.reservationData.rooms));
        setAmenities(response.data.reservationData.amenities)
        console.log(response.data.reservationData);
        console.log("Amenidades en el fetch", amenities);
      } else {
        setNotification(response.data.message);
      }
    });
  }

  const switchDBRoomsToFERooms = (rooms) => {
    let roomTypes = [];
    rooms.forEach((room) => {
      switch (room) {
        case "vista":
          roomTypes.push("Garden View");
          break;
        case "familiar":
          roomTypes.push("Family suite");
          break;
        case "suite":
          roomTypes.push("Suite");
          break;
        case "estandar":
          roomTypes.push("Standard");
          break;
        case "bungalow":
          roomTypes.push("Bungalow");
          break;
      }
    });
    return roomTypes;
  };

  const handleOptionSelect = (index, option) => {
    const newOptions = [...rooms];
    newOptions[index] = option;
    setRooms(newOptions);
  };

  const addRoom = (e) => {
    e.preventDefault();
    setRooms([...rooms, "Suite"]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;
    const reqInfo = {
      reservationId: reservationId,
      checkIn: checkIn,
      checkOut: checkOut,
      rooms: rooms,
      amenities: amenities,
    };
    const endpoint = "reservation";
    const requestSender = new RequestSender();
    requestSender.sendRequest(endpoint, "PUT", reqInfo).then((response) => {
      if (response.status === 200) {
        document.getElementById("notification").style.color = "black";
        setNotification(
          "Reservation updated successfully, please refresh the page to view the changes. A confirmation email has been sent."
        );
      } else {
        setNotification(response.data.message);
      }
    });
  };

  return (
    <div>
      {/* <!-- Main modal --> */}
      <div
        id="crud-modal"
        tabIndex="-1"
        aria-hidden="false"
        className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex items-center justify-center min-h-screen w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative justify-center bg-air-superiority-blue rounded-xl rounded-lg text-white shadow">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-center p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-2xl mx-auto font-roboto font-bold text-white">
                EDIT RESERVATION
              </h3>
              <button
                type="button"
                className="text-white bg-transparent hover:bg-gray-200 hover:text-white rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                data-modal-toggle="crud-modal"
                onClick={toggleModal}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="false"
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
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="flex justify-center bg-white rounded-md ml-2 mr-2 mt-2">
              <p id="notification" className="text-red-500 font-roboto py-3 px-2">
                {notification}
              </p>
            </div>

            {/* <!-- Modal body --> */}
            <form className="p-4 md:p-5 text-md">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="id"
                    className="block mb-2 text-sm font-roboto text-white dark:text-white"
                  >
                    ID: {reservationId}
                  </label>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="user"
                    className="block mb-2 text-sm font-roboto text-white dark:text-white"
                  >
                    User: {user}
                  </label>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="checkIn"
                    className="block mb-2 text-sm font-roboto text-white dark:text-white"
                  >
                    Check-in
                  </label>

                  <Datepicker id="checkIn" minDate={new Date(minCheckInDate)} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="checkOut"
                    className="block mb-2 text-sm font-roboto text-white"
                  >
                    Check-out
                  </label>

                  <Datepicker
                    id="checkOut"
                    minDate={new Date(minCheckOutDate)}
                  />
                </div>

                <div className="col-span-2 items-center sm:col-span-1 ">
                  <label
                    htmlFor="rooms"
                    className="block mb-2 text-sm justify-center font-roboto text-white"
                  >
                    Rooms
                  </label>
                  {rooms.map((room, index) => (
                    <Dropdown
                      class="flex gap-4 mb-4 bg-white text-gray-900 font-roboto rounded-lg w-full items-center justify-center"
                      key={index}
                      label={rooms[index]}
                      dismissOnClick={false}
                    >
                      <Dropdown.Item
                        onClick={() => handleOptionSelect(index, "Suite")}
                      >
                        Suite
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleOptionSelect(index, "Bungalow")}
                      >
                        Bungalow
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleOptionSelect(index, "Garden View")}
                      >
                        Garden View
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handleOptionSelect(index, "Family Suite")
                        }
                      >
                        Family Suite
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleOptionSelect(index, "Standard")}
                      >
                        Standard
                      </Dropdown.Item>
                    </Dropdown>
                  ))}
                  <button
                    type="submit"
                    className="text-white inline-flex mx-auto items-center bg-myrtle-green hover:bg-myrtle-green/70 focus:ring-4 focus:outline-none focus:ring-blue-300 font-roboto rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={addRoom}
                  >
                    Add room +
                  </button>
                </div>
                <div className="col-span-2 items-center sm:col-span-1 gap-3 ">
                  
                  <h2>Reserved Amenities</h2>
                  <div className="flex flex-col gap-2">
                    {amenities.map((amenityId, index) => {
                      return (
                        <div
                        className="flex flex-row justify-center items-center bg-white p-2 rounded-lg gap-3"
                        key={index}
                        >
                          <span className="text-black">{amenities[index]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-center">
                <button
                  type="submit"
                  className="text-white inline-flex mx-auto items-center bg-myrtle-green hover:bg-myrtle-green/70 focus:ring-4 focus:outline-none focus:ring-blue-300 font-roboto rounded-lg text-sm px-5 py-2.5 text-center"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ReservationModModal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   toggleModal: PropTypes.func.isRequired,
//   reservationId: PropTypes.string.isRequired,
//   minCheckInDate: PropTypes.object.isRequired,
//   minCheckOutDate: PropTypes.object.isRequired,
// };

export default ReservationModModal;
