import React, { useEffect, useState } from "react";
import "../../components/global.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrow,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import empoloyeeReservationBanner from "../../assets/paymentEmployee.jpeg";
import NavBar from "../navBar/navBar";
import Footer from "../footer/footer";
import RequestSender from "../../common/requestSender";
import ProfileModalEmployee from "../profileModalEmployee/profileModalEmployee";
import ProfileModalClient from "../profileModalClient/profileModalClient";
import ProfileModalAdmin from "../profileModalAdmin/profileModalAdmin";



function PaymentHistoryEmployee() {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [userName, setUserName] = useState(""); // State variable for user name
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  let absoluteTotalValue = 0;

  
  

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
    const receiptTotal = rooms
    .find((r) => r.reservationId === reservation.id)
    ?.receipt?.map((receipt) => receipt.total_pay)[0]; // Use optional chaining and check for null

    if (receiptTotal === null || receiptTotal === undefined) {
      return false; // Skip reservations without a valid receipt total
    }

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
      for (const range of selectedPriceRange) {
        switch (range) {
          case "$150 - $550":
            if (receiptTotal >= 150 && receiptTotal <= 550) {
              passPriceFilter = true;
            }
            break;
          case "$550 - $1000":
            if (receiptTotal >= 550 && receiptTotal <= 1000) {
              passPriceFilter = true;
            }
            break;
          case "$1000 - $2000":
            if (receiptTotal >= 1000 && receiptTotal <= 2000) {
              passPriceFilter = true;
            }
            break;
          case "$2000 +":
            if (receiptTotal >= 2000) {
              passPriceFilter = true;
            }
            break;
          default:
            break;
        }
        if (passPriceFilter) {
          break; // Exit loop if any range passes
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
      receiptTotal.toString() === query ||
      reservationRooms?.some((room) =>
        room.room_type.toLowerCase().includes(query)
      )
    );
  });


  const toggleEmployeeModal = () => {
    setIsEmployeeModalOpen(!isEmployeeModalOpen);
  };
  const togglelientModal = () => {
    setIsClientModalOpen(!isClientModalOpen);
  };
  const toggleAdminModal = () => {
    setIsAdminModalOpen(!isAdminModalOpen);
  };


  const name = sessionStorage.getItem('name');
  const email = sessionStorage.getItem('email');

  function openModal(modalId, reservationId, reservationStatus, e) {
    e.preventDefault();
    if (modalId === "see-more-modal") {
      const modal = document.getElementById(modalId);
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      setSelectedReservationId(reservationId);
    }
  }

  function closeModal(modalId) {
    if (modalId === "see-more-modal") {
      const modal = document.getElementById(modalId);
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
      setSelectedReservationId(null);
    }
  }

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

  const fetchReservations = async () => {
    try {
      const userEmail = sessionStorage.getItem("email");

      if (!userEmail) {
        console.error("Error: User email not found in session storage");
        return null;
      }

      const requestSender = new RequestSender();
      const response = await requestSender.sendRequest(
        "/employee/reservations",
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

  const fetchClientAmenities = async (reservationId) => {
    try {
      const requestSender = new RequestSender();
      const response = await requestSender.sendRequest(
        "/client/reservations/amenities",
        "POST",
        { reservationId: reservationId }
      );
  
      if (!response) {
        console.error("Error: Empty response received");
        return null;
      }
  
      if (response.status === 200) {
        return response.data.data.amenities; // Assuming amenities are directly under data.amenities in your response structure
      } else {
        const status_code = response.status;
        if (status_code === 404) {
          console.error("No amenities found for this reservation");
          return null;
        } else {
          throw new Error(`Unexpected status code ${status_code}`);
        }
      }
    } catch (error) {
      console.error("Error fetching amenities:", error);
      throw error;
    }
  };

  const fetchClientReceipts = async (reservationId) => {
    try {
        const requestSender = new RequestSender();
        const response = await requestSender.sendRequest(
            "client/reservations/reciept",
            "POST",
            { reservationId }
        );

        if (!response) {
            console.error("Error: Empty response received");
            return null;
        }

        if (response.status === 200) {
            return response.data.data.reciept;
        } else {
            const status_code = response.status;
            if (status_code === 404) {
                throw new Error("No receipt found for this reservation");
            } else if (status_code === 500) {
                throw new Error("Internal server error, please try again later");
            } else {
                throw new Error(`Unexpected status code ${status_code}`);
            }
        }
    } catch (error) {
        console.error("Error fetching receipt:", error);
        throw error;
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
            const amenities = await fetchClientAmenities(reservation.id);
            const receipt = await fetchClientReceipts(reservation.id); 
            return { reservationId: reservation.id, rooms, amenities, receipt  };
          } catch (error) {
            console.error(
              `Error fetching rooms and amenities for reservation ${reservation.id}:`,
              error
            );
            return { reservationId: reservation.id, rooms: [], amenities: [], receipt: null };
          }
        })
      );

      setReservations(reservations);
      setRooms(roomsData);
    } catch (error) {
      console.error("Error fetching reservations and rooms:", error);
    }
  };


  const calculateNumberOfDays = (checkIn, checkOut) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
  
    const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay));
    return diffDays;
  };

  const calculateTotalPriceRoom = (checkIn, checkOut, roomPrice) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
  
    const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay));
    const totalPrice = diffDays * roomPrice;

    absoluteTotalValue += totalPrice;

    return totalPrice;
  };

  const calculateTotalPriceAmm = (amenityGuests, amenityPrice) => {
    const totalPrice = amenityGuests * amenityPrice;

    absoluteTotalValue += totalPrice;

    return totalPrice;
  };

  
  

  return (
    <div>
      <NavBar
        openEmployeeModal={toggleEmployeeModal}
        openClientModal={togglelientModal}
        openAdminModal={toggleAdminModal}
      />

      

      <div className="hero-section">
        <img src={empoloyeeReservationBanner} alt="Employee Reservation Banner" />
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
            Receipts
          </h1>
        </div>

        <div className="flex mt-8 mb-6 justify-start items-start"> </div>
        
        <div className="relative shadow-2xl sm:rounded-lg bg-[#FFFCF7]">

          {/*Search and Filter Div */}
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

          {/*Table Div */}
          <div className="overflow-x-auto">
            
            <table className="w-full text-sm text-left text-gray-500">
              {/*Table Titles*/}
              <thead className="text-xs text-white uppercase bg-[#6B98B4]">
                <tr>

                  <th scope="col" className="text-center px-6 py-2 uppercase">
                    Client Name
                  </th>
                  <th scope="col" className="text-center px-6 py-2 uppercase">
                    Reservation ID
                  </th>
                  <th scope="col" className="text-center px-6 py-3 uppercase">
                    Status
                  </th>
                  <th scope="col" className="text-center px-6 py-3 uppercase">
                    Total Amount
                  </th>
                  <th scope="col" className="text-center px-6 py-3 uppercase">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 uppercase"></th>
                </tr>
              </thead>
              {/*Table Body*/}
              <tbody>
                {filteredReservations.length === 0 ? (
                  <tr className="bg-white">
                    <td
                      colSpan="8"
                      className=" bg-white text-center text-3xl text-[#6d9dc5] py-44"
                    >
                      No recepits found
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >

                      <td className="text-center px-6 py-4">{reservation.User_name}</td>

                      <td className="text-center px-6 py-16">{reservation.id}</td>
                      
                      <td className="text-center px-6 py-4">
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
                      
                      <td className="text-center px-6 py-4">
                              
                        <div className="">
                            {rooms.find((r) => r.reservationId === reservation.id)?.receipt.map((receipt) => (
                                <div key={receipt.id}>
                                  ${receipt.total_pay}
                                </div>
                            ))}
                        </div>
                              
                      </td>
                      <td className="text-center px-6 py-4">
                        {new Date(reservation.check_in).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href="#"
                          type="button"
                          data-modal-target=""
                          data-modal-show=""
                          className="font-medium text-gray-500 p-2"
                          onClick={(e) =>
                            openModal(
                              "see-more-modal",
                              reservation.id,
                              reservation.reservation_status,
                              e
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          
          {/* Se More Modal */}
          <div 
            id="see-more-modal" 
            tabindex="-1" 
            aria-hidden="true" 
            class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-end items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
          >
            <div class="relative p-4 w-full max-w-2xl max-h-full ml-auto">
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                      
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-lime-900 dark:text-white">
                        PAYMENT DETAILS
                    </h3>
                    
                    <button 
                      type="button" 
                      class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" 
                      onClick={() => closeModal("see-more-modal")}
                    >
                      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                      </svg>
                      <span class="sr-only">Close modal</span>
                    </button>

                    
                </div>
                
                <div className="overflow-x-auto">
                  {filteredReservations.length === 0 ? (
                    <div className="bg-white text-center text-3xl text-[#6d9dc5] py-44">
                      No receipt info found
                    </div>
                  ) : (
                    filteredReservations
                    .filter((reservation) => reservation.id === selectedReservationId) 
                    .map((reservation) => (
                      <div  key={reservation.id} className="bg-white border-b hover:bg-gray-50 p-6 mb-4" >
                        
                        <div className="mb-2">

                          <span className="font">Payment information for your reservation</span>

                          <br/>

                          <span className="font-bold">General Information</span>
                          <br/>

                          <div className="mt-4">
                              {rooms.find((r) => r.reservationId === reservation.id)?.receipt ? (
                                  <div className="overflow-x-auto">
                                      {/* Display receipt details here */}
                                      {rooms.find((r) => r.reservationId === reservation.id)?.receipt.map((receipt) => (
                                          <div key={receipt.id}>
                                            <span className="font-bold">Payment Date </span>
                                            <br/>
                                            {new Date(receipt.recipt_date).toLocaleDateString()}
                                          </div>
                                      ))}
                                  </div>
                              ) : (
                                  <div>No receipt found for this reservation</div>
                              )}
                          </div>

                        </div>

                        <hr />

                        {/* Rooms Information */}
                        <div className="mt-4">
                          <span className="font-bold">Rooms</span>
                          <br />
                          {rooms.find((r) => r.reservationId === reservation.id)?.rooms.map((room) => (
                              <div key={room.id} className="mt-2">
                                {room.room_type}
                                <br/>

                                <div className="grid grid-cols-2 gap-4">

                                  <div>
                                    {calculateNumberOfDays(reservation.check_in, reservation.check_out)}
                                    <span className="font"> x </span>
                                    ${room.price}
                                  </div>

                                  <div>
                                    ${calculateTotalPriceRoom(reservation.check_in, reservation.check_out, room.price)}
                                  </div>

                                </div>
                                

                                <br />
                              </div>
                          ))}

                        </div>
                        
                        <hr />

                        <div className="mt-4">
                          <span className="font-bold">Services</span>
                          <br />

                          
                          {rooms.find((r) => r.reservationId === reservation.id)?.amenities.map((amenity) => (
                              <div key={amenity.service_id}>
                                {amenity.amenitie_name}
                                <br/>

                                <div className="grid grid-cols-2 gap-4">

                                  <div>
                                    {amenity.guests} 
                                    <span className="font"> x </span>
                                    ${amenity.price}
                                  </div>

                                  <div>
                                    ${calculateTotalPriceAmm(amenity.guests, amenity.price)}
                                  </div>

                                </div>
                                
                                <div>
                                  <span className="font">Saved date </span>
                                  <br/>
                                  {new Date(amenity.date).toLocaleDateString()}
                                </div>

                                <br />
                              </div>
                          ))}

                        </div>
                        
                        <hr />

                        {/* Absolute Total Price */}
                        <div className="mt-4">
                          <span className="font-bold">TOTAL PAYMENT: </span>
                              ${absoluteTotalValue}
                          </div>


                      </div>
                    ))
                  )}
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
      </div>
      <Footer />
    </div>
  );
}

export default PaymentHistoryEmployee;
