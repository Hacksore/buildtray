import express from "express";
import * as functions from "firebase-functions";
import admin from "firebase-admin";
admin.initializeApp();

const app = express();
const router = express.Router();
const firestore = admin.firestore();

app.use(express.json());

router.get("/", async (req, res) => {
  res.send("TODO make api");
});

router.get("/test", async (req, res) => {
  res.send("test");
});

router.post("/webhook", async (req, res) => {
  const body = req.body;
  const builds = firestore.collection("builds");

  const [user, repo] = body.repository.full_name.split("/");
  builds.add({
    user,
    repo,
    id: body.workflow_run.id,
    status: body.action
  })

  res.send("Build added to collection");
});

app.use("/v1", router);

exports.api = functions.https.onRequest(app);
