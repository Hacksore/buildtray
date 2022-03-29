import express from "express";

const router = express.Router();
import { addBuildEntry, createRepoEntry, removeRepoEntry } from "../api";

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

export default router;
