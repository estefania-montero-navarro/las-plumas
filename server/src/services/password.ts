import bcrypt from "bcryptjs";

import { DbConnection } from "./dbConnection";
import { Password } from "../types/Password";

export class PasswordService {
  public async getPasswordByUUID(uuid: string): Promise<Password | undefined> {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("uuid", uuid)
        .query("SELECT passwords FROM Passwords WHERE uuid=@uuid;");
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      console.log("Recodrset" + result.recordset);
      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener usuario por uuid:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async savePasswords(password: string, email: string) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("email", email)
        .input("password", password)
        .query(
          "INSERT INTO Passwords (email, passwords) VALUES (@email, @passwords);"
        );
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async updatePasswords(password: string, uuid: string) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("uuid", uuid)
        .input("password", password)
        .query(
          "UPDATE Passwords SET passwords = @password WHERE uuid = @uuid;"
        );

      // Verifica si result o result.recordset son undefined
      if (!result || !result.rowsAffected || result.rowsAffected[0] === 0) {
        console.log("Error al cambiar contraseña del usuario");
        return undefined;
      }

      return 1;

    } catch (error) {

      console.error("Error al cambiar contrasenna del usuario", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async hashPassword(plainTextPassword: string): Promise<string> {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);

      // Hash the password with the salt
      const hashedPassword = await bcrypt.hash(plainTextPassword, salt);

      return hashedPassword;
    } catch (error) {
      // Handle error
      console.error("Error hashing password:", error);
      throw error; // Rethrow the error
    }
  }
}
