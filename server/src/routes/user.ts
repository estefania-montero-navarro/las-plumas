import { UserController } from "../controllers/user";
import express from "express";

export const router = express.Router();

export const prefix = "/api/v1";

const userController = new UserController();

router.get("/user/:email", userController.getUserByEmail);
router.get("/users", userController.getUsers);
router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/session_status", userController.sessionStatus);
router.put("/user/:uuid/status", userController.updateUserStatus);
