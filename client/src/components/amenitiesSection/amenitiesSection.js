import React, { useState, useContext } from "react";
import NavBar from "../navBar/navBar";
import Footer from "../footer/footer";
import ProfileModalEmployee from "../profileModalEmployee/profileModalEmployee";
import ProfileModalClient from "../profileModalClient/profileModalClient";
import ProfileModalAdmin from "../profileModalAdmin/profileModalAdmin";
import { AuthContext } from "../../contexts/authContext";
import "../../components/global.css";
import logo_pluma_pakisgreen from "../../assets/logo_pluma_pakisgreen.png";
import amenitiesBanner from "../../assets/amenities_banner.png";
import spa from "../../assets/spa.png";
import gym from "../../assets/gym.png";
import bar from "../../assets/bar.png";
import pool from "../../assets/pool.png";
import kids_club from "../../assets/kids_club.png";
import transportation from "../../assets/transportation.png";
import private_beach from "../../assets/private_beach.png";

function AmenitiesSection() {
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
          <img className="w-screen h-screen" src={amenitiesBanner}></img>
          <img
            className="w-1/4 h-auto bg-transparent z-10 absolute top-[25%] left-[37%]"
            src={logo_pluma_pakisgreen}
          ></img>
        </div>
        <div className="flex flex-col justify-center align-center items-center w-11/12 p-10 gap-20 mb-10">
          {/* spa */}
          <div className="grid grid-cols-2 w-11/12 gap-16">
            <div className="flex flex-col gap-10 justify-center items-center">
              <h1 className="font-sans font-bold text-4xl text-[#33665B]">
                Spa and wellness center
              </h1>
              <p className="font-sans font-normal text-xl text-[#484848] text-justify">
                A space dedicated to wellness and relaxation, where guests can
                enjoy massages, facials, a jacuzzi, sauna, and other therapies
                to revitalize body and mind.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <img src={spa}></img>
            </div>
          </div>
          {/* bar */}
          <div className="grid grid-cols-2 w-11/12 gap-16">
            <div className="flex flex-col gap-10 justify-center items-center">
              <h1 className="font-sans font-bold text-4xl text-[#33665B]">
                Bar lounge
              </h1>
              <p className="font-sans font-normal text-xl text-[#484848] text-justify">
                A restaurant with a diverse gastronomic offering that includes
                local and international cuisine, as well as a poolside bar where
                guests can enjoy refreshing drinks and tropical cocktails.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <img src={bar}></img>
            </div>
          </div>
          {/* gym */}
          <div className="grid grid-cols-2 w-11/12 gap-16">
            <div className="flex flex-col gap-10 justify-center items-center">
              <h1 className="font-sans font-bold text-4xl text-[#33665B]">
                Gym
              </h1>
              <p className="font-sans font-normal text-xl text-[#484848] text-justify">
                A well-equipped gym for guests who wish to stay in shape during
                their stay, featuring cardiovascular exercise equipment and free
                weights.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <img src={gym}></img>
            </div>
          </div>
          {/* Kids zone */}
          <div className="grid grid-cols-2 w-11/12 gap-16">
            <div className="flex flex-col gap-10 justify-center items-center">
              <h1 className="font-sans font-bold text-4xl text-[#33665B]">
                Kids Zone
              </h1>
              <p className="font-sans font-normal text-xl text-[#484848] text-justify">
                A space dedicated especially to children, with supervised
                activities, games, and entertainment to ensure the little ones
                have fun while the parents enjoy their free time.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <img src={kids_club}></img>
            </div>
          </div>
          {/* beach */}
          <div className="grid grid-cols-2 w-11/12 gap-16">
            <div className="flex flex-col gap-10 justify-center items-center">
              <h1 className="font-sans font-bold text-4xl text-[#33665B]">
                Private Beach Access
              </h1>
              <p className="font-sans font-normal text-xl text-[#484848] text-justify">
                One of the main attractions of a beachfront hotel in Costa Rica
                is the direct access to the beach, where guests can enjoy the
                sun, sea, and sand in an exclusive and tranquil setting.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <img src={private_beach}></img>
            </div>
          </div>
          {/* pool */}
          <div className="grid grid-cols-2 w-11/12 gap-16">
            <div className="flex flex-col gap-10 justify-center items-center">
              <h1 className="font-sans font-bold text-4xl text-[#33665B]">
                Outdoor pool
              </h1>
              <p className="font-sans font-normal text-xl text-[#484848] text-justify">
                A well-designed and maintained pool is an essential amenity for
                guests who wish to relax and refresh themselves without leaving
                the hotel.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <img src={pool}></img>
            </div>
          </div>
          {/* Tranposrtation */}
          <div className="grid grid-cols-2 w-11/12 gap-16">
            <div className="flex flex-col gap-10 justify-center items-center">
              <h1 className="font-sans font-bold text-4xl text-[#33665B]">
                Transportation
              </h1>
              <p className="font-sans font-normal text-xl text-[#484848] text-justify">
                We offer transportation service to and from the airport, as well
                as local transportation for exploring the surroundings and
                visiting nearby attractions.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <img src={transportation}></img>
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

export default AmenitiesSection;
