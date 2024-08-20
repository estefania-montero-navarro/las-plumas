import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../components/global.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPencil,
  faTrashCan,
  faKiwiBird,
} from "@fortawesome/free-solid-svg-icons";
import createUserBanner from "../../assets/createUserBanner.jpg";
import NavBar from "../navBar/navBar";
import Footer from "../footer/footer";
import ProfileModalEmployee from "../profileModalEmployee/profileModalEmployee";
import ProfileModalClient from "../profileModalClient/profileModalClient";
import ProfileModalAdmin from "../profileModalAdmin/profileModalAdmin";
import RequestSender from "../../common/requestSender";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Creacion_Usuario() {
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserType, setSelectedUserType] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const toggleEmployeeModal = () => {
    setIsEmployeeModalOpen(!isEmployeeModalOpen);
  };
  const togglelientModal = () => {
    setIsClientModalOpen(!isClientModalOpen);
  };
  const toggleAdminModal = () => {
    setIsAdminModalOpen(!isAdminModalOpen);
  };

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

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
    setSelectedUserType([]);
    setSelectedStatus([]);
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery ? searchQuery.toLowerCase() : '';
  
    // User Type Filter
    if (selectedUserType.length > 0 && !selectedUserType.includes(user.User_role)) {
      return false;
    }

    // User Status Filter
    if (selectedStatus.length > 0) {
      const isActive = user.User_status === "1";
      const isInactive = user.User_status === "0";
      if (isActive && !selectedStatus.includes("active")) {
        return false;
      }
      if (isInactive && !selectedStatus.includes("inactive")) {
        return false;
      }
    }
  
    // Ensure user.id exists and then perform the search query filter
    if (user.id && user.id.toString() === query) {
      return true;
    }
  
    // Search Query Filter
    return (
      user.email.toLowerCase().includes(query) ||
      user.User_name.toLowerCase().includes(query) ||
      user.phone.includes(query) ||
      user.b_date.toLowerCase().includes(query) ||
      user.User_role.toLowerCase().includes(query) ||
      (user.User_status === "1" && "active".includes(query.toLowerCase()))
    );
  });

  useEffect(() => {
    fetchUsers();
    getUserName();
  }, []);

  const getUserName = async () => {
    const storedUserName = sessionStorage.getItem("name");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  };

  const fetchUsers = async () => {
    try {
      const requestSender = new RequestSender();
      const response = await requestSender.sendRequest("users", "GET");

      if (!response) {
        console.error("Error: empty response received.");
        return;
      }

      if (response.status === 200) {
        setUsers(response.data.data.users);
      } else {
        const statusCode = response.status;
        if (statusCode === 401 || statusCode === 403) {
          throw new Error("Invalid credentials");
        } else {
          throw new Error(`Unexpected status code ${statusCode}`);
        }
      }
    } catch (error) {
      console.error("Error fetching users: ", error);
      throw error;
    }
  };

  const updateUserStatus = async (uuidToUpdate, isActive) => {
    try {
      const requestSender = new RequestSender();
      const response = await requestSender.sendRequest(
        `user/${uuidToUpdate}/status`,
        "PUT",
        { isActive }
      );

      if (response.status === 200) {
        toast.success("User deleted successfully", {
          className: "bg-[#1A4810] text-white",
          bodyClassName: "text-sm",
          progressClassName: "bg-white",
        });
        fetchUsers();
      } else {
        toast.error(`Failed to delete user: ${response.message}`, {
          className: "bg-[#BE3F3F] text-white",
          bodyClassName: "text-sm",
          progressClassName: "bg-white",
        });
      }
    } catch (error) {
      toast.error("Error deleting user: " + error.message, {
        className: "bg-[#BE3F3F] text-white",
        bodyClassName: "text-sm",
        progressClassName: "bg-white",
      });
    }
  };

  return (
    <div>
      <ToastContainer
        toastClassName="relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        bodyClassName="flex text-sm font-md block p-3"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={true}
      />
      <NavBar
        openEmployeeModal={toggleEmployeeModal}
        openClientModal={togglelientModal}
        openAdminModal={toggleAdminModal}
      />
      <div className="hero-section">
        <img src={createUserBanner}></img>
      </div>
      <div className="flex justify-center bg-[#FFFCF7] text-4xl">
        <FontAwesomeIcon
          className="employee-icon"
          icon={faKiwiBird}
        ></FontAwesomeIcon>
      </div>
      <div>
        <h1 className="flex justify-center font-medium text-5xl text-[#4C83A5] bg-[#FFFCF7]">
          {userName}
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
      <div className="items-center p-16 bg-[#FFFCF7]">
        <div className="flex flex-col items-center justify-center bg-[#FFFCF7]">
          <h1 className="p-4 font-black text-[#33665B] text-4xl uppercase">
            Users
          </h1>
        </div>
        <div className="flex mt-8 mb-6 justify-start items-start">
          <Link className="links" to="/admin/users/new">
            <button
              type="submit"
              className="flex justify-center rounded-xl bg-[#48744C] font-normal text-white shadow-md p-3"
            >
              <FontAwesomeIcon
                className="flex text-sm font-medium mt-0.5"
                icon={faPlus}
              />
              <p className="text-sm font-medium uppercase ml-2 whitespace-nowrap">
                New User
              </p>
            </button>
          </Link>
        </div>
        <div className="relative shadow-2xl sm:rounded-lg bg-[#FFFCF7]">
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
                      User Status
                    </h3>
                    <ul className="flex flex-col space-y-2">
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-[#6d9dc5] rounded-sm"
                            checked={selectedStatus.includes("1")}
                            onChange={() =>
                              toggleFilter(
                                selectedStatus,
                                setSelectedStatus,
                                "1"
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
                            checked={selectedStatus.includes("0")}
                            onChange={() =>
                              toggleFilter(
                                selectedStatus,
                                setSelectedStatus,
                                "0"
                              )
                            }
                          />
                          <span className="ml-2">Inactive</span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-[#4c83a5] mb-2">
                      User Type
                    </h3>
                    <ul className="flex flex-col space-y-2">
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-[#6d9dc5] rounded-sm"
                            checked={selectedUserType.includes("administrator")}
                            onChange={() =>
                              toggleFilter(
                                selectedUserType,
                                setSelectedUserType,
                                "administrator"
                              )
                            }
                          />
                          <span className="ml-2">Administrator</span>
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-[#6d9dc5] rounded-sm"
                            checked={selectedUserType.includes("employee")}
                            onChange={() =>
                              toggleFilter(
                                selectedUserType,
                                setSelectedUserType,
                                "employee"
                              )
                            }
                          />
                          <span className="ml-2">Employee</span>
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-[#6d9dc5] rounded-sm"
                            checked={selectedUserType.includes("client")}
                            onChange={() =>
                              toggleFilter(
                                selectedUserType,
                                setSelectedUserType,
                                "client"
                              )
                            }
                          />
                          <span className="ml-2">Client</span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4">                   
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
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-white uppercase bg-[#6B98B4]">
              <tr>
                <th scope="col" className="px-6 py-3 uppercase">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 uppercase">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 uppercase">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 uppercase">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 uppercase">
                  Birthdate
                </th>
                <th scope="col" className="px-6 py-3 uppercase"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr className="bg-white">
                  <td colSpan="6" className="bg-white text-center text-3xl text-[#6d9dc5] py-44">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.email} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{user.User_name}</span>
                        <span className="text-xs text-[#48744C]">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{user.User_role}</td>
                    <td className="px-6 py-4">
                      {user.User_status === "1" ? (
                        <p className="flex items-center gap-2 justify-start text-[#979797] font-normal">
                          <span className="h-1 w-1 rounded-full bg-green-500 inline-block"></span>
                          Active
                        </p>
                      ) : (
                        <p className="flex items-center gap-2 justify-start text-[#979797] font-normal">
                          <span className="h-1 w-1 rounded-full bg-red-500 inline-block"></span>
                          Inactive
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">{user.phone}</td>
                    <td className="px-6 py-4">{new Date(user.b_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <a
                        href="#"
                        type="button"
                        data-modal-target="editUserModal"
                        data-modal-show="editUserModal"
                        className="font-medium text-gray-500 p-2"
                        onClick={() => openModal("editUserModal")}
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </a>
                      <a
                        href="#"
                        type="button"
                        data-modal-target="deleteUserModal"
                        data-modal-show="deleteUserModal"
                        className="font-medium text-gray-500 p-2"
                        onClick={() => {
                          setUserToDelete(user.uuid);
                          openModal("deleteUserModal");
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div
            id="editUserModal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 left-0 right-0 z-50 items-center justify-center hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
          >
            <div className="relative w-full max-w-2xl max-h-full">
              <form className="relative bg-white rounded-lg shadow">
                <div className="flex items-start justify-between p-4 border-b rounded-t">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Edit user
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                    darkata-modal-hide="editUserModal"
                    onClick={() => closeModal("editUserModal")}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                        placeholder="Bonnie"
                        required=""
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder="Green"
                        required=""
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder="example@company.com"
                        required=""
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="phone-number"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Phone Number
                      </label>
                      <input
                        type="number"
                        name="phone-number"
                        id="phone-number"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder="e.g. +(12)3456 789"
                        required=""
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="department"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Department
                      </label>
                      <input
                        type="text"
                        name="department"
                        id="department"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder="Development"
                        required=""
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="company"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Company
                      </label>
                      <input
                        type="number"
                        name="company"
                        id="company"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder="123456"
                        required=""
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="current-password"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="current-password"
                        id="current-password"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder="••••••••"
                        required=""
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="new-password"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        name="new-password"
                        id="new-password"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder="••••••••"
                        required=""
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b">
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Save all
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div
            id="deleteUserModal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center hidden z-50"
          >
            <div className="absolute w-full h-full bg-gray-800 opacity-50"></div>
            <div className="relative w-full max-w-xl bg-[#33665B] rounded-lg shadow-lg">
              <div className="flex flex-col p-4">
                <button
                  type="button"
                  className="self-end text-gray-400 hover:text-gray-800 focus:outline-none"
                  onClick={() => closeModal("deleteUserModal")}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
                <h3 className="text-2xl text-center justify-center font-semibold text-white mb-4">
                  Delete User
                </h3>
                <p className="text-white mb-6 text-xl text-center justify-center italic">
                  Are you sure you want to delete this user?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
                    onClick={() => closeModal("deleteUserModal")}
                    data-modal-hide="deleteUserModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
                    onClick={() => {
                      if (userToDelete) {
                        const isActive = false;
                        updateUserStatus(userToDelete, isActive);
                        closeModal("deleteUserModal");
                      }
                    }}
                    data-modal-hide="deleteUserModal"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Creacion_Usuario;
