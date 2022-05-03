import express from "express";
import session from "express-session";
import * as functions from "firebase-functions";
import { authenticate } from "./middleware/auth";

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
    session: {
      github: {
        user: {
          id: string;
          token: string
        }
      }
    }
  } 
}

app.use(
  session({
    store: new FirestoreStore({
      dataset: new Firestore(),
    }),
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

// login route
router.use(loginRoute);

// product all the main routes
// app.use(authenticate); 

router.use(repoRoute);
router.use(webhookRoute);
router.use(userRoute);

app.use("/v1", router);

export const api = functions.https.onRequest(app);
