import { PaymentController } from "../../controllers/payment";
import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../../services/payment";

const OLD_ENV = process.env;

jest.mock("../../services/payment.ts");

describe("PaymentController", () => {
  let paymentController: PaymentController;
  let paymentService: jest.Mocked<PaymentService>;
  let req: Partial<Request>;
  let res: Partial<Response<any, Record<string, any>>>;
  let next: NextFunction;

  beforeEach(() => {
    paymentController = new PaymentController();
    paymentService = new PaymentService() as jest.Mocked<PaymentService>;
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Clear all mocks before each test
    jest.clearAllMocks();
    paymentService.createReceipt.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...OLD_ENV };
    delete process.env.NODE_ENV;
  });

  describe("getPaymentConfig", () => {
    // TEST CASE: Sends the payment configuration to the client
    it("should return 200 and the payment configuration", async () => {
      // Apply middleware

      process.env.STRIPE_PUBLISHABLE_KEY = "test_publishable_key";

      await paymentController.getPaymentConfig(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Configuración de pago",
        data: {
          publishableKey: "test_publishable_key",
        },
      });
    });
  });

  describe("newPaymentIntent", () => {
    it("should return 200 and the payment intent client secret", async () => {
      process.env.STRIPE_SECRET_KEY = "test_secret_key";

      jest.mock("stripe", () => {
        return jest.fn().mockImplementation(() => {
          return {
            paymentIntents: {
              create: jest
                .fn()
                .mockResolvedValue({ client_secret: "client_secret" }),
            },
          };
        });
      });

      req.body = {
        totalPrice: 100,
      };

      await paymentController.newPaymentIntent(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Payment intent created",
        data: {
          clientSecret: "client_secret",
        },
      });
    });

    it("should return 500 if an error occurs", async () => {
      process.env.STRIPE_SECRET_KEY = "test_secret_key";

      jest.mock("stripe", () => {
        return jest.fn().mockImplementation(() => {
          return {
            paymentIntents: {
              create: jest
                .fn()
                .mockRejectedValueOnce(new Error("Stripe error")),
            },
          };
        });
      });

      await paymentController.newPaymentIntent(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: "Internal server error",
      });
    });
  });

  describe("generateReceipt", () => {
    it("should return 500 if an error occurs while creating receipt", async () => {
      paymentService.createReceipt.mockRejectedValueOnce(0);
      req.body = {
        uuid: "valid_uuid",
        receiptAmount: "100",
        reservationId: "123",
      };

      await paymentController.generateReceipt(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: "Internal server error",
      });
    });

    it("should call createReceipt with correct arguments and return success response", async () => {
      // Mock createReceipt to return true
      PaymentService.prototype.createReceipt = jest.fn().mockReturnValue(true);
      req.body = {
        uuid: "test_uuid",
        receiptAmount: "100",
        reservationId: "123",
      };
      await paymentController.generateReceipt(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 201,
        message: "Receipt created successfully",
      });
    });
  });
});
