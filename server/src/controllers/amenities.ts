import { Request, Response } from "express";
import { AmenityService } from "../services/amenities";
import { AmenityDB } from "../types/Amenity";

export class RoomController {
  private AmenityServices = new AmenityService();

  public async reserveRooms(
    
  ) {
    try {

    } catch (error) {
      console.error("Error al reservar habitacion", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    }
  }


}
