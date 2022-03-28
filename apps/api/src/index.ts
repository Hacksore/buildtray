import express, { Request } from "express";
import * as functions from "firebase-functions";
import crypto from "crypto";
import { addBuildEntry, createRepoEntry, getUsersRepos, removeRepoEntry } from "./repo";

import { db, config } from "./firebase.js";
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
  const path = `user.${id}.repos.${entity.toLowerCase()}/${repo.toLowerCase()}`.replaceAll(".", "/").toLowerCase();

  const doc = await db.ref(`repos/${entity}/${repo}`).once("value");
  console.log(`Checking repos/${entity}/${repo} for a valid app insatll`);
  if (!doc.exists()) {
    return res.status(500).send({ error: `${entity}/${repo} does not have the app installed` });
  }

  db.ref(path).set({
    notifications: true,
  });

  res.send({ message: `Enabled notifications to ${path}` });
});

router.get("/repos", async (req: any, res) => {
  const id = req.id;
  const path = `user/${id}/repos`;

  const doc = await db.ref(path).once("value");

  if (!doc.exists()) {
    return res.status(200).json([]);
  }

  const repos: any[] = [];
  for (const [k, v] of Object.entries(doc.val())) {
    for (const repo of Object.keys(v as any)) {
      repos.push({
        repo,
        entity: k,
        fullName: `${k}/${repo}`,
      });
    }
  }

  return res.json(repos);
});

// TODO: paginate?
router.get("/installed/repos", async (req: any, res) => {
  const doc = await db.ref("repos").limitToLast(10).once("value");

  if (!doc.exists()) {
    return res.status(200).json([]);
  }

  return res.json(doc.val());
});

router.get("/repos/user", async (req: any, res) => {
  const token = req.headers["x-github-auth"];
  return res.json(await getUsersRepos(token));
});

router.get("/user", async (req: any, res) => {
  res.json(req.user);
});

router.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.action === "removed") {
    removeRepoEntry(body.repositories_removed);
  }

  if (body.action === "added") {
    createRepoEntry(body.repositories_added);
  }

  if (body.action === "created") {
    createRepoEntry(body.repositories);
  }

  if (body.action === "deleted") {
    removeRepoEntry(body.repositories);
  }

  if (body.action === "requested" || body.action === "completed") {
    addBuildEntry(body);
  }

  res.send("Webook invoked successfully!");
});

app.use("/v1", router);

export const api = functions.https.onRequest(app);
