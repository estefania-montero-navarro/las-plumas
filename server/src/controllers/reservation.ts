import { Request, Response } from "express";
import { UserService } from "../services/user";
import { ReservationService } from "../services/reservation";
import { UserDB } from "../types/User";
import { ReservationDB } from "../types/Reservation";
import { RoomController } from "./room";
import { RoomService } from "../services/room";
import { AmenityService } from "../services/amenities";
import { error } from "console";

export class ReservationController {
  //constructor(private reservService: ReservationService = new ReservationService()) {}

  private userService = new UserService();
  private reservService = new ReservationService();
  private roomController = new RoomController();

  public async makeReservation(req: Request, res: Response) {
    const roomService = new RoomService();
    const userService = new UserService();
    const reservService = new ReservationService();
    const amenityService = new AmenityService();

    try {
      // extrear los datos de la reservacion
      const {
        email,
        checkIn,
        checkOut,
        guests,
        nights,
        rooms,
        services,
        totalPrice,
      } = req.body;
      const roomsArray = await roomService.getRoomAmounts(rooms);

      // buscar el usuario y verificar que este activo
      const user: UserDB | undefined = await userService.getUserEmail(email);
      if (!user) {
        return res.status(406).json({
          status: 406,
          message: "The email entered is invalid.",
        });
      }
      if (user.status === false) {
        return res.status(412).json({
          status: 412,
          message: "The account is currently inactive.",
        });
      }
      const reservationId = await reservService.getNewReservationId();
      if (!reservationId) {
        return res.status(500).json({
          status: 500,
          message: "Reservation could not be created, please try later.",
        });
      }

      // buscar metodo que haga las reservaciones 1 por 1
      const availableRooms = await roomService.verifyAvailability(
        roomsArray,
        checkIn,
        checkOut
      );
      if (typeof availableRooms === "string") {
        return res.status(409).json({
          status: 409,
          message: availableRooms,
        });
      } else {
        // TODO: verificar la disponibilidad de las amenidades
        let spaAvailability, gymAvailability, transportationAvailability;
        if (services.Spa.guests != 0) {
          spaAvailability = await amenityService.getAmenityAvailabilityOnDate(
            1,
            services.Spa.date
          );
          if (spaAvailability === undefined) {
            return res.status(500).json({
              status: 500,
              message: "Error retrieving spa availability.",
            });
          }
          if (spaAvailability && services.Spa.guests > spaAvailability) {
            return res.status(409).json({
              status: 409,
              message: `There is no available spaces for the Spa on ${services.Spa.date} for ${services.Spa.guests}. Total availability for the day: ${spaAvailability}`,
            });
          }
        }
        if (services.Gym.guests != 0) {
          gymAvailability = await amenityService.getAmenityAvailabilityOnDate(
            2,
            services.Gym.date
          );
          if (gymAvailability === undefined) {
            return res.status(500).json({
              status: 500,
              message: "Error retrieving gym availability.",
            });
          }
          if (gymAvailability && services.Gym.guests > gymAvailability) {
            return res.status(409).json({
              status: 409,
              message: `There is no available spaces for the Gym on ${services.Gym.date} for ${services.Gym.guests}. Total availability for the day: ${gymAvailability}`,
            });
          }
        }
        if (services.Transportation.guests != 0) {
          let transportationAvailability =
            await amenityService.getAmenityAvailabilityOnDate(
              3,
              new Date(services.Transportation.date)
            );

          if (transportationAvailability === undefined) {
            return res.status(500).json({
              status: 500,
              message: "Error retrieving transportation availability.",
            });
          }

          if (services.Transportation.guests > transportationAvailability) {
            return res.status(409).json({
              status: 409,
              message: `There is no available spaces for the Transportation on ${services.Transportation.date} for ${services.Transportation.guests}. Total availability for the day: ${transportationAvailability}`,
            });
          }
        }

        console.log("availableRooms", availableRooms);

        const reservationSuccess = await reservService.createReservation(
          reservationId,
          email,
          checkIn,
          checkOut
        );
        console.log("reservationSuccess", reservationSuccess);
        if (!reservationSuccess) {
          return res
            .status(500)
            .send("An error occurred while making the reservation");
        }
        const roomReservationSuccess = await roomService.linkRoomToReservation(
          availableRooms,
          reservationId
        );
        if (roomReservationSuccess == undefined) {
          return res.status(500).json({
            status: 500,
            message: "Internal server error, please try again later",
          });
        }

        let amenities = [1, 2, 3];
        let dates = [
          services.Spa.date,
          services.Gym.date,
          services.Transportation.date,
        ];
        let guests = [
          services.Spa.guests,
          services.Gym.guests,
          services.Transportation.guests,
        ];

        let amenitiesSucces = await amenityService.linkAmenitiesToReservation(
          amenities,
          dates,
          guests,
          reservationId
        );
        if (!amenitiesSucces || amenitiesSucces === undefined) {
          return res
            .status(500)
            .send("An error occurred while making the reservation");
        }
        console.log("amenities succes ", amenitiesSucces);
        return res.status(201).json({
          message: "Reservation created succesfully",
          reservationId: reservationId,
        });
      }
    } catch (error) {
      console.error("An error occurred while making the reservation:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error, please try again later",
      });
    }
  }

  public async deleteReservation(req: Request, res: Response) {
    const reservService = new ReservationService();
    const { id: reservationId } = req.body;
    try {
      // Check if the reservation exists and is active
      const reservation = await reservService.getReservationById(reservationId);
      if (!reservation) {
        return res.status(409).json({
          status: 409,
          message: "No reservation found for this reservation ID",
        });
      }

      // Cancel the reservation
      const deleteReserv = await reservService.deleteReservation(reservationId);
      if (!deleteReserv) {
        return res.status(500).json({
          status: 500,
          message: "Failed to delete the reservation",
        });
      }

      return res.status(202).json({
        status: 202,
        message: "Reservation was deleted successfully",
      });
    } catch (error) {
      console.error("Error canceling reservation:", error);
      return res.status(500).json({
        status: 500,
        message: "Internal server error, please try again later",
      });
    }
  }

  public async getAllReservations(req: Request, res: Response) {
    const reservService = new ReservationService();

    try {
      const reservations = await reservService.getAllReservations();
      console.log("RESERVAS: ", reservations);
      if (!reservations) {
        return res.status(404).json({
          status: 404,
          message: "No reservations found in the database",
        });
      }
      res.send({
        status: 202,
        message: "Reservations obtained successfully",
        data: {
          reservations,
        },
      });
    } catch (error) {
      console.error("Error getting reservations: ", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error, please try again later",
      });
    }
  }

  public async getReservation(req: Request, res: Response) {
    try {
      const paramId = req.query.id;

      if (typeof paramId != "string") {
        throw error;
      }
      const id = parseInt(paramId);
      const reservService = new ReservationService();
      const reservation: ReservationDB | undefined =
        await reservService.getReservationById(id);
      if (reservation === undefined) {
        return res.status(500).json({
          status: 500,
          message: "Reservation not found",
        });
      }
      const userService = new UserService();
      const user: UserDB | undefined = await userService.getUserById(
        reservation.uuid
      );
      if (user === undefined) {
        throw error;
      }
      const roomRecordset = await reservService.getReservationRooms(id);
      if (roomRecordset === undefined) {
        throw error;
      }
      const roomService = new RoomService();
      const roomNumbers = roomRecordset.map((room) => room.room_id);
      const roomTypes = await roomService.getRoomTypes(roomNumbers);

      const amenitiesRecordset = await reservService.getReservationAmenities(
        id
      );
      if (amenitiesRecordset === undefined) {
        throw error;
      }
      let amenities: string[] = [];
      const amenitiesMap: { [key: number]: string } = {
        1: "Spa",
        2: "Gym",
        3: "Transportation",
      };

      amenitiesRecordset.forEach((amenity) => {
        const amenityName = amenitiesMap[amenity];
        if (amenityName) {
          amenities.push(amenityName);
        }
      });

      const reservationData = {
        user: user.email,
        rooms: roomTypes,
        amenities: amenities,
        checkIn: reservation.check_in,
        checkOut: reservation.check_out,
      };
      res.send({
        status: 200,
        message: "Reservation found successfully",
        reservationData,
      });
    } catch (error) {
      console.error("Error al obtener reservacion:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error, please try again later",
      });
    }
  }

  public async getClientReservations(req: Request, res: Response) {
    const reservService = new ReservationService();
    const email = req.body.email;

    try {
      const reservations = await reservService.getReservationByEmail(email);
      if (!reservations) {
        return res.status(404).json({
          status: 404,
          message: "No reservations found for this email",
        });
      }
      res.send({
        status: 200,
        message: "Reservations obtained successfully",
        data: {
          reservations,
        },
      });
    } catch (error) {
      console.error("Error getting reservations by email:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error, please try again later",
      });
    }
  }

  public async getByReservationAmenities(req: Request, res: Response) {
    const reservService = new ReservationService();
    const reservId = req.body.reservationId;
    try {
      const amenities = await reservService.getByReservationAmenities(reservId);
      if (!amenities) {
        return res.status(404).json({
          status: 404,
          message: "No amenities found for this reservation",
        });
      }
      res.send({
        status: 200,
        message: "Amenities obtained successfully",
        data: {
          amenities,
        },
      });
    } catch (error) {
      console.error("Error getting reservations by email:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error, please try again later",
      });
    }
  }

  public async getReservationReceipt(req: Request, res: Response) {
    const reservService = new ReservationService();
    const reservId = req.body.reservationId;
    try {
      const reciept = await reservService.getReservationReciept(reservId);
      if (!reciept) {
        return res.status(404).json({
          status: 404,
          message: "No amenities found for this reservation",
        });
      }
      res.send({
        status: 200,
        message: "Amenities obtained successfully",
        data: {
          reciept,
        },
      });
    } catch (error) {
      console.error("Error getting reservations by email:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error, please try again later",
      });
    }
  }

  public async modifyReservation(req: Request, res: Response) {
    try {
      const newCheckIn = new Date(req.body.checkIn);
      const newCheckOut = new Date(req.body.checkOut);
      const reservationId = req.body.reservationId;
      const newRoomsFE = req.body.rooms;

      const reservService = new ReservationService();
      const roomService = new RoomService();

      const newRooms = await roomService.switchFERoomsToDB(newRoomsFE);
      console.log("newRooms", newRooms);
      console.log("newRoomsFE", newRoomsFE);

      const reservation: ReservationDB | undefined =
        await reservService.getReservationById(reservationId);

      if (reservation === undefined) {
        console.log("Reservation not found");
        return res.status(404).json({
          status: 404,
          message: "Reservation not found",
        });
      }

      const oldRoomsRecordset = await reservService.getReservationRooms(
        reservationId
      );
      if (oldRoomsRecordset === undefined) {
        throw new Error("Old rooms recordset is undefined");
      }

      const oldRoomNumbers = oldRoomsRecordset.map((room) => room.room_id);
      const oldRooms = await roomService.getRoomTypes(oldRoomNumbers);
      if (oldRooms === undefined) {
        throw new Error("Old rooms are undefined");
      }

      console.log("reservation", reservationId);
      console.log("oldRooms", oldRooms);

      await reservService.setInactive(reservationId); // Await the setInactive method

      if (JSON.stringify(oldRooms) !== JSON.stringify(newRooms)) {
        const roomItems = await roomService.generateRoomItems(newRooms);

        const availability = await roomService.verifyAvailability(
          roomItems,
          newCheckIn,
          newCheckOut
        );
        console.log("availability", availability);

        if (typeof availability === "string") {
          return res.status(409).json({
            status: 409,
            message: availability,
          });
        }

        await roomService.linkRoomToReservation(availability, reservationId);

        console.log("oldRoomNumbers", oldRoomNumbers);

        for (const roomNumber of oldRoomNumbers) {
          await reservService.removeRoomFromReservation(
            roomNumber,
            reservationId
          );
        }
      }

      const reservDate = await reservService.modifyReservationDates(
        newCheckIn,
        newCheckOut,
        reservationId
      );
      if (reservDate === undefined) {
        throw new Error("Failed to modify reservation dates");
      }

      return res.status(200).json({
        status: 200,
        message: "Reservation modified successfully",
      });
    } catch (error) {
      console.error("Error modifying reservation:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error, please try again later",
      });
    } finally {
      const reservService = new ReservationService();
      await reservService.setActive(req.body.reservationId);
    }
  }
}
