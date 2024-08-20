import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../components/global.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCrow,
  faPencil,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import employeeReservationBanner from "../../assets/employeeReservationBanner.jpg";
import NavBar from "../navBar/navBar";
import Footer from "../footer/footer";
import ProfileModalEmployee from "../profileModalEmployee/profileModalEmployee";
import ProfileModalClient from "../profileModalClient/profileModalClient";
import ProfileModalAdmin from "../profileModalAdmin/profileModalAdmin";
import RequestSender from "../../common/requestSender";
import ReservationModModal from "../reserveModModal/reservationModificationModal";
import Notification from "../notification/notification";
import { ReservationContext } from "../../contexts/reservation";

function Reservations() {
  const [isModModalOpen, setIsModModalOpen] = useState(false);
  const [modReservId, setModReservId] = useState(0);
  const [modCheckIn, setModCheckIn] = useState("");
  const [modCheckOut, setModCheckOut] = useState("");
  const [, setRerender] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [userName, setUserName] = useState("");
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleModModal = (reservId, minCheckInDate, minCheckOutDate) => {
    setModReservId(reservId);
    setModCheckIn(minCheckInDate);
    setModCheckOut(minCheckOutDate);
    setIsModModalOpen((prev) => !prev);
    setRerender((prev) => !prev);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleFilter = (filter, setFilter, value) => {
    setFilter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClearFilters = () => {
    setSelectedStatus([]);
    setSelectedTimeRange([]);
    setSelectedPriceRange([]);
  };

  const filteredReservations = reservations.filter((reservation) => {
    const query = searchQuery.toLowerCase();
    const reservationRooms = rooms.find(
      (r) => r.reservationId === reservation.id
    )?.rooms;
    const totalPrice = reservationRooms
      ? reservationRooms.reduce((sum, room) => sum + room.price, 0)
      : 0;

    // Status Filter
    if (
      selectedStatus.length > 0 &&
      !selectedStatus.includes(reservation.reservation_status)
    ) {
      return false;
    }

    // Time Range Filter
    const checkInDate = new Date(reservation.check_in);
    const now = new Date();
    if (selectedTimeRange.includes("Current Month")) {
      if (
        checkInDate.getMonth() !== now.getMonth() ||
        checkInDate.getFullYear() !== now.getFullYear()
      ) {
        return false;
      }
    }
    if (selectedTimeRange.includes("Last Month")) {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      if (
        !(
          checkInDate >= lastMonth &&
          checkInDate < new Date(now.getFullYear(), now.getMonth(), 1)
        )
      ) {
        return false;
      }
    }
    if (
      selectedTimeRange.includes("Last 6 months") &&
      checkInDate < new Date(now.getFullYear(), now.getMonth() - 6, 1)
    ) {
      return false;
    }

    // Price Range Filter
    if (selectedPriceRange.length > 0) {
      let passPriceFilter = false;
      totalPrice: for (const range of selectedPriceRange) {
        switch (range) {
          case "$150 - $550":
            if (totalPrice >= 150 && totalPrice <= 550) {
              passPriceFilter = true;
              break totalPrice;
            }
            break;
          case "$550 - $1000":
            if (totalPrice > 550 && totalPrice <= 1000) {
              passPriceFilter = true;
              break totalPrice;
            }
            break;
          case "$1000 - $2000":
            if (totalPrice > 1000 && totalPrice <= 2000) {
              passPriceFilter = true;
              break totalPrice;
            }
            break;
          case "$2000 +":
            if (totalPrice > 2000) {
              passPriceFilter = true;
              break totalPrice;
            }
            break;
          default:
            break;
        }
      }
      if (!passPriceFilter) {
        return false;
      }
    }

    // Search Query Filter
    return (
      reservation.id.toString() === query ||
      reservation.reservation_status.toLowerCase() === query ||
      checkInDate.getDate().toString() === query || // Check if the day of check-in matches the query
      totalPrice.toString() === query ||
      reservationRooms?.some((room) =>
        room.room_type.toLowerCase().includes(query)
      ) ||
      reservation.User_name.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    if (!isModModalOpen) {
      // This block will run whenever myBoolean changes from true to false
      console.log("myBoolean changed from true to false");
      setRerender((prev) => !prev); // Trigger a state change to cause a rerender
    }
  }, [isModModalOpen]);

  const toggleEmployeeModal = () => {
    setIsEmployeeModalOpen(!isEmployeeModalOpen);
  };
  const togglelientModal = () => {
    setIsClientModalOpen(!isClientModalOpen);
  };
  const toggleAdminModal = () => {
    setIsAdminModalOpen(!isAdminModalOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const openModal = (modalId, reservationId, reservationStatus, e) => {
    e.preventDefault();
    if (modalId === "deleteModal") {
      if (reservationStatus === "active") {
        const modal = document.getElementById(modalId);
        modal.classList.remove("hidden");
        modal.setAttribute("aria-hidden", "false");
        setSelectedReservationId(reservationId);
      } else {
        setShowAlert(true);
      }
    } else {
      // edit open modal
      const modal = document.getElementById(modalId);
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      setSelectedReservationId(reservationId);
    }
  };

  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    setSelectedReservationId(null);
  };

  useEffect(() => {
    getUserReservationsAndRooms();
    getUserName();
  }, []);

  const getUserName = async () => {
    const storedUserName = sessionStorage.getItem("name");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  };

  const getUserReservationsAndRooms = async () => {
    try {
      const reservations = await fetchReservations();
      if (!reservations) {
        console.error("No reservations found for the user");
        return;
      }
      const roomsData = await Promise.all(
        reservations.map(async (reservation) => {
          try {
            const rooms = await fetchClientReservationRooms(reservation.id);
            return { reservationId: reservation.id, rooms };
          } catch (error) {
            console.error(
              `Error fetching rooms for reservation ${reservation.id}:`,
              error
            );
            return { reservationId: reservation.id, rooms: [] };
          }
        })
      );

      setReservations(reservations);
      setRooms(roomsData);
    } catch (error) {
      console.error("Error fetching reservations and rooms:", error);
    }
  };

  const fetchReservations = async () => {
    try {
      const userEmail = sessionStorage.getItem("email");

      if (!userEmail) {
        console.error("Error: User email not found in session storage");
        return null;
      }

      const requestSender = new RequestSender();
      const response = await requestSender.sendRequest(
        "employee/reservations",
        "POST",
        {}
      );

      if (!response) {
        console.error("Error: Empty response received");
        return null;
      }

      if (response.status === 200) {
        return response.data.data.reservations;
      } else {
        const status_code = response.status;
        if (status_code === 401 || status_code === 403) {
          throw new Error("Invalid credentials");
        } else {
          throw new Error(`Unexpected status code ${status_code}`);
        }
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      throw error;
    }
  };

  const fetchClientReservationRooms = async (reservationId) => {
    try {
      const requestSender = new RequestSender();
      const response = await requestSender.sendRequest(
        `client/rooms/${reservationId}`,
        "GET"
      );

      if (!response) {
        console.error("Error: Empty response received");
        return null;
      }

      if (response.status === 200) {
        return response.data.data.rooms;
      } else {
        const status_code = response.status;
        if (status_code === 401 || status_code === 403) {
          throw new Error("Invalid credentials");
        } else {
          throw new Error(`Unexpected status code ${status_code}`);
        }
      }
    } catch (error) {
      console.error("Error fetching reservation rooms:", error);
      throw error;
    }
  };

  const deleteReservation = async () => {
    console.error("ENTERD");
    try {
      const requestSender = new RequestSender();
      const response = await requestSender.sendRequest(
        `employee/reservations/cancel`,
        "POST",
        { id: selectedReservationId }
      );

      if (!response) {
        console.error("Error: Empty response received");
        return null;
      }

      if (response.status === 202) {
        // Successfully deleted the reservation, now refresh the reservations list
        console.error("Delete Success!");
        getUserReservationsAndRooms();
      } else {
        console.error(
          `Failed to delete reservation with ID ${selectedReservationId}`
        );
      }
      closeModal("deleteModal");
    } catch (error) {
      console.error(
        `Error deleting reservation with ID ${selectedReservationId}:`,
        error
      );
    }
  };

  return (
    <div>
      <NavBar
        openEmployeeModal={toggleEmployeeModal}
        openClientModal={togglelientModal}
        openAdminModal={toggleAdminModal}
      />

      {showAlert && (
        <div
          id="alert-1"
          className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-center p-4 text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 w-1/2 h-20"
          role="alert"
        >
          <svg
            className="flex-shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div className="ms-3 text-sm font-medium">
            Only active reservations can be deleted.
          </div>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
            onClick={() => setShowAlert(false)}
            aria-label="Close"
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
      )}

      <div className="hero-section">
        <img
          src={employeeReservationBanner}
          alt="Employee Reservation Banner"
        />
      </div>
      <div className="employee-icon-container"></div>
      <div className="flex justify-center bg-[#FFFCF7] text-4xl">
        <FontAwesomeIcon
          className="employee-icon"
          icon={faCrow}
        ></FontAwesomeIcon>
      </div>
      <div>
        <h1 className="flex justify-center font-medium text-5xl text-[#4C83A5] bg-[#FFFCF7]">
          {userName}
        </h1>
      </div>
      <div className="items-center p-16 bg-[#FFFCF7]">
        <div className="flex flex-col items-center justify-center bg-[#FFFCF7]">
          <h1 className="p-4 font-black text-[#33665B] text-4xl uppercase">
            Reservations
          </h1>
        </div>
        <div className="flex mt-8 mb-6 justify-start items-start">
          <Link className="links" to="/employee-booking-new">
            <button
              type="submit"
              className="flex justify-center rounded-xl bg-[#48744C] font-normal text-white shadow-md p-3"
            >
              <FontAwesomeIcon
                className="flex text-sm font-medium mt-0.5"
                icon={faPlus}
              />
              <p className="text-sm font-medium uppercase ml-2 whitespace-nowrap">
                New Reservation
              </p>
            </button>
          </Link>
        </div>

        <div className="relative shadow-2xl sm:rounded-lg bg-[#FFFCF7]">
          <div className="rounded-t-lg flex overflow-x-auto items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 px-4 bg-[#6B98B4]">
            <div>
              <button
                id="dropdownActionButton"
                data-dropdown-toggle="dropdownAction"
                className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5"
                type="button"
                onClick={toggleDropdown}
              >
                <span className="sr-only">Action button</span>
                Filter
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div
                  id="dropdownAction"
                  className="absolute top-12 right-4 left-4 mt-4 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-52 z-10"
                >
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-[#4c83a5] mb-2">
                      Reservation Status
                    </h3>
                    <ul className="flex flex-col space-y-2">
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-[#6d9dc5] rounded-sm"
                            checked={selectedStatus.includes("active")}
                            onChange={() =>
                              toggleFilter(
                                selectedStatus,
                                setSelectedStatus,
                                "active"
                              )
                            }
                          />
                          <span className="ml-2">Active</span>
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-[#6d9dc5] rounded-sm"
                            checked={selectedStatus.includes("inactive")}
                            onChange={() =>
                              toggleFilter(
                                selectedStatus,
                                setSelectedStatus,
                                "inactive"
                              )
                            }
                          />
                          <span className="ml-2">Inactive</span>
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-[#6d9dc5] rounded-sm"
                            checked={selectedStatus.includes("canceled")}
                            onChange={() =>
                              toggleFilter(
                                selectedStatus,
                                setSelectedStatus,
                                "canceled"
                              )
                            }
                          />
                          <span className="ml-2">Canceled</span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-[#4c83a5] mb-2">
                      Time Range
                    </h3>
                    <ul className="flex flex-col space-y-2">
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-[#6d9dc5] rounded-sm"
                            checked={selectedTimeRange.includes(
                              "Current Month"
                            )}
                            onChange={() =>
                              toggleFilter(
                                selectedTimeRange,
                                setSelectedTimeRange,
                                "Current Month"
                              )
                            }
                          />
                          <span className="ml-2">Current Month</span>
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-[#6d9dc5] rounded-sm"
                            checked={selectedTimeRange.includes("Last Month")}
                            onChange={() =>
                              toggleFilter(
                                selectedTimeRange,
                                setSelectedTimeRange,
                                "Last Month"
                              )
                            }
                          />
                          <span className="ml-2">Last Month</span>
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-[#6d9dc5] rounded-sm"
                            checked={selectedTimeRange.includes(
                              "Last 6 months"
                            )}
                            onChange={() =>
                              toggleFilter(
                                selectedTimeRange,
                                setSelectedTimeRange,
                                "Last 6 months"
                              )
                            }
                          />
                          <span className="ml-2">Last 6 months</span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-[#4c83a5] mb-2">
                      Price Range
                    </h3>
                    <ul className="flex flex-col space-y-2">
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-[#6d9dc5] rounded-sm"
                            checked={selectedPriceRange.includes("$150 - $550")}
                            onChange={() =>
                              toggleFilter(
                                selectedPriceRange,
                                setSelectedPriceRange,
                                "$150 - $550"
                              )
                            }
                          />
                          <span className="ml-2">$150 - $550</span>
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-[#6d9dc5] rounded-sm"
                            checked={selectedPriceRange.includes(
                              "$550 - $1000"
                            )}
                            onChange={() =>
                              toggleFilter(
                                selectedPriceRange,
                                setSelectedPriceRange,
                                "$550 - $1000"
                              )
                            }
                          />
                          <span className="ml-2">$550 - $1000</span>
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-[#6d9dc5]  rounded-sm"
                            checked={selectedPriceRange.includes(
                              "$1000 - $2000"
                            )}
                            onChange={() =>
                              toggleFilter(
                                selectedPriceRange,
                                setSelectedPriceRange,
                                "$1000 - $2000"
                              )
                            }
                          />
                          <span className="ml-2">$1000 - $2000</span>
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-[#6d9dc5] rounded-sm"
                            checked={selectedPriceRange.includes("$2000 +")}
                            onChange={() =>
                              toggleFilter(
                                selectedPriceRange,
                                setSelectedPriceRange,
                                "$2000 +"
                              )
                            }
                          />
                          <span className="ml-2">$2000 +</span>
                        </label>
                      </li>
                    </ul>
                    <div className="p-4 flex justify-end">
                      <button
                        className="text-sm text-[#4c83a5] hover:text-[#4c83a5] focus:outline-none"
                        onClick={() => handleClearFilters()}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search-users"
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-white uppercase bg-[#6B98B4]">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Check-In
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Check-Out
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Rooms
                  </th> 
                  <th scope="col" className="px-6 py-3">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.length === 0 ? (
                  <tr className="bg-white">
                    <td
                      colSpan="8"
                      className=" bg-white text-center text-3xl text-[#6d9dc5] py-44"
                    >
                      No reservations found
                    </td>
                    <td></td>
                  </tr>
                ) : (
                  filteredReservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-16">{reservation.id}</td>
                      <td className="px-6 py-4">{reservation.User_name}</td>
                      <td className="px-6 py-4">
                        {reservation.reservation_status === "active" ? (
                          <p className="flex items-center gap-2 justify-start text-[#979797] font-normal">
                            <span className="h-1 w-1 rounded-full bg-green-500 inline-block"></span>
                            {reservation.reservation_status}
                          </p>
                        ) : (
                          <p className="flex items-center gap-2 justify-start text-[#979797] font-normal">
                            <span className="h-1 w-1 rounded-full bg-red-500 inline-block"></span>
                            {reservation.reservation_status}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(reservation.check_in).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(reservation.check_out).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {rooms
                          .find((r) => r.reservationId === reservation.id)
                          ?.rooms.map((room, index) => (
                            <div key={index} className="py-2">
                              <span className="font-semibold">
                                {index + 1}:{" "}
                              </span>
                              {room.room_type}
                            </div>
                          ))}
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          const reservationRooms = rooms.find(
                            (r) => r.reservationId === reservation.id
                          )?.rooms;
                          if (reservationRooms) {
                            const totalPrice = reservationRooms.reduce(
                              (sum, room) => sum + room.price,
                              0
                            );
                            return (
                              <div>
                                <span className="font-semibold">
                                  ${totalPrice}
                                </span>
                              </div>
                            );
                          } else {
                            return <div>No rooms available</div>;
                          }
                        })()}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href="#"
                          type="button"
                          data-modal-target="editUserModal"
                          data-modal-show="editUserModal"
                          className="font-medium text-gray-500 p-2"
                          onClick={(e) =>
                            toggleModModal(
                              reservation.id,
                              reservation.check_in,
                              reservation.check_out
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </a>
                        <a
                          href="#"
                          type="button"
                          data-modal-target="deleteModal"
                          data-modal-show="deleteModal"
                          className="font-medium text-gray-500 p-2"
                          onClick={(e) =>
                            openModal(
                              "deleteModal",
                              reservation.id,
                              reservation.reservation_status,
                              e
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <ReservationModModal
            isOpen={isModModalOpen}
            toggleModal={toggleModModal}
            reservationId={modReservId}
            minCheckInDate={modCheckIn}
            minCheckOutDate={modCheckOut}
          />

          {/* Delete Modal */}
          <div
            id="deleteModal"
            tabIndex="-1"
            aria-hidden="true"
            className="hidden fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-75"
          >
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
              <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                {/* Close button */}
                <button
                  type="button"
                  className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="deleteModal"
                  onClick={(e) => closeModal("deleteModal", e)}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <svg
                  className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <p className="mb-4 text-gray-500 dark:text-gray-300">
                  Are you sure you want to delete this reservation?
                </p>
                <div className="flex justify-center items-center space-x-4">
                  <button
                    data-modal-toggle="deleteModal"
                    type="button"
                    className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    onClick={(e) => closeModal("deleteModal", e)}
                  >
                    No, cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick={deleteReservation}
                  >
                    Yes, I&apos;m sure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProfileModalEmployee
        isOpen={isEmployeeModalOpen}
        toggleModal={toggleEmployeeModal}
      />
      <ProfileModalClient
        isOpen={isClientModalOpen}
        toggleModal={togglelientModal}
      />
      <ProfileModalAdmin
        isOpen={isAdminModalOpen}
        toggleModal={toggleAdminModal}
      />
      <Footer />
    </div>
  );
}

export default Reservations;
