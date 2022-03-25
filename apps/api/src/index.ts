import express from "express";
import * as functions from "firebase-functions";
import admin from "firebase-admin";
import crypto from "crypto";

admin.initializeApp();

const app = express();
const router = express.Router();
const db = admin.database();
const config = functions.config();

const auth = admin.auth();
app.use(express.json());

// auth middleware to decode the JWT and validte it
const authenticate = async (req, res, next) => {
  const secret = config.app.github;
  const secureHeader = req.headers["X-Hub-Signature-256"];

  if (secureHeader === crypto.createHmac("sha256", secret)) {
    console.log("came from github no need to auth them");
    return next();
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
  const fullName = body.repository.full_name;
  const [user, repo] = fullName.split("/");

  if (body.action === "deleted") {
    db.ref(`repos/${user}/${repo}`).set(null);
  }
  
  if (body.action === "created") {
    db.ref(`repos/${user}/${repo}`).set({
      installed: true,
    });
  }

  if (body.action === "requested" || body.action === "completed") {
    db.ref(`repos/${user}/${repo}/builds`).push(body);
  }

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
