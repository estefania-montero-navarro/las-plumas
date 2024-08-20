import { RoomDB } from "../types/Room";
import { DbConnection } from "./dbConnection";

export type RoomItem = {
  roomType: string;
  quantity: number;
};

export class RoomService {
  // must receive rooms in "db type"
  public async generateRoomItems(rooms: string[]): Promise<RoomItem[]> {
    const roomItems: RoomItem[] = [];
    rooms.forEach((room) => {
      const roomItem: RoomItem = {
        roomType: room,
        quantity: 1,
      };
      roomItems.push(roomItem);
    });
    return roomItems;
  }

  // todas las habitaciones
  public async getAllRooms() {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool?.request().query("SELECT * FROM Rooms;");
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener habitaciones:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }
  // deme toda la informacion de todas las habitaciones de typo x
  public async getRoomsByType(type: string) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("type", type)
        .query("SELECT * FROM Rooms WHERE room_type = @type;");
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

  // obtener solo una de las habitaciones que lo cumple (para despliegue de info)
  // deme todos los tipos de habitaciones que tengan x cantidad de camas
  public async getRoomsByNoBeds(noBeds: number) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("noBeds", noBeds)
        .query(
          "SELECT DISTINCT room_type, * FROM Rooms WHERE no_beds= @noBeds"
        );
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      return result.recordset;
    } catch (error) {
      console.error(
        "Error al obtener habitaciones segun numero de camas:",
        error
      );
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }
  // deme informacion de cada uno de los tipos de habitacion. Solo una habitacion por tipo
  public async getTypesOfRooms() {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .query(
          "SELECT * FROM Rooms WHERE id IN (SELECT MIN(id) FROM Rooms GROUP BY room_type)"
        );
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener tipos de habitaciones:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }
  // deme todos los tipos de habitacion que tengan x maximo de huespedes
  public async getRoomsByMaxGuests(maxGuests: number) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("maxGuests", maxGuests)
        .query(
          "SELECT DISTINCT room_type, * FROM Rooms WHERE max_guests= @maxGuests"
        );
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      return result.recordset;
    } catch (error) {
      console.error(
        "Error al obtener habitaciones segun la cantidad maxima de huespedes:",
        error
      );
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }
  // deme todos los tipos de habitacion que tengan x precio
  public async getRoomsByPrice(price: number) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("price", price)
        .query("SELECT DISTINCT room_type, * FROM Rooms WHERE price= @price");
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      return result.recordset;
    } catch (error) {
      console.error(
        "Error al obtener habitaciones segun la cantidad maxima de huespedes:",
        error
      );
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }
  // obtener todas las habitaciones que cumplan la condicion
  // deme todas las habitaciones de tipo x que esten disponibles
  public async getAvailableRooms(roomType: string) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("type", roomType)
        .query(
          "SELECT * FROM habitaciones WHERE room_type = @roomType AND is_available = 1;"
        );
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener habitaciones disponibles", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }
  // deme el id de una habitacion de tipo x que este disponible
  /*
    Este metodo busca siempre el menor id del tipo de habitacion que se especifica como parametro
    y que se encuentre disponible para devolverlo y asi poder reservar esa habitacion
  */
  public async getIdAvailableRoomType(
    roomType: string,
    roomAmount: number,
    check_in: Date,
    check_out: Date
  ): Promise<number[] | any> {
    try {
      const rooms: number[] = [];
      if (roomAmount > 0) {
        const pool = await DbConnection.getInstance().getConnection();
        const result = await pool
          ?.request()
          .input("roomType", roomType)
          .input("roomAmount", roomAmount)
          .input("checkInDate", check_in)
          .input("checkOutDate", check_out).query(`
            SELECT TOP (@roomAmount) r.id AS roomId
            FROM Room r
            WHERE r.room_type = @roomType
            AND NOT EXISTS (
              SELECT 1
              FROM RoomXReservation rxr
              INNER JOIN Reservation res ON rxr.reservation_id = res.id
              WHERE rxr.room_id = r.id
              AND (
                (res.check_in <= @checkInDate AND res.check_out >= @checkInDate) -- Reservation starts before or on check-in date
                OR (res.check_in <= @checkOutDate AND res.check_out >= @checkOutDate) -- Reservation ends on or after check-out date
                OR (res.check_in >= @checkInDate AND res.check_out <= @checkOutDate) -- Reservation overlaps check-in and check-out dates
              )
            );
          `);
        if (result === undefined) {
          console.log("Ocurrió un error al ejecutar la consulta.");
          return undefined;
        }
        if (
          result.recordset.length < roomAmount ||
          result.recordset[0].min_id === null
        ) {
          console.log("No hay habitaciones disponibles del tipo:", roomType);
          return result.recordset.length;
        }
        for (let i = 0; i < roomAmount; i++) {
          rooms.push(result.recordset[i].roomId);
        }
        return rooms;
      }
    } catch (error) {
      console.error("Error al obtener habitaciones disponibles", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }
  public async verifyAvailability(
    rooms: RoomItem[],
    check_in: Date,
    check_out: Date
  ): Promise<number[] | string> {
    let errorMssg = "";
    try {
      const newRoomIds: number[] = [];
      for (const room of rooms) {
        const roomIds = await this.getIdAvailableRoomType(
          room.roomType,
          room.quantity,
          check_in,
          check_out
        );

        if (roomIds <= room.quantity) {
          errorMssg =
            errorMssg +
            `Hay ${roomIds}  habitaciones disponibles del tipo ${room.roomType}\n`;
        } else {
          for (let i = 0; i < room.quantity; i++) {
            newRoomIds.push(roomIds[i]);
          }
        }
      }
      if (errorMssg != "") {
        return errorMssg;
      }
      return newRoomIds;
    } catch (error) {
      errorMssg = "Error al verificar las habitaciones disponibles" + error;
      console.error("Error al verificar las habitaciones disponibles", error);
      return errorMssg; // Manejo de errores: devuelve el mensaje de error
    }
  }
  public async setAvailability(roomId: number) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("roomId", roomId)
        .query("UPDATE Room SET is_available = 0 WHERE id = @roomId");

      if (!result || !result.recordset) {
        return undefined;
      }

      return result.recordset;
    } catch (error) {
      console.error(
        "Error al cambiar la disponibilidad de la habitacion",
        error
      );
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }
  /*
    FORMA ALTERNATIVA DE HACER EL QUERY
        const query = `
      UPDATE Rooms 
      SET is_available = 'reserved' 
      WHERE room_id IN (${roomIds.map(() => '?').join(',')})
    `;
    
    const request = pool?.request();
    roomIds.forEach(roomId => request.input("roomId", roomId));

    const result = await request.query(query);
  */
  public async addRoomToReservation(roomId: number, reservationId: number) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("roomId", roomId)
        .input("reservationId", reservationId)
        .query(`INSERT INTO RoomXReservation (room_id, reservation_id) 
            VALUES (@roomId, @reservationId)`);

      if (!result || !result.recordset) {
        return undefined;
      }

      return result.recordset;
    } catch (error) {
      console.error("Error al agregar habitacion a la reserva", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async getRoomAmounts(json: JSON): Promise<RoomItem[]> {
    const roomArray: RoomItem[] = [];
    for (const [key, value] of Object.entries(json)) {
      roomArray.push({ roomType: key, quantity: value });
    }

    return roomArray;
  }

  public async linkRoomToReservation(
    rooms: number[],
    reservationId: number
  ): Promise<any | undefined> {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      for (const roomId of rooms) {
        const result = await pool
          ?.request()
          .input("roomId", roomId)
          .input("reservationId", reservationId).query(`
                INSERT INTO RoomXReservation (room_id, reservation_id)
                VALUES (@roomId, @reservationId);
            `);
        if (!result) {
          return undefined;
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

  public async switchDBRoomsToFE(rooms: string[]): Promise<string[]> {
    const roomTypes: string[] = [];
    rooms.forEach((room) => {
      switch (room) {
        case "vista":
          roomTypes.push("Garden View");
          break;
        case "familiar":
          roomTypes.push("Family Suite");
          break;
        case "suite":
          roomTypes.push("Suite");
          break;
        case "estandar":
          roomTypes.push("Standard");
          break;
        case "bungalow":
          roomTypes.push("Bungalow");
          break;
      }
    });
    return roomTypes;
  }

  public async switchFERoomsToDB(rooms: string[]): Promise<string[]> {
    const roomTypes: string[] = [];
    rooms.forEach((room) => {
      switch (room) {
        case "Garden View":
          roomTypes.push("vista");
          break;
        case "Family Suite":
          roomTypes.push("familiar");
          break;
        case "Suite":
          roomTypes.push("suite");
          break;
        case "Standard":
          roomTypes.push("estandar");
          break;
        case "Bungalow":
          roomTypes.push("bungalow");
          break;
      }
    });
    console.log("roomTypes", roomTypes);
    return roomTypes;
  }

  public async getRoomTypes(rooms: number[]): Promise<string[] | undefined> {
    try {
      const roomTypes: string[] = [];
      const pool = await DbConnection.getInstance().getConnection();

      for (const room of rooms) {
        const result = await pool
          ?.request()
          .input("roomId", room)
          .query("SELECT room_type FROM Room WHERE id=@roomId");

        if (result && result.recordset) {
          roomTypes.push(result.recordset[0].room_type);
        }
      }
      return roomTypes;
    } catch (error) {
      console.error("Error al obtener habitaciones:", error);
      return undefined; // Error handling: return undefined in case of error
    } finally {
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async getRoomsByReservationId(
    reservationId: number
  ): Promise<RoomDB[] | undefined> {
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

      return result.recordset;
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

  // returns the rooms in "RoomItems"
  public async getAddedRooms(
    oldRooms: string[],
    newRooms: string[]
  ): Promise<RoomItem[]> {
    console.log("newRooms", newRooms);
    console.log("oldRooms", oldRooms);

    // Create a map to count occurrences of each room in oldRooms
    const oldRoomCountMap = new Map<string, number>();
    oldRooms.forEach((room) => {
      oldRoomCountMap.set(room, (oldRoomCountMap.get(room) || 0) + 1);
    });

    // Create a map to count occurrences of each room in newRooms
    const newRoomCountMap = new Map<string, number>();
    newRooms.forEach((room) => {
      newRoomCountMap.set(room, (newRoomCountMap.get(room) || 0) + 1);
    });

    // Determine the added rooms
    const addedRooms: string[] = [];
    newRoomCountMap.forEach((count, room) => {
      const oldCount = oldRoomCountMap.get(room) || 0;
      if (count > oldCount) {
        for (let i = 0; i < count - oldCount; i++) {
          addedRooms.push(room);
        }
      }
    });

    console.log("addedRooms", addedRooms);

    const dbAddedRooms = await this.switchFERoomsToDB(addedRooms);
    const roomItems = await this.generateRoomItems(dbAddedRooms);
    return roomItems;
  }

  public async getRoomsDifference(
    oldRooms: string[],
    newRooms: string[]
  ): Promise<string[]> {
    const changedRooms: string[] = [];
    for (let i = 0; i < oldRooms.length; i++) {
      if (oldRooms[i] !== newRooms[i]) {
        changedRooms.push(oldRooms[i]);
      }
    }
    return changedRooms;
  }

  public async getRoomNumberByReservationIdAndRoomType(
    reservationId: number,
    roomType: string
  ): Promise<number> {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("reservationId", reservationId)
        .input("roomType", roomType).query(`
          SELECT TOP(1) room_id
          FROM Room
          JOIN RoomXReservation ON Room.id = RoomXReservation.room_id
          WHERE RoomXReservation.reservation_id = @reservationId
          AND Room.room_type = @roomType;
        `);

      if (!result || !result.recordset || result.recordset.length === 0) {
        return -1;
      }

      return result.recordset[0].room_number;
    } catch (error) {
      console.error(
        "Error getting room number by reservation ID and room type:",
        error
      );
      return -1;
    } finally {
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async getAmountAvailableRooms() {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .query(
          "SELECT room.room_type, COUNT(room.id) AS available_rooms FROM Room room LEFT JOIN RoomXReservation rxr ON room.id = rxr.room_id LEFT JOIN Reservation res ON rxr.reservation_id = res.id AND res.reservation_status = 'Active' WHERE res.id IS NULL GROUP BY room.room_type;"
        );
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      return result.recordset;
    } catch (error) {
      console.error(
        "Error al obtener la cantidad de habitaciones disponibles",
        error
      );
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }
}
