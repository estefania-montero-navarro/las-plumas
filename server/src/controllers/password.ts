import { Request, Response } from "express";
import { UserService } from "../services/user";
import { PasswordService } from "../services/password";
import { ConfirmationEmailService } from "../services/confirmationEmail";
import { UserDB } from "../types/User";
import { Password } from "../types/Password";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export class PasswordController {
  private userService: UserService;
  private passwordService: PasswordService;

  constructor(
    userService?: UserService,
    passwordService?: PasswordService,
    confirmationEmailService?: ConfirmationEmailService
  ) {
    this.userService = userService || new UserService();
    this.passwordService = passwordService || new PasswordService();
  }

  public async rememberPassword(req: Request, res: Response) {
    // Logic to send old password to user (unhashed)
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(406).json({
          status: 406,
          message: "Missing parameters",
        });
      }

      const userService = new UserService();
      const user: UserDB | undefined = await userService.getUserEmail(email);

      if (typeof user === "undefined") {
        return res.status(406).json({
          status: 406,
          message: "User not found",
        });
      }

      // Random strong temporary password for user
      const newPassword = uuidv4().slice(0, 8);
      const passwordService = new PasswordService();
      const hashedPassword = await passwordService.hashPassword(newPassword);

      console.log(
        "New Password = ",
        newPassword,
        " Hashed Password = ",
        hashedPassword,
        " EMAIL = ",
        email,
        " UUID = ",
        user.uuid
      );

      const updated = await passwordService.updatePasswords(
        hashedPassword,
        user.uuid
      );

      if (!updated) {
        return res.status(406).json({
          status: 406,
          message: "Error updating password",
        });
      }

      const confirmationEmailService = new ConfirmationEmailService();
      const subject = "New password";
      const body = `Your new password is ${newPassword} please change it as soon as possible.`;
      const emailSent = await confirmationEmailService.sendConfirmationEmail(
        email,
        subject,
        body
      );

      if (!emailSent) {
        return res.status(406).json({
          status: 406,
          message: "Error sending email",
        });
      }

      return res.status(202).json({
        status: 202,
        message: "Email sent successfully",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }

  public async verifyOldPassword(req: Request, res: Response) {
    try {
      const { email, oldPassword } = req.body;
      console.log("Old password", oldPassword, "Email", email);

      if (!email || !oldPassword) {
        return res.status(406).json({
          status: 406,
          message: "Missing parameters",
        });
      }

      const userService = new UserService();
      const user = await userService.getUserEmail(email);

      if (!user) {
        return res.status(406).json({
          status: 406,
          message: "User not found",
        });
      }

      const passwordService = new PasswordService();
      const password = await passwordService.getPasswordByUUID(user.uuid);

      if (!password) {
        return res.status(406).json({
          status: 406,
          message: "Password not found",
        });
      }

      //Compare old password with hashed password
      const validPassword = await bcrypt.compare(
        oldPassword,
        password.passwords
      );

      if (!validPassword) {
        return res.status(406).json({
          status: 406,
          message: "Invalid old password",
        });
      }

      return res.status(202).json({
        status: 202,
        message: "Password validated successfully",
      });
    } catch (error) {
      console.error("Error verifying old password:", error);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }

  public async updatePassword(req: Request, res: Response) {
    try {
      const { email, newPassword } = req.body;

      if (!email || !newPassword) {
        return res.status(406).json({
          status: 406,
          message: "Missing parameters",
        });
      }

      const passwordService = new PasswordService();
      const hashedPassword = await passwordService.hashPassword(newPassword);

      if (!hashedPassword) {
        return res.status(406).json({
          status: 406,
          message: "Error hashing password",
        });
      }

      const userService = new UserService();
      const user = await userService.getUserEmail(email);

      if (!user) {
        return res.status(406).json({
          status: 406,
          message: "User not found",
        });
      }

      console.log(
        "Password Hashed: ",
        hashedPassword,
        "Password: ",
        newPassword,
        "User: ",
        user.uuid
      );

      const updated = await passwordService.updatePasswords(
        hashedPassword,
        user.uuid
      );

      if (!updated) {
        return res.status(406).json({
          status: 406,
          message: "Error updating password",
        });
      }

      return res.status(202).json({
        status: 202,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
}

export default PasswordController;
