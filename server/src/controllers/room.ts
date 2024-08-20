import { Request, Response } from "express";
import { RoomService, RoomItem } from "../services/room";
import { RoomDB } from "../types/Room";

export class RoomController {
  roomService = new RoomService();

  public async reserveRooms(
    rooms: RoomItem[],
    availableIds: number[],
    reservationId: number
  ) {
    try {
      let totalQuantity = 0;

      rooms.forEach((room) => {
        totalQuantity += room.quantity;
      });
      console.log("totalQuantity", totalQuantity);

      // reservarlas (cambiarles la disponibilidad)
      for (let i = 0; i < totalQuantity; i++) {
        // let reservedRoomSucces = this.roomService.setAvailability(
        //   availableIds[i]
        // );
        // if (!reservedRoomSucces || reservedRoomSucces === undefined) {
        //   throw "No hay habitaciones disponibles para reservar";
        //   // return un error para
        // }
      }
      // agregarlas a la reservacion
      for (let i = 0; i < totalQuantity; i++) {
        const asignSucces = this.roomService.addRoomToReservation(
          availableIds[i],
          reservationId
        );
        if (!asignSucces || asignSucces === undefined) {
          throw "No es posible agregar la habitacion a la reservacion";
          // return un error para
        }
      }
    } catch (error) {
      console.error("Error al reservar habitacion", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    }
  }
  public async addRoomToReservation(room_id: number, reservation_id: number) {
    try {
      const asignationSiccess = this.roomService.addRoomToReservation(
        room_id,
        reservation_id
      );
      if (!asignationSiccess || asignationSiccess === undefined) {
        throw "No hay habitaciones disponibles para reservar";
        // return un error para
      }
      return asignationSiccess;
    } catch (error) {
      console.error("Error al agregar habitaciones a la reservacion", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    }
  }

  public async getRoomByType(req: Request, res: Response) {}

  public async getAmountAvailableRooms(req: Request, res: Response) {
    const roomService = new RoomService();
    try {
      const rooms = await roomService.getAmountAvailableRooms();

      if (!rooms) {
        return res.status(404).json({
          status: 404,
          message: "No available rooms found",
        });
      }

      res.send({
        status: 200,
        message: "Amount of available rooms obtained successfully",
        data: {
          rooms,
        },
      });
    } catch (error) {
      console.error("Error getting available rooms", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }

  public async getRoomsByReservationId(req: Request, res: Response) {
    const reservationId: number = Number(req.params.reservationId);

    const roomService = new RoomService();

    try {
      const rooms: RoomDB[] | undefined =
        await roomService.getRoomsByReservationId(reservationId);

      if (!rooms) {
        return res.status(404).json({
          status: 404,
          message: "No rooms found for this reservation ID",
        });
      }

      res.send({
        status: 200,
        message: "Rooms obtained successfully",
        data: {
          rooms,
        },
      });
    } catch (error) {
      console.error(
        "Error getting rooms by reservation ID (rooms controller):",
        error
      );
      res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
}
