import { UserDB } from "../types/User";
import { DbConnection } from "./dbConnection";
import jwt from "jsonwebtoken";
import { ConfirmationEmailService } from "./confirmationEmail";


export class UserService {
  
  private emailService: ConfirmationEmailService;

  constructor() {
    this.emailService = new ConfirmationEmailService();
  } 

  public async getUsers() {
    try {
      // Send confirmation email
     
      
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool?.request().query("SELECT * FROM _User;");
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

  public async getUserEmail(email: string): Promise<UserDB | undefined> {
    try {

      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("email", email)
        .query(
          'SELECT uuid, email, user_role AS "role", user_name AS "name", last_name AS "lastName" FROM dbo._User WHERE email = @email;'
        );
      // Verifica si result o result.recordset son undefined

      if (!result || !result.recordset) {
        console.error("No se encontraron usuarios");
        return undefined;
      }
      // Devuelve el primer usuario encontrado
      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async getUserById(uuid: string): Promise<UserDB | undefined> {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("uuid", uuid)
        .query(
          'SELECT uuid, email, user_role AS "role", user_name AS "name", last_name AS "lastName" FROM dbo._User WHERE uuid = @uuid;'
        );
      // Verifica si result o result.recordset son undefined

      if (!result || !result.recordset) {
        console.log("No se encontraron usuarios");
        return undefined;
      }
      // Devuelve el primer usuario encontrado
      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async createUser(user: UserDB): Promise<void | number> {
    try {
      const existingUser = await this.getUserEmail(user.email);
      if (existingUser) {
        console.log("El correo electrónico ya está en uso");
        return 409; // Código de estado 409: conflicto
      }
      console.log("bday:" + user.bDate);

      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("uuid", user.uuid)
        .input("name", user.name)
        .input("lastName", user.lastName)
        .input("email", user.email)
        .input("phone", user.phone)
        .input("bdate", user.bDate)
        .input("status", user.status)
        .input("role", user.role)
        .input("pass", user.pass).query(`
          INSERT INTO _User (uuid, User_name, last_name, email, phone, b_date, User_status, User_role)
          VALUES (@uuid, @name, @lastName, @email, @phone, @bdate, @status, @role);

          INSERT INTO Passwords (uuid, passwords)
          VALUES (@uuid, @pass);
        `);

      if (!result) {
        throw new Error(
          "No se recibió respuesta del servidor al intentar crear el usuario."
        );
      }

      // Verificar si result.rowsAffected es mayor que cero para confirmar que se ha insertado el usuario
      if (result.rowsAffected && result.rowsAffected[0] > 0) {
        console.log("Usuario creado exitosamente.");
      } else {
        throw new Error("No se pudo crear el usuario.");
      }
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      throw error;
    } finally {
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async UpdateUserByEmail(email: string, user: UserDB) {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("name", user.name)
        .input("lastName", user.lastName)
        .input("email", user.email)
        .input("phone", user.phone)
        .input("bdate", user.bDate)
        .input("status", user.status)
        .input("role", user.role)
        .query(
          "UPDATE _User SET user_name = @name, last_name = @lastName, email = @email, phone = @phone, b_date = @bdate, user_status = @status, user_role = @role WHERE email = @email;"
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

  // USER EMAIL MUST BE VALID
  public async getUserIdByEmail(email: string): Promise<string | undefined> {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("email", email)
        .query("SELECT uuid FROM _User WHERE email = @email;");
      // Verifica si result o result.recordset son undefined
      if (!result || !result.recordset) {
        return undefined;
      }
      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async getSessionStatus(token: string): Promise<UserDB | undefined> {
    const secretKey = "PIIngebases2024";
    jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        return undefined;
      }
    });

    const tokenData = jwt.decode(token);
    const tokenDataString = JSON.stringify(tokenData);
    const tokenDataJSON = JSON.parse(tokenDataString);
    const user = tokenDataJSON.user;
    const userData: UserDB | undefined = await this.getUserById(user);

    console.log("UD:", userData);
    return userData;
  }

  public async updateUserStatus(uuid: string): Promise<boolean> {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("uuid", uuid)
        .query("UPDATE _User SET User_status = '0' WHERE uuid = @uuid;");

      // Check if rows were affected
      if (result?.rowsAffected && result?.rowsAffected[0] > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error al actualizar el estado del usuario:", error);
      throw error;
    } finally {
      await DbConnection.getInstance().closeConnection();
    }
  }
}
