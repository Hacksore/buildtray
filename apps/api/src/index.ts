import express, { Request } from "express";
import * as functions from "firebase-functions";
import crypto from "crypto";
import { createRepoEntry } from "./repo";

import { db, config } from "./firebase";
import admin from "firebase-admin";

const app = express();
const router = express.Router();


const auth = admin.auth();
app.use(express.json());

// TODO: mvoe someoneofnseijgoiesjgoishj
declare module "express" {
  interface Request {
    user: any;
    id: any;
  }
}

// auth middleware to decode the JWT and validte it
const authenticate = async (req: Request, res, next) => {
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

// if (process.env.NODE_ENV === "production") {
app.use(authenticate);
// }

router.post("/create", async (req: any, res) => {
  const body = req.body;
  const id = req.id;
  const { entity, repo } = body;
  const path = `user.${id}.repos.${entity}/${repo}`.replaceAll(".", "/");

  db.ref(path).set({
    notifications: true,
  });

  res.send(`Enabled notifications to ${path}`);
});

router.get("/", async (req, res) => {
  res.send("TODO make api");
});

router.get("/user", async (req: any, res) => {
  res.json(req.user);
});

router.post("/webhook", async (req, res) => {
  const body = req.body;
  // const fullName = body.repository.full_name;
  // const [user, repo] = fullName.split("/");

  // if (body.action === "deleted") {
  //   db.ref(`repos/${user}/${repo}`).set(null);
  // }

  if (body.action === "added") {
    createRepoEntry(body.repositories_added);
  }

  if (body.action === "created") {
    createRepoEntry(body.repositories);
  }

  // if (body.action === "requested" || body.action === "completed") {
  //   db.ref(`repos/${user}/${repo}/builds`).push(body);
  // }

  // db.ref(`${id}`).push({
  //   user,
  //   repo,
  //   id: body.workflow_run.id,
  //   status: body.action,
  // });

  res.send("Webook involed successfully!");
});

app.use("/v1", router);

exports.api = functions.https.onRequest(app);
