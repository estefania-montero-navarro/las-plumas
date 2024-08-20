import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../navBar/navBar";
import Footer from "../footer/footer";
import ProfileModalClient from "../profileModalClient/profileModalClient";
import { AuthContext } from "../../contexts/authContext";
import RequestSender from "../../common/requestSender";
import Notification from "../notification/notification";
import NotificationWithAction from "../notificationWithAction/notificacionWithAction";
import "../../components/global.css";
import suiteOceanfront from "../../assets/suite oceanfront.png";
import beachBungalow from "../../assets/beach bungalow.png";
import gardenView from "../../assets/garden view.png";
import familySuite from "../../assets/family suite.png";
import standard from "../../assets/standard.png";
import ReservationBanner from "../../assets/reservationBanner.png";
import Spa from "../../assets/spa.png";
import Transportation from "../../assets/transportation.png";
import Gym from "../../assets/gym.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "flowbite-react";
import { faUser, faBed, faDollarSign } from "@fortawesome/free-solid-svg-icons";

function NewClientReservation() {
  const { isAuthenticated } = useContext(AuthContext);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [spaDate, setSpaDate] = useState("");
  const [gymDate, setGymDate] = useState("");
  const [transportationDate, setTransportationDate] = useState("");
  const [errors, setErrors] = useState({});
  const [counts, setCounts] = useState({
    suiteOceanfront: 0,
    beachBungalow: 0,
    gardenView: 0,
    familySuite: 0,
    standard: 0,
    rooms: 1,
    guests: 1,
    spaGuests: 0,
    gymGuests: 0,
    transportationGuests: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const userEmail = sessionStorage.getItem("email");
  const [roomVariables, setRoomVariables] = useState({});
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [visibleStates, setVisibleStates] = useState([false, false, false]);

  const toggleVisibility = (index) => {
    let guestType;
  
    switch (index) {
      case 0:
        guestType = "spaGuests";
        break;
      case 1:
        guestType = "gymGuests";
        break;
      case 2:
        guestType = "transportationGuests";
        break;
      default:
        guestType = null;
    }
  
    setVisibleStates((prev) => {
      const newStates = [...prev];
      const newState = !newStates[index];
      newStates[index] = newState;
  
      if (!newState && guestType) {
        resetGuestData(guestType);
      }
  
      return newStates;
    });
  };
  
  const resetGuestData = (guestType) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [guestType]: 0,
    }));
  
    switch (guestType) {
      case "spaGuests":
        setSpaDate("");
        break;
      case "gymGuests":
        setGymDate("");
        break;
      case "transportationGuests":
        setTransportationDate("");
        break;
      default:
        break;
    }
  };
  
  
  let roomsSelected = 0;
  const navigate = useNavigate();
  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };
  const mapRoomsToVariables = (roomsData) => {
    const roomVariables = {};
    roomsData.forEach((room) => {
      roomVariables[room.room_type] = room.available_rooms;
    });
    return roomVariables;
  };
  const fetchAvailableRooms = async () => {
    try {
      const requestSender = new RequestSender();
      const response = await requestSender.sendRequest(
        "available-rooms",
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
      console.error("Error fetching available rooms:", error);
      throw error;
    }
  };

  useEffect(() => {
    const getAvailableRooms = async () => {
      const rooms = await fetchAvailableRooms();
      const roomVariables = mapRoomsToVariables(rooms);
      setRoomVariables(roomVariables);
    };
    getAvailableRooms();
  }, []);

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

  const handleGymDateChange = (event) => {
    const value = event.target.value;
    setGymDate(value);
  }
  const handleTransportationDateChange = (event) => {
    const value = event.target.value;
    setTransportationDate(value);
  }
  const handleSpaDateChange = (event) => {
    const value = event.target.value;
    setSpaDate(value);
  }

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

  const updateRoomAmount = (counts) => {
    return (
      counts.suiteOceanfront +
      counts.beachBungalow +
      counts.gardenView +
      counts.familySuite +
      counts.standard
    );
  };

  const increment = (room) => {
    setCounts((prevCounts) => {
      const newCounts = {
        ...prevCounts,
        [room]: prevCounts[room] + 1,
      };
      roomsSelected = updateRoomAmount(newCounts);
  
      if(room === "spaGuests" || room === "gymGuests" || room === "transportationGuests") {
        console.log(newCounts[room]);
        console.log(prevCounts.guests);
        if(newCounts[room] > prevCounts.guests) {
          return prevCounts;
        } else {
          return newCounts;
        }
      } else {
        if (roomsSelected > prevCounts.rooms ) {
          return prevCounts;
        } else {
          return newCounts;
        }
      }
    });
  };
  

  const decrement = (room) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [room]: prevCounts[room] > 0 ? prevCounts[room] - 1 : 0,
    }));
  };

  const handleChange = (event, room) => {
    const value = parseInt(event.target.value, 10);
    setCounts((prevCounts) => {
      const newCounts = {
        ...prevCounts,
        [room]: isNaN(value) ? 0 : value,
      };
        
      if (room === "spaGuests" || room === "gymGuests" || room === "transportationGuests") {
        if (newCounts[room] > prevCounts.guests) {
          return prevCounts;
        }
      } else {
        const roomsSelected = updateRoomAmount(newCounts);
        if (roomsSelected > prevCounts.rooms) {
          return prevCounts;
        }
      }
  
      return newCounts;
    });
  };
  
  const calculateNights = () => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      // Calcular la diferencia en milisegundos
      const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
      
      // Convertir la diferencia de milisegundos a días
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      
      return differenceInDays;
    }
    return 0;
  };
  
  const calculateTotalAmount = () => {
    let nights = calculateNights();
    let total = counts.suiteOceanfront * 550 * nights
    + counts.beachBungalow * 400 * nights
    + counts.gardenView * 300 * nights
    + counts.familySuite * 250 * nights
    + counts.standard * 150 * nights
    + counts.spaGuests * 50 
    + counts.gymGuests * 10
    + counts.transportationGuests * 30;
    return total;
  }

  const toggleClientModal = () => {
    setIsClientModalOpen(!isClientModalOpen);
  };

  const reservationInfoJSON = {
    email: userEmail,
    checkIn: checkIn,
    checkOut: checkOut,
    guests:counts.guests, 
    nights: calculateNights(),
    rooms: {
      suite: counts.suiteOceanfront,
      bungalow: counts.beachBungalow,
      vista: counts.gardenView,
      familiar: counts.familySuite,
      estandar: counts.standard,
    },
    services: {
      Spa: {
        guests: counts.spaGuests,
        date: spaDate
      },
      Gym: {
        guests : counts.gymGuests,
        date: gymDate
        
      },
      Transportation: {
        guests : counts.transportationGuests,
        date: transportationDate

      }
    },
    totalPrice: calculateTotalAmount(),
  };

  const checkGuestsOverflow = () => {
    let guestsTotal = 0;
    const filteredKeys = Object.keys(counts).filter(
      (key) => key !== "rooms" && key !== "guests"
    );
    filteredKeys.forEach((key) => {
      console.log(`Tipo de habitación: ${key}, Cantidad: ${counts[key]}`);
      if (key === "familySuite") {
        guestsTotal += counts[key] * 4;
      } else {
        guestsTotal += counts[key] * 2;
      }
    });
    console.log(`Total de huéspedes calculados: ${guestsTotal}`);
    console.log(`Total de huéspedes permitidos: ${counts.guests}`);
    return guestsTotal < counts.guests;
  };

  const saveReservation = () => {
    const roomsSelected = updateRoomAmount(counts);

    if (roomsSelected < counts.rooms) {
      setModalTitle("");
      setModalMessage(
        "Oops! It seems you've selected fewer rooms than the number you initially chose. Please review your room selection and ensure it matches your intended quantity."
      );
      setShowModal(true);
    } else if (checkGuestsOverflow()) {
      setModalTitle("");
      setModalMessage(
        "Sorry, the number of guests you've entered exceeds the capacity of the selected rooms. Please adjust the number of guests or room selection accordingly."
      );
      setShowModal(true);
    } else {
      sessionStorage.setItem(
        "reservationInfo",
        JSON.stringify(reservationInfoJSON)
      );
      navigate("/pay");

      // const requestSender = new RequestSender();
      // requestSender
      //   .sendRequest("reservation", "POST", reservationInfoJSON) // considerar la mayuscula is falla
      //   .then((response) => {
      //     const responseStatus = response.status;
      //     console.log("Reservation:", responseStatus);
      //     if (responseStatus === 201) {
      //       setModalTitle("");
      //       setModalMessage(
      //         "Reservation created successfully! An email has been sent to the client with the reservation details."
      //       );
      //       toggleNotification();
      //     } else {
      //       const status_message = response.data.message;
      //       console.error("Error:" + responseStatus + " " + status_message);
      //       setModalTitle("An error has occurred...");
      //       setModalMessage(status_message);
      //       setShowModal(true);
      //     }
      // });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    //navigate('/home');
  };
  return (
    // console.log(isAuthenticated),
    // console.log(roomVariables),
    (
      <div className="min-h-screen">
        <script crossOrigin="anonymous"></script>
        <NavBar
          openClientModal={toggleClientModal}
        />
        <div className="h-1/2 w-inherit bg-myrtle-green bg-center bg-no-repeat bg-cover">
          <img className="w-screen h-auto" src={ReservationBanner}></img>
        </div>
        <div className="flex flex-col gap-5 justify-center items-center p-16">
          <h1 className="font-sans text-5xl font-bold text-[#1a4810]">Your Reservation</h1>
          <h4 className="font-sans text-2xl font-semibold text-[#484848]">Enter your desired dates and number of guests to find available rooms. Select your check-in and check-out dates to see our room options.</h4>
        </div>
        <div className="flex justify-center items-center p-16">
          <div className="grid grid-cols-4 bg-[#D8D5D0] p-10 rounded-md w-4/5 gap-10">
            <div className="flex flex-col justify-center items-center gap-5">
              <h3 className="font-sans text-2xl font-bold">Check-in</h3>
              <input
                className="h-[45px] w-[350px] border-none rounded-md p-2 shadow-md mt-2"
                type="date"
                id="checkin"
                name="checkin"
                value={checkIn}
                min={today}
                onChange={handleCheckInChange}
                required
              />
              {errors.checkIn && <span className="error">{errors.checkIn}</span>}
            </div>
            <div className="flex flex-col justify-center items-center gap-5">
              <h3 className="font-sans text-2xl font-bold">Check-out</h3>
              <input
                className="h-[45px] w-[350px] border-none rounded-md p-2 shadow-md mt-2"
                type="date"
                id="checkout"
                name="checkout"
                value={checkOut}
                min={checkIn || today}
                onChange={handleCheckOutChange}
                required
              />
              {errors.checkOut && <span className="error">{errors.checkOut}</span>}
            </div>
            <div className="flex flex-col justify-center items-center gap-5">
              <h3 className="font-sans text-2xl font-bold">Rooms</h3>
              <div className="flex flex-row bg-white h-10 w-3/5 rounded-lg relative mt-1 mx-auto">
                <button
                  data-action="decrement"
                  className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-l cursor-pointer outline-none"
                  onClick={() => decrement('rooms')}
                >
                  <span className="m-auto text-2xl font-thin">−</span>
                </button>
                <input
                  type="number"
                  className="outline-none focus:outline-none text-center w-full bg-air-force-blue font-semibold text-md md:text-base cursor-default flex items-center text-white"
                  name="custom-input-number"
                  value={counts.rooms}
                  onChange={(event) => handleChange(event, 'rooms')}
                />
                <button
                  data-action="increment"
                  className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-r cursor-pointer outline-none"
                  onClick={() => increment('rooms')}
                >
                  <span className="m-auto text-2xl font-thin">+</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-5">
              <h3 className="font-sans text-2xl font-bold">Guests</h3>
              <div className="flex flex-row bg-white h-10 w-3/5 rounded-lg relative mt-1 mx-auto">
                <button
                  data-action="decrement"
                  className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-l cursor-pointer outline-none"
                  onClick={() => decrement('guests')}
                >
                  <span className="m-auto text-2xl font-thin">−</span>
                </button>
                <input
                  type="number"
                  className="outline-none focus:outline-none text-center w-full bg-air-force-blue font-semibold text-md md:text-base cursor-default flex items-center text-white"
                  name="custom-input-number"
                  value={counts.guests}
                  onChange={(event) => handleChange(event, 'guests')}
                />
                <button
                  data-action="increment"
                  className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-r cursor-pointer outline-none"
                  onClick={() => increment('guests')}
                >
                  <span className="m-auto text-2xl font-thin">+</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-10 p-5 px-20 w-full">
          <h3 className="font-sans font-semibold text-4xl">Select your rooms</h3>
          <hr className="text-air-force-blue w-full"></hr>
          <p className="font-sans font-normal text-2xl text-[#484848]">Please select the rooms that you want to book</p>
          <div className="grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 gap-10 w-full mt-5">
            <div className="w-fit">
              <Card className="max-w-sm" imgAlt="img" imgSrc={suiteOceanfront}>
                <h5 className="font-sans text-2xl font-bold text-lime-900">
                  Suite Oceanfront
                </h5>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faUser} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">Guests: 2</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faBed} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">Available rooms: {roomVariables.suite} rooms</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faDollarSign} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">Cost per night: $550</p>
                </div>
                <div className="flex flex-row h-10 w-2/5 rounded-lg relative mt-1 mx-auto">
                  <button
                    data-action="decrement"
                    className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-l cursor-pointer outline-none"
                    onClick={() => decrement('suiteOceanfront')}
                  >
                    <span className="m-auto text-2xl font-thin">−</span>
                  </button>
                  <input
                    type="number"
                    className="outline-none focus:outline-none text-center w-full bg-air-force-blue font-semibold text-md md:text-base cursor-default flex items-center text-white"
                    name="custom-input-number"
                    value={counts.suiteOceanfront}
                    onChange={(event) => handleChange(event, 'suiteOceanfront')}
                  />
                  <button
                    data-action="increment"
                    className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-r cursor-pointer outline-none"
                    onClick={() => increment('suiteOceanfront')}
                  >
                    <span className="m-auto text-2xl font-thin">+</span>
                  </button>
                </div>
              </Card>
            </div>
            <div className="w-fit">
              <Card className="max-w-sm" imgAlt="img" imgSrc={beachBungalow}>
                <h5 className="font-sans text-2xl font-bold text-lime-900">
                  Beach Bungalow
                </h5>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faUser} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">Guests: 2</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faBed} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">Available rooms: {roomVariables.bungalow} rooms</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faDollarSign} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">Cost per night: $400</p>
                </div>
                <div className="flex flex-row h-10 w-2/5 rounded-lg relative mt-1 mx-auto">
                  <button
                    data-action="decrement"
                    className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-l cursor-pointer outline-none"
                    onClick={() => decrement('beachBungalow')}
                  >
                    <span className="m-auto text-2xl font-thin">−</span>
                  </button>
                  <input
                    type="number"
                    className="outline-none focus:outline-none text-center w-full bg-air-force-blue font-semibold text-md md:text-base cursor-default flex items-center text-white"
                    name="custom-input-number"
                    value={counts.beachBungalow}
                    onChange={(event) => handleChange(event, 'beachBungalow')}
                  />
                  <button
                    data-action="increment"
                    className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-r cursor-pointer outline-none"
                    onClick={() => increment('beachBungalow')}
                  >
                    <span className="m-auto text-2xl font-thin">+</span>
                  </button>
                </div>
              </Card>
            </div>
            <div className="w-fit">
              <Card className="max-w-sm" imgAlt="img" imgSrc={gardenView}>
                <h5 className="font-sans text-2xl font-bold text-lime-900">
                  Garden View
                </h5>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faUser} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">Guests: 2</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faBed} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">Available rooms: {roomVariables.vista} rooms</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faDollarSign} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">Cost per night: $300</p>
                </div>
                <div className="flex flex-row h-10 w-2/5 rounded-lg relative mt-1 mx-auto">
                  <button
                    data-action="decrement"
                    className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-l cursor-pointer outline-none"
                    onClick={() => decrement('gardenView')}
                  >
                    <span className="m-auto text-2xl font-thin">−</span>
                  </button>
                  <input
                    type="number"
                    className="outline-none focus:outline-none text-center w-full bg-air-force-blue font-semibold text-md md:text-base cursor-default flex items-center text-white"
                    name="custom-input-number"
                    value={counts.gardenView}
                    onChange={(event) => handleChange(event, 'gardenView')}
                  />
                  <button
                    data-action="increment"
                    className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-r cursor-pointer outline-none"
                    onClick={() => increment('gardenView')}
                  >
                    <span className="m-auto text-2xl font-thin">+</span>
                  </button>
                </div>
              </Card>
            </div>
            <div className="w-fit">
              <Card className="max-w-sm" imgAlt="img" imgSrc={familySuite}>
                <h5 className="font-sans text-2xl font-bold text-lime-900">
                  Family Suite
                </h5>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faUser} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">Guests: 4</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faBed} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">Available rooms: {roomVariables.familiar} rooms</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faDollarSign} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">Cost per night: $250</p>
                </div>
                <div className="flex flex-row h-10 w-2/5 rounded-lg relative mt-1 mx-auto">
                  <button
                    data-action="decrement"
                    className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-l cursor-pointer outline-none"
                    onClick={() => decrement('familySuite')}
                  >
                    <span className="m-auto text-2xl font-thin">−</span>
                  </button>
                  <input
                    type="number"
                    className="outline-none focus:outline-none text-center w-full bg-air-force-blue font-semibold text-md md:text-base cursor-default flex items-center text-white"
                    name="custom-input-number"
                    value={counts.familySuite}
                    onChange={(event) => handleChange(event, 'familySuite')}
                  />
                  <button
                    data-action="increment"
                    className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-r cursor-pointer outline-none"
                    onClick={() => increment('familySuite')}
                  >
                    <span className="m-auto text-2xl font-thin">+</span>
                  </button>
                </div>
              </Card>
            </div>
            <div className="w-fit">
              <Card className="max-w-sm" imgAlt="img" imgSrc={standard}>
                <h5 className="font-sans text-2xl font-bold text-lime-900">
                  Standard
                </h5>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faUser} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">Guests: 2</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faBed} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">Available rooms: {roomVariables.estandar} rooms</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faDollarSign} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">Cost per night: $150</p>
                </div>
                <div className="flex flex-row h-10 w-2/5 rounded-lg relative mt-1 mx-auto">
                  <button
                    data-action="decrement"
                    className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-l cursor-pointer outline-none"
                    onClick={() => decrement('standard')}
                  >
                    <span className="m-auto text-2xl font-thin">−</span>
                  </button>
                  <input
                    type="number"
                    className="outline-none focus:outline-none text-center w-full bg-air-force-blue font-semibold text-md md:text-base cursor-default flex items-center text-white"
                    name="custom-input-number"
                    value={counts.standard}
                    onChange={(event) => handleChange(event, 'standard')}
                  />
                  <button
                    data-action="increment"
                    className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-r cursor-pointer outline-none"
                    onClick={() => increment('standard')}
                  >
                    <span className="m-auto text-2xl font-thin">+</span>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-10 p-5 px-20 w-full">
        <h3 className="font-sans font-semibold text-4xl">Select your amenities</h3>
          <hr className="text-air-force-blue w-full"></hr>
          <p className="font-sans font-normal text-2xl text-[#484848]">Please select the rooms that you want to book</p>
          <div className="grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 gap-12 w-full mt-5 ">
            <div className="w-full">
              <Card className="gap-3" imgAlt="img" imgSrc={Spa} >
                <h5 className="font-sans text-2xl font-bold text-lime-900">
                  Spa and wellness center
                </h5>
                <p className="font-sans font-normal text-xl text-[#484848]">
                  A space dedicated to wellness and relaxation, where guests can enjoy massages, facials, a jacuzzi, sauna, and other therapies to revitalize body and mind.                
                </p>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faDollarSign} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">$50 per 90 minute session</p>
                </div>
                <div className="flex flex-row justify-center items-center w-2/5 rounded-lg relative mx-auto">
                  <button
                    className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 w-full rounded-md cursor-pointer outline-none p-2"
                    onClick={() => toggleVisibility(0)}

                  >
                  Add to reservation
                  </button>
                </div>
                {visibleStates[0] && (
                <div>
                  <h5 className="font-sans text-xl font-bold">
                    Guests
                  </h5>
                  <div className="flex flex-row h-10 w-2/5 rounded-lg relative mx-auto">
                    <button
                      data-action="decrement"
                      className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-l cursor-pointer outline-none"
                      onClick={() => decrement('spaGuests')}
                      >
                      <span className="m-auto text-2xl font-thin">−</span>
                    </button>
                    <input
                      type="number"
                      className="outline-none focus:outline-none text-center w-full bg-air-force-blue font-semibold text-md md:text-base cursor-default flex items-center text-white"
                      name="custom-input-number"
                      value={counts.spaGuests}
                      onChange={(event) => handleChange(event, 'spaGuests')}
                      />
                    <button
                      data-action="increment"
                      className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-r cursor-pointer outline-none"
                      onClick={() => increment('spaGuests')}
                      >
                      <span className="m-auto text-2xl font-thin">+</span>
                    </button>
                  </div>
                  <h5 className="font-sans text-xl font-bold">
                    Dates
                  </h5>
                  <div className="flex justify-center items-center">
                    <input
                      className="h-[45px] w-[350px] border-none rounded-md p-2 shadow-md mt-2"
                      type="date"
                      id="checkout"
                      name="checkout"
                      value={spaDate}
                      min={checkIn || today}
                      max={checkOut}
                      onChange={handleSpaDateChange}
                      required
                    />
                  </div>
                </div>
                )}
              </Card>
            </div>
            <div className="w-full">
              <Card className="gap-3" imgAlt="img" imgSrc={Gym} >
                <h5 className="font-sans text-2xl font-bold text-lime-900">
                  Gym
                </h5>
                <p className="font-sans font-normal text-xl text-[#484848]">
                  A well-equipped gym for guests who wish to stay in shape during their stay, featuring cardiovascular exercise equipment, free weights and a well prepared staff of trainers.                
                </p>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faDollarSign} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">$10 per 120 minute session</p>
                </div>
                <div className="flex flex-row justify-center items-center w-2/5 rounded-lg relative mx-auto">
                  <button
                    className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 w-full rounded-md cursor-pointer outline-none p-2"
                    onClick={() => toggleVisibility(1)}

                  >
                  Add to reservation
                  </button>
                </div>
                {visibleStates[1] && (
                <div>
                  <h5 className="font-sans text-xl font-bold">
                    Guests
                  </h5>
                  <div className="flex flex-row h-10 w-2/5 rounded-lg relative mx-auto">
                    <button
                      data-action="decrement"
                      className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-l cursor-pointer outline-none"
                      onClick={() => decrement('gymGuests')}
                      >
                      <span className="m-auto text-2xl font-thin">−</span>
                    </button>
                    <input
                      type="number"
                      className="outline-none focus:outline-none text-center w-full bg-air-force-blue font-semibold text-md md:text-base cursor-default flex items-center text-white"
                      name="custom-input-number"
                      value={counts.gymGuests}
                      onChange={(event) => handleChange(event, 'gymGuests')}
                      />
                    <button
                      data-action="increment"
                      className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-r cursor-pointer outline-none"
                      onClick={() => increment('gymGuests')}
                      >
                      <span className="m-auto text-2xl font-thin">+</span>
                    </button>
                  </div>
                  <h5 className="font-sans text-xl font-bold">
                    Dates
                  </h5>
                  <div className="flex justify-center items-center">
                    <input
                      className="h-[45px] w-[350px] border-none rounded-md p-2 shadow-md mt-2"
                      type="date"
                      id="checkout"
                      name="checkout"
                      value={gymDate}
                      min={checkIn || today}
                      max={checkOut}
                      onChange={handleGymDateChange}
                      required
                    />
                  </div>
                </div>
                )}
              </Card>
            </div>
            <div className="w-full">
              <Card className="" imgAlt="img" imgSrc={Transportation} >
                <h5 className="font-sans text-2xl font-bold text-lime-900">
                  Transportation
                </h5>
                <p className="font-sans font-normal text-xl text-[#484848]">
                  We offer transportation service to and from the airport, as well as local transportation for exploring the surroundings and visiting nearby attractions.                </p>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center" style={{ minWidth: '30px' }}>
                    <FontAwesomeIcon className="text-xl" icon={faDollarSign} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">$30 per person</p>
                </div>
                
                <div className="flex flex-row justify-center items-center w-2/5 rounded-lg relative mx-auto">
                  <button
                    className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 w-full rounded-md cursor-pointer outline-none p-2"
                    onClick={() => toggleVisibility(2)}

                  >
                  Add to reservation
                  </button>
                </div>
                {visibleStates[2] && (
                <div>
                  <h5 className="font-sans text-xl font-bold">
                    Guests
                  </h5>
                  <div className="flex flex-row h-10 w-2/5 rounded-lg relative mx-auto">
                    <button
                      data-action="decrement"
                      className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-l cursor-pointer outline-none"
                      onClick={() => decrement('transportationGuests')}
                      >
                      <span className="m-auto text-2xl font-thin">−</span>
                    </button>
                    <input
                      type="number"
                      className="outline-none focus:outline-none text-center w-full bg-air-force-blue font-semibold text-md md:text-base cursor-default flex items-center text-white"
                      name="custom-input-number"
                      value={counts.transportationGuests}
                      onChange={(event) => handleChange(event, 'transportationGuests')}
                      />
                    <button
                      data-action="increment"
                      className="bg-air-force-blue text-white hover:text-gray-900 hover:bg-myrtle-green/70 h-full w-20 rounded-r cursor-pointer outline-none"
                      onClick={() => increment('transportationGuests')}
                      >
                      <span className="m-auto text-2xl font-thin">+</span>
                    </button>
                  </div>
                  <h5 className="font-sans text-xl font-bold">
                    Dates
                  </h5>
                  <div className="flex justify-center items-center">
                    <input
                      className="h-[45px] w-[350px] border-none rounded-md p-2 shadow-md mt-2"
                      type="date"
                      id="checkout"
                      name="checkout"
                      value={transportationDate}
                      min={checkIn || today}
                      max={checkOut}
                      onChange={handleTransportationDateChange}
                      required
                    />
                  </div>
                </div>
                )}
              </Card>
            </div>
          </div>
        </div>
        {isAuthenticated ? (
          <div className="flex justify-center items-center p-20">
            <button 
              className="p-4 px-10 bg-myrtle-green rounded-xl shadow-xl text-white text-2xl font-semibold font-sans hover:bg-myrtle-green/70"
              onClick={saveReservation}
            >
              Reserve
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center p-20">
            <button 
              className="p-4 px-10 bg-myrtle-green rounded-xl shadow-xl text-white text-2xl font-semibold font-sans hover:bg-myrtle-green/70"
              onClick={saveReservation}
              disabled
            >
              Reserve
            </button>
            <h1 className="">You must have an acount to create a reservation</h1>
          </div>
        )
        }
        <Footer />
      
        {isClientModalOpen && (
          <ProfileModalClient closeModal={toggleClientModal} />
        )}
        <Notification
          isOpen={showModal}
          toggleModal={closeModal}
          title={modalTitle}
          message={modalMessage}
        />
        <NotificationWithAction
          isOpen={notificationOpen}
          toggleModal={toggleNotification}
          title={modalTitle}
          message={modalMessage}
          action={() => navigate("/myReservations")}
          actionMessage={"Go to my reservations"}
        />
      </div>
      
    )
  );
}

export default NewClientReservation;
