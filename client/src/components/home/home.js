import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import NavBar from "../navBar/navBar";
import Footer from "../footer/footer";
import ProfileModalEmployee from "../profileModalEmployee/profileModalEmployee";
import ProfileModalClient from "../profileModalClient/profileModalClient";
import ProfileModalAdmin from "../profileModalAdmin/profileModalAdmin";

import "../../components/global.css";
import homeLogoTitleGreen from "../../assets/homeLogoTitleGreen.png";
import homepageBanner from "../../assets/homepageBanner.jpg";

function Home() {
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [showReserveBox, setShowReserveBox] = useState(false);

  const toggleEmployeeModal = () => {
    setIsEmployeeModalOpen(!isEmployeeModalOpen);
  };
  const togglelientModal = () => {
    setIsClientModalOpen(!isClientModalOpen);
  };
  const toggleAdminModal = () => {
    setIsAdminModalOpen(!isAdminModalOpen);
  };

  const navigate = new useNavigate();

  return (
    <div className="home">
      <script crossOrigin="anonymous"></script>
      <NavBar
        openEmployeeModal={toggleEmployeeModal}
        openClientModal={togglelientModal}
        openAdminModal={toggleAdminModal}
      />

      <div className="home-background">
        <img className="home-bg" src={homepageBanner}></img>
        <img className="title-logo" src={homeLogoTitleGreen}></img>
      </div>

      {!showReserveBox && (
        <div className="reserve-button-container">
          <Link to="/rooms">
            <button className="reservar_button">Stay with us!</button>
          </Link>
        </div>
      )}
      {showReserveBox && <ReserveBox />}
      {/* <Notification
          isOpen={true}
          // toggleModal={}
          title={"title"}
          message={"modalMessage"}
        /> */}
      <div className="home_info_section">
        <h1 className="h1-slogan">
          FAMILY OWNED BUSINESS FOR OVER <br /> 30 YEARS
        </h1>
        <div className="divider"></div>
        <p className="description-text">
          As a boutique hotel, we have spent years specializing in
          <br />
          eco-friendly tourism, ensuring our guests' comfort while creating{" "}
          <br /> a natural sanctuary for people and birds.
        </p>
        <div className="ver-mas-button-container">
          <Link to="/additionalInfo">
            <button className="ver_mas_button">More information</button>
          </Link>
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
  );
}

export default Home;
