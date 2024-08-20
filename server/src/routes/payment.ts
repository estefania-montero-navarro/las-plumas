import express from "express";

import { PaymentController } from "../controllers/payment";

export const router = express.Router();

export const prefix = "/api/v1";

const paymentController = new PaymentController();

router.get("/payment-config", paymentController.getPaymentConfig);
router.post("/new-payment-intent", paymentController.newPaymentIntent);
router.post("/receipt", paymentController.generateReceipt);
