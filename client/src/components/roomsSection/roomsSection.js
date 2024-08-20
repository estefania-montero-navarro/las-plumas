import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../navBar/navBar";
import Footer from "../footer/footer";
import ProfileModalEmployee from "../profileModalEmployee/profileModalEmployee";
import ProfileModalClient from "../profileModalClient/profileModalClient";
import ProfileModalAdmin from "../profileModalAdmin/profileModalAdmin";
import { AuthContext } from "../../contexts/authContext";
import "../../components/global.css";
import logo_pluma_umber from "../../assets/logo_pluma_umber.png";
import RoomsBanner from "../../assets/RoomsBanner.png";
import suiteOceanfront from "../../assets/suite oceanfront.png";
import beachBungalow from "../../assets/beach bungalow.png";
import gardenView from "../../assets/garden view.png";
import familySuite from "../../assets/family suite.png";
import standard from "../../assets/standard.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBed,
  faLocationDot,
  faBath,
  faChildren,
} from "@fortawesome/free-solid-svg-icons";

function RoomsSection() {
  const { isAuthenticated } = useContext(AuthContext);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleEmployeeModal = () => {
    setIsEmployeeModalOpen(!isEmployeeModalOpen);
  };
  const togglelientModal = () => {
    setIsClientModalOpen(!isClientModalOpen);
  };
  const toggleAdminModal = () => {
    setIsAdminModalOpen(!isAdminModalOpen);
  };

  const handleReserveButtonClick = () => {
    navigate("/reserve");
  };

  return (
    console.log(isAuthenticated),
    (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <script crossOrigin="anonymous"></script>
        <NavBar
          openEmployeeModal={toggleEmployeeModal}
          openClientModal={togglelientModal}
          openAdminModal={toggleAdminModal}
        />
        <div className="h-1/2 w-inherit bg-myrtle-green bg-center bg-no-repeat bg-cover">
          <img className="w-screen h-screen" src={RoomsBanner}></img>
          <img
            className="w-1/4 h-auto bg-transparent z-10 absolute top-[25%] left-[37%]"
            src={logo_pluma_umber}
          ></img>
        </div>
        {isAuthenticated ? (
          <div className="reserve-button-container">
            <Link to="/reserve">
              <button
                className="reservar_button"
                onClick={handleReserveButtonClick}
              >
                Reserve
              </button>
            </Link>
          </div>
        ) : (
          <div className="reserve-button-container">
            <Link to="/reserve">
              <button
                className="reservar_button"
                onClick={handleReserveButtonClick}
                disabled
              >
                Reserve
              </button>
            </Link>
          </div>
        )}
        <div className="flex flex-col justify-center align-center items-center w-11/12 p-10 gap-20 mb-10">
          {/* suite oceanfront */}
          <div className="grid grid-cols-2 w-11/12">
            <div className="flex flex-col gap-5">
              <h1 className="font-sans font-bold text-4xl text-[#33665B]">
                Suite oceanfront
              </h1>
              <p className="font-sans font-normal text-xl text-[#484848]">
                Spacious and luxurious rooms, with separate living areas and
                private balconies.
              </p>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faUser} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    2 guests
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faBed} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    1 king size
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faLocationDot} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    Beachfront, with ocean views
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faBath} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    Hot tub and rain shower
                  </p>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <div className="flex justify-center items-center bg-[#C4967E] p-3 rounded-xl text-xl font-sans font-extrabold text-white shadow-md">
                  $550 per night
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <img src={suiteOceanfront}></img>
            </div>
          </div>
          {/* beach bungalow */}
          <div className="grid grid-cols-2 w-11/12">
            <div className="flex flex-col gap-5">
              <h1 className="font-sans font-bold text-4xl text-[#33665B]">
                Beach Bungalow
              </h1>
              <p className="font-sans font-normal text-xl text-[#484848]">
                Individual houses with private terraces with hammocks and direct
                access to the beach.
              </p>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faUser} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    2 guests
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faBed} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    1 x king size
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faLocationDot} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    Beachfront, sorounded with nature
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faBath} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    Open-air or semi-open-air bathrooms
                  </p>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <div className="flex justify-center items-center bg-[#C4967E] p-3 rounded-xl text-xl font-sans font-extrabold text-white shadow-md">
                  $400 per night
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <img src={beachBungalow}></img>
            </div>
          </div>
          {/* garden view */}
          <div className="grid grid-cols-2 w-11/12">
            <div className="flex flex-col gap-5">
              <h1 className="font-sans font-bold text-4xl text-[#33665B]">
                Garden View
              </h1>
              <p className="font-sans font-normal text-xl text-[#484848]">
                Spacious and luxurious rooms, with separate living areas and
                private balconies.
              </p>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faUser} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    2 guests
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faBed} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    1 king size or 2 singles
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faLocationDot} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    On the main building with garden view
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faBath} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    Hot tub and rain shower
                  </p>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <div className="flex justify-center items-center bg-[#C4967E] p-3 rounded-xl text-xl font-sans font-extrabold text-white shadow-md">
                  $300 per night
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <img src={gardenView}></img>
            </div>
          </div>
          {/* family suite */}
          <div className="grid grid-cols-2 w-11/12">
            <div className="flex flex-col gap-5">
              <h1 className="font-sans font-bold text-4xl text-[#33665B]">
                Family Suite
              </h1>
              <p className="font-sans font-normal text-xl text-[#484848]">
                Spacious suites designed for families or groups. Separate living
                areas with sofa beds and connecting bedrooms.
              </p>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faUser} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    4 guests
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faBed} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    1 king size and 2 sofa bed
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faLocationDot} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    Beachfront, with ocean views
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faChildren} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    Comodities for children
                  </p>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <div className="flex justify-center items-center bg-[#C4967E] p-3 rounded-xl text-xl font-sans font-extrabold text-white shadow-md">
                  $250 per night
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <img src={familySuite}></img>
            </div>
          </div>
          {/* Standard */}
          <div className="grid grid-cols-2 w-11/12">
            <div className="flex flex-col gap-5">
              <h1 className="font-sans font-bold text-4xl text-[#33665B]">
                Standard
              </h1>
              <p className="font-sans font-normal text-xl text-[#484848]">
                Comfortable and well-equipped rooms, perfect for couples or
                individual travelers.
              </p>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faUser} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    2 guests
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faBed} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    1 king size or 2 singles
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faLocationDot} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    On the main building
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon className="text-xl" icon={faBath} />
                  </div>
                  <p className="font-sans font-normal text-xl text-[#484848]">
                    private bathrooms with rain shower
                  </p>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <div className="flex justify-center items-center bg-[#C4967E] p-3 rounded-xl text-xl font-sans font-extrabold text-white shadow-md">
                  $150 per night
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <img src={standard}></img>
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
        <footer>
          <Footer />
        </footer>
      </div>
    )
  );
}

export default RoomsSection;
