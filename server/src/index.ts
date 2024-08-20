import express, { urlencoded } from "express";

import { prefix as UserPrefix, router as UserRouter } from "./routes/user";
import { prefix as RoomPrefix, router as RoomRouter } from "./routes/room";
import {
  prefix as ReservationPrefix,
  router as ReservationRouter,
} from "./routes/reservation";
import {
  prefix as PaymentPrefix,
  router as PaymentRouter,
} from "./routes/payment";
import {
  prefix as PasswordPrefix,
  router as PasswordRouter,
} from "./routes/password";
import { verifyToken } from "./middlewares/authenticacion";
import { preventSQLInjection } from "./middlewares/sqlInjectionPreventer";

import dotenv from "dotenv";

dotenv.config();

const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
const port = 3000;

app.use(verifyToken);

app.use(express.json({ limit: "100mb" }));
app.use(urlencoded({ extended: true }));
app.use(preventSQLInjection);

app.use(`${UserPrefix}`, UserRouter);
app.use(`${RoomPrefix}`, RoomRouter);
app.use(`${ReservationPrefix}`, ReservationRouter);
app.use(`${PaymentPrefix}`, PaymentRouter);
app.use(`${PasswordPrefix}`, PasswordRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
