import React, { useState } from "react";
import informationBanner from "../../assets/informationBanner.png";
import whiteLogo from "../../assets/whiteLogo.png";
import informationDock from "../../assets/informationDock.png";
import informationRoom from "../../assets/informationRoom.png";
import NavBarWhite from "../navBar/navBarWhite";
import Footer from "../footer/footer";
import ProfileModalClient from "../profileModalClient/profileModalClient";
import ProfileModalEmployee from "../profileModalEmployee/profileModalEmployee";
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
        openEmployeeModal={toggleEmployeeModal}
        openClientModal={togglelientModal}
        openAdminModal={toggleAdminModal}
      />
      <div className="home-background">
        <img className="home-bg" src={informationBanner}></img>
        <img
          className="w-1/4 h-auto bg-transparent z-10 absolute top-[25%] left-[37%]"
          src={whiteLogo}
        ></img>
      </div>
      <div className="flex justify-center text-center p-4 mt-8">
        <h1 className="font-averiaSerifLibre text-[#9E5E3C] text-6xl font-semibold italic">
          About Us
        </h1>
      </div>
      <div className="flex justify-center text-center mb-16 mt-4">
        <p className="text-black text-2xl text-center font-normal">
          In the heart of the tropical jungle, <br />
          in the Costa Rican south, you can find "Las Plumas" hotel. <br />
          Founded over 30 decades ago by a local family <br />
          passionate about eco-tourism and nature preservation.
        </p>
      </div>
      <div className="flex flex-col-2 bg-[#6B98B4] w-full h-full justify-center p-8 mb-16">
        <div className="p-4">
          <img
            className="border-0 rounded-lg shadow-lg"
            src={informationDock}
          ></img>
        </div>
        <div className="flex font-normal text-2xl p-4 justify-end text-end mt-24 ml-16">
          <p>
            The name "Las Plumas" was inspired by <br />
            the vast presence of exotic birds <br />
            that inhabit the area of the hotel, <br />
            making this piece of land a paradise <br />
            for bird watchers and wildlife fanatics.
          </p>
        </div>
      </div>
      <div className="flex justify-center text-center p-4 mt-4">
        <p className="text-black text-2xl text-center font-normal">
          "Las Plumas" is known as a sanctuary <br />
          where natural beauty and inner peace rule. It is the perfect place
          where <br />
          visitors may reconnect with nature, relax in comfortable amenities,{" "}
          <br />
          and explore the tropical jungle wonders.
        </p>
      </div>
      <div className="flex justify-center p-4 mb-16">
        <img
          className="border-0 rounded-lg shadow-lg h-50 w-50"
          src={informationRoom}
        ></img>
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
