import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavBar from "../navBar/navBar";
import Footer from "../footer/footer";
import ProfileModalEmployee from "../profileModalEmployee/profileModalEmployee";
import ProfileModalClient from "../profileModalClient/profileModalClient";
import ProfileModalAdmin from "../profileModalAdmin/profileModalAdmin";
import { AuthContext } from "../../contexts/authContext";
import "../../components/global.css";
import logo_pluma_pakisgreen from "../../assets/logo_pluma_pakisgreen.png";
import contactBanner from "../../assets/contactBanner.png";
import { faPhone, faAt, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

function ContactSection() {
  const { isAuthenticated } = useContext(AuthContext);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const toggleEmployeeModal = () => {
    setIsEmployeeModalOpen(!isEmployeeModalOpen);
  };
  const togglelientModal = () => {
    setIsClientModalOpen(!isClientModalOpen);
  };
  const toggleAdminModal = () => {
    setIsAdminModalOpen(!isAdminModalOpen);
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
          <img className="w-screen h-screen" src={contactBanner}></img>
          <img
            className="w-1/4 h-auto bg-transparent z-10 absolute top-[25%] left-[37%]"
            src={logo_pluma_pakisgreen}
          ></img>
        </div>
        <div className="flex flex-col justify-center align-center items-center w-11/12 p-10 gap-20 mb-10">
          <div className="grid grid-cols-2 w-11/12 gap-16">
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon
                      className="text-2xl text-[#1a4810]"
                      icon={faPhone}
                    />
                  </div>
                  <p className="font-sans font-normal text-2xl text-[#1a4810]">
                    +506 2200-2200
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon
                      className="text-2xl text-[#1a4810]"
                      icon={faWhatsapp}
                    />
                  </div>
                  <p className="font-sans font-normal text-2xl text-[#1a4810]">
                    +506 7252-0010
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div
                    className="flex items-center"
                    style={{ minWidth: "30px" }}
                  >
                    <FontAwesomeIcon
                      className="text-2xl text-[#1a4810]"
                      icon={faAt}
                    />
                  </div>
                  <p className="font-sans font-normal text-2xl text-[#1a4810]">
                    contacto@lasplumas.com
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center w-11/12 p-10 gap-10 mb-10">
              <div className="flex justify-center items-center">
                <FontAwesomeIcon
                  className="text-7xl text-[#1a4810]"
                  icon={faGlobe}
                />
              </div>
              <div className="flex flex-col justify-center items-center">
                <p className="font-sans font-normal text-2xl text-[#1a4810]">
                  Puntaneras, Costa Rica
                </p>
                <p className="font-sans font-normal text-2xl text-[#1a4810]">
                  Bahía Drake,
                </p>
                <p className="font-sans font-normal text-2xl text-[#1a4810]">
                  300 meters from Colorada
                </p>
                <p className="font-sans font-normal text-2xl text-[#1a4810]">
                  Postal Code: 60503
                </p>
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
        <footer>
          <Footer />
        </footer>
      </div>
    )
  );
}

export default ContactSection;
