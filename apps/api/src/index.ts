import express from "express";
import * as functions from "firebase-functions";
import admin from "firebase-admin";
admin.initializeApp();

const app = express();
const router = express.Router();
const db = admin.database();

const auth = admin.auth();
app.use(express.json());

// TODO: make auth work
const authenticate = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    res.status(403).send("Unauthorized");
    return;
  }
  const idToken = req.headers.authorization.split("Bearer ")[1];
  try {
    const decodedIdToken = await auth.verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (e) {
    res.status(403).send("Unauthorized");
    return;
  }
};

app.use(authenticate);
router.get("/", async (req, res) => {
  res.send("TODO make api");
});

router.get("/user", async (req, res) => {
  res.send("test");
});

router.post("/webhook", async (req, res) => {
  const body = req.body;
  const fullName = body.repository.full_name;
  const id = body.sender.id;

  const [user, repo] = fullName.split("/");
  db.ref(`${id}`).push({
    user,
    repo,
    id: body.workflow_run.id,
    status: body.action,
  });

  res.send("Build added to collection");
});

app.use("/v1", router);

exports.api = functions.https.onRequest(app);
