import express from "express";
import * as functions from "firebase-functions";
import { authenticate } from "./middleware/auth";

import webhookRoute from "./routes/webhook";
import loginRoute from "./routes/login";
import userRoute from "./routes/repo";

const app = express();
const router = express.Router();
declare module "express" {
  interface Request {
    user: any;
    id: any;
  }
}

app.use(express.json());
app.use(authenticate);

router.use(userRoute);
router.use(webhookRoute);
router.use(loginRoute);

app.use("/v1", router);

export const api = functions.https.onRequest(app);
