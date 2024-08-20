import React, { useState } from "react";
import "../../components/global.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function SearchBox() {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Prevents page reload
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div class="searchbar-div">
      <h3 className="h3-relleno-blanco">Search</h3>
      <div class="search-input">
        <form onSubmit={handleSubmit} class="search-form">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search for"
            className="search-form-input"
          />
          <button
            type="submit"
            class="search-form-button"
            onClick={handleSubmit}
          >
            <FontAwesomeIcon
              className="modal-profile-icon-text"
              icon={faMagnifyingGlass}
            ></FontAwesomeIcon>
          </button>
        </form>
      </div>
    </div>
  );
}

export default SearchBox;
