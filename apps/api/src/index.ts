import express from "express";
import session from "express-session";
import * as functions from "firebase-functions";
import { authenticate } from "./middleware/auth";

import morgan from "morgan";

import webhookRoute from "./routes/webhook";
import loginRoute from "./routes/login";
import repoRoute from "./routes/repo";
import userRoute from "./routes/user";

import { FirestoreStore } from "@google-cloud/connect-firestore";
import { Firestore } from "@google-cloud/firestore";

const app = express();
const router = express.Router();
declare module "express" {
  interface Request {
    session: ISesssionData;
  }
}

const SESSION_SECRET = "ayylmao";

app.use(morgan("combined"));

app.use(
  session({
    store: new FirestoreStore({
      dataset: new Firestore(),
    }),
    secret: SESSION_SECRET,
    resave: false,
    name: "__session",
    saveUninitialized: false,
  })
);

app.use(express.json());

// login route
app.use("/api/v1", loginRoute);

// protect all the main routes
app.use(authenticate);

router.use(repoRoute);
router.use(webhookRoute);
router.use(userRoute);

app.use("/api/v1", router);

export const server = functions.https.onRequest(app);
