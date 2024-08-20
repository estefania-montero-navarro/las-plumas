import { AmenityDB } from "../types/Amenity";
import { DbConnection } from "./dbConnection";

export class AmenityService {
  public async getAmenityAvailabilityOnDate(amenityType: number, date: Date) {
    try {
      const formattedDate = new Date(); // Asegura el formato YYYY-MM-DD
      console.log(formattedDate);

      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("amenity", amenityType)
        .input("date", formattedDate).query(`
              DECLARE @current_reservations int;
              DECLARE @daily_availability int;
              DECLARE @available int;

              SELECT @current_reservations = ISNULL(SUM(guests), 0)
              FROM AmenitiesXReservation
              WHERE service_id = @amenity AND date = @date;

              SELECT @daily_availability = daily_availability
              FROM Amenities
              WHERE id = @amenity;

              SET @available = @daily_availability - @current_reservations;

              SELECT @available AS available;
          `);

      if (!result || !result.recordset || result.recordset.length === 0) {
        console.log("Ocurrió un error al ejecutar la consulta.");
        return undefined;
      }

      return result.recordset[0].available;
    } catch (error) {
      console.error(
        "Error getting rooms by reservation ID (rooms services):",
        error
      );
      return undefined;
    } finally {
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async VerifyAvailabilty(amenity: number[], date: Date[]) {
    let availability = [];
    for (let i = 0; i < amenity.length; i++) {
      availability[i] = this.getAmenityAvailabilityOnDate(amenity[i], date[i]);
      if (!availability[i] || availability[i] === undefined) {
        return [];
      }
    }
    return availability;
  }

  public async linkAmenitiesToReservation(
    amenities: number[],
    dates: Date[],
    guests: number[],
    reservationId: number
  ): Promise<any | undefined> {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      for (let i = 0; i < 3; i++) {
        if (guests[i] != 0) {
          const result = await pool
            ?.request()
            .input("amenityId", amenities[i])
            .input("date", dates[i])
            .input("guests", guests[i])
            .input("reservationId", reservationId).query(`
                  INSERT INTO AmenitiesXReservation (service_id, reservation_id, date, guests)
                  VALUES (@amenityId, @reservationId, @date, @guests);
              `);
          if (!result) {
            return undefined;
          }
        }
      }
      return 1;
    } catch (error) {
      console.error("Error al vincular habitación a la reservación:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  
}
