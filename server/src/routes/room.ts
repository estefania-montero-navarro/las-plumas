import { RoomController } from "../controllers/room";
import express from "express";

export const router = express.Router();

export const prefix = "/api/v1";

const roomController = new RoomController();

router.get("/rooms", roomController.getRoomByType);
router.get("/available-rooms", roomController.getAmountAvailableRooms);
router.get(
  "/client/rooms/:reservationId",
  roomController.getRoomsByReservationId
);
