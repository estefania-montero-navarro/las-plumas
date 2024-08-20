import { error } from "console";
import { Request, Response } from "express";
import { PaymentService } from "../services/payment";

export class PaymentController {
  public async getPaymentConfig(req: Request, res: Response) {
    try {
      const paymentConfigInfo = {
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      };
      res.status(200).json({
        status: 200,
        message: "Configuración de pago",
        data: paymentConfigInfo,
      });
    } catch (error) {
      console.error("Error al obtener configuración de pago:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }

  public async newPaymentIntent(req: Request, res: Response) {
    try {
      const totalPrice = req.body.totalPrice * 100;
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalPrice,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      // Send publishable key and PaymentIntent details to client
      res.status(200).json({
        status: 200,
        message: "Payment intent created",
        data: {
          clientSecret: paymentIntent.client_secret,
        },
      });
    } catch (error) {
      console.error("Error al crear intento de pago:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }

  public async generateReceipt(req: Request, res: Response) {
    try {
      const uuid = req.body.uuid;
      const receiptAmount = req.body.receiptAmount;
      const reservationId = req.body.reservationId;
      const paymentService = new PaymentService();
      const receiptCreated = paymentService.createReceipt(
        uuid,
        receiptAmount,
        reservationId
      );
      if (!receiptCreated) {
        throw error;
      }
      res.status(201).json({
        status: 201,
        message: "Receipt created successfully",
      });
    } catch (error) {
      console.error("Error al generar recibo de pago:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
}
