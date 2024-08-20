import { Request, Response } from "express";
import { UserService } from "../services/user";
import { PasswordService } from "../services/password";
import { UserDB } from "../types/User";
import { Password } from "../types/Password";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export class UserController {
  // For the jest test
  private userService: UserService;
  private passwordService: PasswordService;

  constructor(userService?: UserService, passwordService?: PasswordService) {
    this.userService = userService || new UserService();
    this.passwordService = passwordService || new PasswordService();
  }

  public async getUsers(req: Request, res: Response) {
    try {
      const userService = new UserService();
      const users = await userService.getUsers();
      res.send({
        status: 200,
        message: "Usuario obtenido correctamente",
        data: {
          users,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "No se ha encontrado el usuario",
      });
    }
  }

  public async getUserByEmail(req: Request, res: Response) {
    try {
      const email = req.params.email;

      res.send({
        status: 200,
        message: "Usuario obtenido correctamente",
        data: {
          email,
        },
      });
    } catch (error) {
      console.error("No se ha encontrado el usuario:", error);
      res.status(404).json({
        status: 404,
        message: "No se ha encontrado el usuario",
      });
    }
  }

  private login_failed(res: Response) {
    return res.status(401).json({
      status: 401,
      message: "Credenciales inválidas",
    });
  }

  public async login(req: Request, res: Response) {
    try {
      const reqEmail = req.body.email;
      const reqPassword = req.body.password;

      const userService = new UserService();
      const user: UserDB | undefined = await userService.getUserEmail(reqEmail); //+

      if (typeof user === "undefined") {
        return res.status(401).json({
          status: 401,
          message: "Credenciales inválidas",
        });
      }

      const passwordService = new PasswordService();
      const userPassword: Password | undefined =
        await passwordService.getPasswordByUUID(user.uuid);

      if (typeof userPassword === "undefined") {
        return res.status(401).json({
          status: 401,
          message: "Credenciales inválidas",
        });
      }

      if (typeof user === "undefined" || typeof userPassword === "undefined") {
        return res.status(401).json({
          status: 401,
          message: "Credenciales inválidas",
        });
      }

      const passwordMatch = await bcrypt.compare(
        reqPassword,
        userPassword.passwords
      );

      if (!passwordMatch) {
        return res.status(401).json({
          status: 401,
          message: "Credenciales inválidas",
        });
      }

      // Generar token y devolverlo al cliente
      const secretKey = "PIIngebases2024";
      const token_data = { user: user.uuid };
      const token = jwt.sign(token_data, secretKey, {
        expiresIn: "3h",
      });

      const userData = {
        token: token,
        uuid: user.uuid,
        email: user.email,
        role: user.role,
        name: user.name,
      };

      return res.status(200).json({
        status: 200,
        message: "Autenticado con éxito",
        data: userData,
      });
    } catch (error) {
      console.error("Error en la función de login:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }

  public async register(req: Request, res: Response) {
    try {
      const { email, password, name, lastName, role, phone, b_day } = req.body;

      // La validacion si el usuario ya existe se hace en el metodo createUser
      const passwordService = new PasswordService();
      const hashedPassword = await passwordService.hashPassword(password);
      const b_date = new Date(b_day);
      const userService = new UserService();

      const newUser: UserDB = {
        uuid: uuidv4(),
        email: email,
        name: name,
        lastName: lastName,
        phone: phone,
        bDate: b_date,
        status: true,
        role: role,
        pass: hashedPassword,
      };

      const code: void | number = await userService.createUser(newUser);
      if (code === 409) {
        return res.status(409).json({
          status: 409,
          message: "El correo electrónico ya está en uso",
        });
      }

      // Responde al cliente con un código 201 (creado) y un mensaje de éxito
      return res.status(201).json({
        status: 201,
        message: "Usuario creado exitosamente",
      });
    } catch (error) {
      // Si ocurre algún error, responde al cliente con un código 500 (Internal server error)
      console.error("Error al crear usuario:", error);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }

  public async sessionStatus(req: Request, res: Response) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          status: 401,
          message: "Session is not active",
        });
      }
      const userService = new UserService();
      const sessionUserData = await userService.getSessionStatus(token);
      if (typeof sessionUserData === "undefined") {
        return res.status(401).json({
          status: 401,
          message: "Session is not active",
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Session is active",
        data: sessionUserData,
      });
    } catch (error) {
      console.error("Internal server error:", error);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }

  public async updateUserStatus(req: Request, res: Response) {
    try {
      const uuid = req.params.uuid;

      const userService = new UserService();
      const result = await userService.updateUserStatus(uuid);

      // Result for test case
      // const result = await this.userService.updateUserStatus(uuid);

      if (result) {
        res.status(200).json({
          status: 200,
          message: "Usuario actualizado correctamente",
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "Usuario no encontrado",
        });
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }

  public async updateUserStatusJest(req: Request, res: Response) {
    try {
      const uuid = req.params.uuid;

      const result = await this.userService.updateUserStatus(uuid);

      if (result) {
        res.status(200).json({
          status: 200,
          message: "Usuario actualizado correctamente",
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "Usuario no encontrado",
        });
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
}
