import React, { useState } from "react";
import additionalInfoBanner from "../../assets/additionalInfoBanner.jpg";
import nombre_logo from "../../assets/nombre_logo.png";
import NavBarWhite from "../navBar/navBarWhite";
import Footer from "../footer/footer";
import ProfileModalEmployee from "../profileModalEmployee/profileModalEmployee";
import ProfileModalClient from "../profileModalClient/profileModalClient";
import ProfileModalAdmin from "../profileModalAdmin/profileModalAdmin";

function AdditionalInfo() {
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
    <div className="">
      <NavBarWhite
        className="navbar-additional-info"
        openEmployeeModal={toggleEmployeeModal}
        openClientModal={togglelientModal}
        openAdminModal={toggleAdminModal}
      />
      <div className="home-background">
        <img className="home-bg" src={additionalInfoBanner}></img>
        <img className="title-logo" src={nombre_logo}></img>
      </div>
      <div className="content-message">
        <h1>
          {" "}
          We are working to improve your experience. <br />
          Come back soon to discover everything <br /> new we have prepared for
          you!
        </h1>
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

export default AdditionalInfo;
