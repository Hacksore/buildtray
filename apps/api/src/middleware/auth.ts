import { Request } from "express";
import crypto from "crypto";
import { config } from "../firebase.js";
import admin from "firebase-admin";

const auth = admin.auth();
// auth middleware to decode the JWT and validte it
export const authenticate = async (req: Request, res, next) => {
  // this is the config we setup to use to validate the github webhook payload
  const secret = config.github.webhook.secret;
  const secureHeader = req.headers["x-hub-signature-256"];

  if (secureHeader) {
    const sha256Hasher = crypto.createHmac("sha256", secret);
    const secretSha = "sha256=" + sha256Hasher.update(JSON.stringify(req.body)).digest("hex");

    if (secureHeader === secretSha) {
      console.log("This request came from github and was cryptographically verified");
      return next();
    }
  }

  // const jwtToken = req?.session?.firebase?.token;
  const jwtToken = req.get("authorization").split(" ")[1];
  if (!jwtToken) {
    res.status(401).send({ error: "You must supply a bearer token" });
    return;
  }

  try {
    const decodedIdToken = await auth.verifyIdToken(jwtToken);
    const [id] = decodedIdToken.firebase.identities["github.com"];
    req.session.github.token = decodedIdToken.toString();
    req.session.github.user.id = id;

    return next();
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: e.message });
    return;
  }
};
