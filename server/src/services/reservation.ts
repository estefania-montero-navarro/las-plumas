import { ReservationDB } from "../types/Reservation";
import { DbConnection } from "./dbConnection";
import { ConfirmationEmailService } from "./confirmationEmail";

export class ReservationService {

  private emailService: ConfirmationEmailService;

  constructor() {
    this.emailService = new ConfirmationEmailService();
  }


  // todas las reservaciones
  public async getAllReservations() {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool?.request().query(`
      SELECT 
        Reservation.id,
        Reservation.reservation_status,
        Reservation.uuid,
        Reservation.check_in,
        Reservation.check_out,
        _User.User_name
      FROM 
          Reservation
      JOIN 
          _User ON Reservation.uuid = _User.uuid;
      `);

      // Verifica si result o result.recordset son undefined
      if (!result || !Array.isArray(result.recordset)) {
        return undefined;
      }

      return result.recordset;
    } catch (error) {
      // Manejo de errores: devuelve undefined en caso de error
      console.error("Error obtaining all reservations: ", error);
      return undefined;
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async getRoomsByReservationId(reservationId: number) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("reservationId", reservationId)
        .query(
          "SELECT Room.* FROM Room JOIN RoomXReservation ON Room.id = RoomXReservation.room_id WHERE RoomXReservation.reservation_id = @reservationId;"
        );

      if (!result || !result.recordset || result.recordset.length === 0) {
        return undefined;
      }

      const rooms = result.recordset;

      return rooms;
    } catch (error) {
      console.error(
        "Error getting rooms by reservation ID(reservation services):",
        error
      );
      return undefined;
    } finally {
      await DbConnection.getInstance().closeConnection();
    }
  }

  /*
    Este metodo busca siempre el mayor id de las reservaciones existentes, para incrementarlo en 1 y devolver un id
    nuevo para crear la reservacion

  */
  public async getNewReservationId(): Promise<number | undefined> {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .query("SELECT MAX(id) AS max_id FROM Reservation;");

      if (!result || !result.recordset || !result.recordset[0].max_id) {
        // Si no hay registros en la tabla o no hay ID máximo, devuelve 1 como nuevo ID
        return 1;
      }

      const maxId = result.recordset[0].max_id;
      // Incrementa el ID máximo en 1 para obtener el nuevo ID
      const newId = maxId + 1;
      console.log("Nuevo ID de reserva:", newId);
      return newId;
    } catch (error) {
      console.error("Error al obtener el nuevo ID de reserva:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  // todas las reservaciones que cumplan con la condicion
  public async getReservationByStatus(status: string) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("status", status)
        .query("SELECT * Reservation WHERE reservation_status = @status;");
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener habitacion por tipo:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  // Get reservations by user's email
  public async getReservationByEmail(email: string) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool?.request().input("email", email).query(`
        SELECT r.*
        FROM Reservation r
        INNER JOIN _User u ON r.uuid = u.uuid
        WHERE u.email = @email
      `);
      if (!result || !Array.isArray(result.recordset)) {
        return undefined;
      }
      return result.recordset;
    } catch (error) {
      console.error("Error getting reservations by email:", error);
      return undefined;
    } finally {
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async getByReservationAmenities(reservation_id: string) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool?.request().input("reservation_id", reservation_id).query(`
        SELECT axr.*, a.amenitie_name, a.price
        FROM AmenitiesXReservation axr
        INNER JOIN Amenities a ON axr.service_id = a.id
        WHERE axr.reservation_id = @reservation_id
      `);
  
      if (!result || !Array.isArray(result.recordset)) {
        return undefined;
      }
  
      return result.recordset;
    } catch (error) {
      console.error("Error getting amenities by reservation_id:", error);
      return undefined;
    } finally {
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async getReservationReciept(reservation_id: string) {
    try {
        const pool = await DbConnection.getInstance().getConnection();
        const result = await pool?.request()
            .input("reservation_id", reservation_id)
            .query(`
                SELECT * 
                FROM Recipt 
                WHERE reservation_id = @reservation_id
            `);

        if (!result || !Array.isArray(result.recordset)) {
            return undefined;
        }

        return result.recordset;
    } catch (error) {
        console.error("Error getting receipts by reservation_id:", error);
        return undefined;
    } finally {
        await DbConnection.getInstance().closeConnection();
    }
}

  
  
  // todas las reservaciones segun fecha de entrada
  public async getReservationsByCheckIn(checkIn: Date) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("checkIn", checkIn)
        .query("SELECT * Reservation WHERE check_in = @checkIn;");
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener habitacion por fecha de entrada:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }
  // todas las reservaciones segun fecha de salida
  public async getReservationsByCheckOut(checkOut: Date) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("checkOut", checkOut)
        .query("SELECT * Reservation WHERE check_out = @checkOut;");
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener habitacion por fecha de salida:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async getReservationById(
    reservationId: number
  ): Promise<ReservationDB | undefined> {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("id", reservationId)
        .query("Select * FROM Reservation WHERE  id=@id;");
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      const reservation: ReservationDB = result.recordset[0];
      return reservation;
    } catch (error) {
      console.error("Error al obtener habitacion por fecha de salida:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async getReservationRooms(reservationId: number) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("reservationId", reservationId)
        .query(
          "SELECT room_id FROM RoomXReservation WHERE reservation_id = @reservationId"
        );
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      return result.recordset;
    } catch (error) {
      console.error(
        "Error al obtener las habitaciones de la reservacion",
        error
      );
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async getReservationAmenities(reservationId: number) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("reservationId", reservationId)
        .query(
          "SELECT service_id FROM AmenitiesXReservation WHERE reservation_id = @reservationId"
        );
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      const amenityIds = result.recordset.map((record: any) => record.service_id);
      return amenityIds;
    } catch (error) {
      console.error("Error al obtener las amenidades de la reservacion", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }
  // Crear reservacion
  public async createReservation(
    reservationId: number,
    email: string,
    checkIn: Date,
    checkOut: Date
  ) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("reservationId", reservationId)
        .input("email", email)
        .input("checkIn", checkIn)
        .input("checkOut", checkOut)
        .input("reservationStatus", "active").query(`
              DECLARE @userId NVARCHAR(255);

              -- Retrieve the userId from the _User table using the provided email
              SELECT @userId = uuid
              FROM _User
              WHERE email = @email;

              -- Insert a new row into the Reservation table
              INSERT INTO Reservation (id, reservation_status, uuid, check_in, check_out)
              VALUES (@reservationId,@reservationStatus, @userId, @checkIn, @checkOut);
          `);

      // Verificar si result o result.recordset son undefined
      //console.log("result", result);
      if (!result) {
        return undefined;
      }

      // Send confirmation email
      const subject = "Reservation Confirmation";
      const body = `Your reservation has been successfully created with ID: ${reservationId}. Check-in: ${checkIn}. Check-out: ${checkOut}.`;
      await this.emailService.sendConfirmationEmail(email, subject, body);

      return 1;
    } catch (error) {
      console.error("Error al crear la reservación:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async deleteReservation(reservationId: number) {
    try {
        const pool = await DbConnection.getInstance().getConnection();

        // Update reservation status to 'inactive'
        const result = await pool?.request()
            .input("reservationId", reservationId)
            .query(`
                UPDATE Reservation
                SET reservation_status = 'inactive'
                WHERE id = @reservationId;
            `);

        if (!result) {
            throw new Error("Failed to update reservation status to inactive");
        }

        // Retrieve email associated with the reservation
        const emailResult = await pool?.request()
            .input("reservationId", reservationId)
            .query(`
                SELECT u.email
                FROM _User u
                JOIN Reservation r ON u.uuid = r.uuid
                WHERE r.id = @reservationId;
            `);

        if (!emailResult || emailResult.recordset.length === 0) {
            throw new Error("Email address could not be found for the reservation");
        }

        const email = emailResult.recordset[0].email;

        if (!email) {
            throw new Error("Email address is required for sending confirmation email");
        }

        // Send confirmation email
        const subject = "Reservation Deactivation Confirmation";
        const body = `Dear guest,
            Your reservation with ID: ${reservationId} has been set to inactive.
            If you have any questions, please contact our customer support.
        `;
        await this.emailService.sendConfirmationEmail(email, subject, body);

        return 1;
    } catch (error) {
        console.error("Error canceling the reservation:", error);
        return false;
    } finally {
        await DbConnection.getInstance().closeConnection();
    }
}


public async setInactive(reservationId: number) {
  try {
    const pool = await DbConnection.getInstance().getConnection();
    const result = await pool?.request().input("reservationId", reservationId)
      .query(`
        UPDATE Reservation
        SET reservation_status = 'inactive'
        WHERE id = @reservationId;
      `);

    // Verificar si result o result.recordset son undefined
    if (!result) {
      return undefined;
    }

    return 1;
  } catch (error) {
    console.error("Error al modificar la reservación:", error);
    return undefined; // Manejo de errores: devuelve undefined en caso de error
  } finally {
    // Cierra la conexión aquí, independientemente de si hay un error o no
    await DbConnection.getInstance().closeConnection();
  }
}



  public async setActive(reservationId: number) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool?.request().input("reservationId", reservationId)
        .query(`
          UPDATE Reservation
          SET reservation_status = 'active'
          WHERE id = @reservationId;
        `);

      // Verificar si result o result.recordset son undefined
      if (!result) {
        return undefined;
      }

      return 1;
    } catch (error) {
      console.error("Error al modificar la reservación:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async modifyReservationDates(
    newCheckIn: Date,
    newCheckOut: Date,
    reservationId: number
  ) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      
      // Retrieve the email associated with the reservation
      const userResult = await pool
        ?.request()
        .input("reservationId", reservationId)
        .query(`
          SELECT u.email
          FROM _User u
          JOIN Reservation r ON u.uuid = r.uuid
          WHERE r.id = @reservationId;
        `);

      if (!userResult || userResult.recordset.length === 0) {
        throw new Error("Email address could not be found for the reservation");
      }

      const email = userResult.recordset[0].email;

      if (!email) {
        throw new Error("Email address is required for sending confirmation email");
      }

      // Update the reservation dates
      const result = await pool
        ?.request()
        .input("checkIn", newCheckIn)
        .input("checkOut", newCheckOut)
        .input("reservationId", reservationId)
        .query(`
          UPDATE Reservation
          SET check_in = @checkIn, check_out = @checkOut
          WHERE id = @reservationId;
        `);

      if (!result) {
        return undefined;
      }

      // Send confirmation email
      const subject = "Reservation Modification Confirmation";
      const body = `Dear guest,
        Your reservation with ID: ${reservationId} has been successfully modified.
        Thee following are the new dates associated to your reservation.
        New Check-in: ${newCheckIn}. New Check-out: ${newCheckOut}.`;
      await this.emailService.sendConfirmationEmail(email, subject, body);

      return 1;
    } catch (error) {
      console.error("Error modifying the reservation:", error);
      return undefined;
    } finally {
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async removeRoomFromReservation(
    roomId: number,
    reservationId: number
  ) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("roomId", roomId)
        .input("reservationId", reservationId).query(`
          DELETE FROM RoomXReservation
          WHERE room_id = @roomId AND reservation_id = @reservationId;
        `);

      // Verificar si result o result.recordset son undefined
      if (!result) {
        return undefined;
      }

      return 1;
    } catch (error) {
      console.error("Error al modificar la reservación:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }
}
