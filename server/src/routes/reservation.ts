import { ReservationController } from "../controllers/reservation";

import express from "express";

export const router = express.Router();

export const prefix = "/api/v1";

const reservationController = new ReservationController();

router.post("/reservation", reservationController.makeReservation);
router.get("/reservations", reservationController.getAllReservations);
router.get("/reservation", reservationController.getReservation);
router.post(
  "/client/reservations",
  reservationController.getClientReservations
);
router.put("/reservation", reservationController.modifyReservation);
router.post("/employee/reservations", reservationController.getAllReservations);
router.post(
  "/client/reservations",
  reservationController.getClientReservations
);
router.post(
  "/employee/reservations/cancel",
  reservationController.deleteReservation
);
router.post(
  "/client/reservations/cancel",
  reservationController.deleteReservation
);

router.post(
  "/client/reservations/amenities",
  reservationController.getByReservationAmenities
);

router.post(
  "/client/reservations/reciept",
  reservationController.getReservationReceipt
);
