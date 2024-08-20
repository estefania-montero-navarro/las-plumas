import React, { useState, useContext } from "react";
import "../../components/global.css";
import { useNavigate } from "react-router-dom";

const BadRequest = () => {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/home");
  };

  return (
    <div className="flex-col justify-content-center w-full">
      <h1 class="text-myrtle-green font-roboto font-bold text-4xl text-center">
        Status 400: Bad Request
      </h1>
      <p class="text-black font-roboto font-bold text-xl text-center">
        This page isn't working.
      </p>
      <div class="flex justify-center">
        <button
          onClick={goToHome}
          className="bg-myrtle-green font-roboto text-white text-xl p-4 rounded-xl align-center"
        >
          Go to home
        </button>
      </div>
    </div>
  );
};

export default BadRequest;
