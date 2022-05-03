import express from "express";

const router = express.Router();
import { addBuildEntry, createOrUpdateRepoEntry, removeRepoEntry } from "../api";

// https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#webhook-payload-object-40
router.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.action === "removed") {
    removeRepoEntry(body.repositories_removed);
  }

  if (body.action === "added") {
    createOrUpdateRepoEntry(body.repositories_added);
  }

  if (body.action === "created") {
    createOrUpdateRepoEntry(body.repositories);
  }

  if (body.action === "deleted") {
    removeRepoEntry(body.repositories);
  }

  if (body.action === "requested" || body.action === "completed") {
    addBuildEntry(body);
  }

  res.send("Webook invoked successfully!");
});

export default router;
