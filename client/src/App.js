// npm run build:watch
// npm run start

// Root component of the app
// Contains the routing for the app
// To render the app, the App component is rendered in the index.js file
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./styles/main.css";
import Login from "./components/login/login";
import Home from "./components/home/home";
import NuevaReservaForm from "./components/nueva_reserva_form/nueva_reserva_form";
import Creacion_Usuario from "./components/creacion_usuario/creacion_usuario";
import Creacion_Usuario_Form from "./components/creacion_usu_form/creacion_usu_form";
import SearchBox from "./components/searchBox/searchBox";
import FilterBox from "./components/filterBox/filterBox";
import AdditionalInfo from "./components/additionalInfo/additionalInfo";
import Footer from "./components/footer/footer";
import ReservationClient from "./components/reservationClient/reservationClient";
import ReservationsEmployee from "./components/reservationsEmployee/reservationsEmployee";
import PaymentHistoryClient from "./components/paymentHistoryClient/paymentHistoryClient";
import PaymentHistoryEmployee from "./components/paymentHistoryEmployee/paymentHistoryEmployee";
import SignInForm from "./components/signInForm/signInForm";
import PasswordChange1 from "./components/passwordChange1/passwordChange1";
import PasswordChange2 from "./components/passwordChange2/passwordChange2";
import PasswordRemember from "./components/passwordRemember/passwordRemember";
import ProfileModalClient from "./components/profileModalClient/profileModalClient";
import ProfileModalEmployee from "./components/profileModalEmployee/profileModalEmployee";
import SessionManager from "./common/sessionManager";
import RoomsSection from "./components/roomsSection/roomsSection";
import NewClientReservation from "./components/newReservationsClient/newReservationClient";
import AmenitiesSection from "./components/amenitiesSection/amenitiesSection";
import { AuthProvider } from "./contexts/authContext";
import { ReservationProvider } from "./contexts/reservation";
import NotificationModal from "./components/notificationModal/notificationModal";
import ReservationModModal from "./components/reserveModModal/reservationModificationModal";
import NewReservationClient from "./components/newReservationsClient/newReservationClient";
import ContactSection from "./components/contactSection/contactSection";
import InformationSection from "./components/informationSection/informationSection";
import Tester from "./TESTING/Tester";
import PaymentScreen from "./components/paymentscreen/paymentscreen";
import ReservationConfirmation from "./components/reservConfirmation/reservConfirmation";
import BadRequest from "./components/badRequest/badRequest";
function App() {
  const [backendData, setBackendData] = useState([{}]);

  // Para login
  // useState: shows the login component
  const [displayLogin, setDisplayLogin] = useState(false);
  const [displayHome, setDisplayHome] = useState(true);
  const [displayRegistro, setDisplayRegistro] = useState(false);

  return (
    <AuthProvider>
      <ReservationProvider>
        <Router>
          <div>
            <Routes>
              <Route
                path="/changePassword1"
                element={<PasswordChange1 />}
              ></Route>
              <Route
                path="/changePassword2"
                element={<PasswordChange2 />}
              ></Route>
              <Route
                path="/rememberPassword"
                element={<PasswordRemember />}
              ></Route>
              <Route path="/" element={<Home />}></Route>
              <Route path="/home" element={<Home />}></Route>
              <Route path="/rooms" element={<RoomsSection />}></Route>
              <Route path="/contact" element={<ContactSection />}></Route>
              <Route path="/amenities" element={<AmenitiesSection />}></Route>
              <Route path="/reserve" element={<NewClientReservation />}></Route>
              <Route
                path="/newReservationClient"
                element={<NewReservationClient />}
              ></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route
                exact
                path="/employee-booking-new"
                element={<NuevaReservaForm />}
              ></Route>
              <Route path="/admin/users" element={<Creacion_Usuario />}></Route>
              <Route
                path="/admin/users/new"
                element={<Creacion_Usuario_Form />}
              ></Route>
              <Route path="/searchBox" element={<SearchBox />}></Route>
              <Route path="/filterBox" element={<FilterBox />}></Route>
              <Route
                path="/additionalInfo"
                element={<AdditionalInfo />}
              ></Route>
              <Route path="/footer" element={<Footer />}></Route>
              <Route
                path="/myReservations"
                element={<ReservationClient />}
              ></Route>
              <Route path="/signin" element={<SignInForm />}></Route>{" "}
              <Route
                path="/employee-booking"
                element={<ReservationsEmployee />}
              ></Route>
              <Route
                path="/information"
                element={<InformationSection />}
              ></Route>
              <Route
                path="/myRecepits"
                element={<PaymentHistoryClient />}
              ></Route>
              <Route
                path="/recepits"
                element={<PaymentHistoryEmployee />}
              ></Route>
              <Route
                path="/confirmationEmailModal"
                element={<NotificationModal />}
              ></Route>
              <Route path="/tester" element={<Tester />}></Route>
              <Route path="/pay" element={<PaymentScreen />}></Route>
              <Route
                path="/confirmation"
                element={<ReservationConfirmation />}
              ></Route>
              <Route path="/badRequest" element={<BadRequest />}></Route>
            </Routes>
          </div>
        </Router>
        <ProfileModalEmployee></ProfileModalEmployee>
        <ProfileModalClient></ProfileModalClient>
        <ReservationModModal></ReservationModModal>
      </ReservationProvider>
    </AuthProvider>
  );
}

export default App;
