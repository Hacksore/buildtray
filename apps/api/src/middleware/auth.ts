import { Request } from "express";
import crypto from "crypto";

import { config } from "../firebase.js";
import admin from "firebase-admin";

const auth = admin.auth();

// auth middleware to decode the JWT and validte it
export const authenticate = async (req: Request, res, next) => {
  const secret = config.app.github;

  const secureHeader = req.headers["x-hub-signature-256"];

  if (secureHeader) {    
    const sha256Hasher = crypto.createHmac("sha256", secret);
    const secretSha = "sha256=" + sha256Hasher.update(JSON.stringify(req.body)).digest("hex");

    if (secureHeader === secretSha) {
      console.log("came from github no need to auth them");
      return next();
    }
  }

  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    res.status(401).send("Unauthorized");
    return;
  }

  const idToken = req.headers.authorization.split("Bearer ")[1];
  try {
    const decodedIdToken = await auth.verifyIdToken(idToken);

    req.user = decodedIdToken;
    req.id = decodedIdToken.firebase.identities["github.com"][0];

    return next();
  } catch (e) {
    console.log(e);
    res.status(401).send("Unauthorized");
    return;
  }
};
