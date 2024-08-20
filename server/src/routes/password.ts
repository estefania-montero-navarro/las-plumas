import { PasswordController } from "../controllers/password";
import express from "express";

export const router = express.Router();

export const prefix = "/api/v1";

const passwordController = new PasswordController();

router.post("/verify", passwordController.verifyOldPassword);
router.post("/update", passwordController.updatePassword);
router.post("/remember", passwordController.rememberPassword);