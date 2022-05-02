import express from "express";
import { db } from "../firebase";

const router = express.Router();

/**
 * Unsubscribes the user to a repo
 */
router.delete("/repo/subscribe", async (req: any, res) => {
  const body = req.body;
  console.log(body);
  const id = req.id;
  const { entity, repo } = body;
  const path = `users/${id}/repos/${entity.toLowerCase()}/${repo.toLowerCase()}`.replaceAll(".", "/").toLowerCase();

  const doc = await db.ref(`repos/${entity}/${repo}`).once("value");
  console.log(`Checking repos/${entity}/${repo} for a valid app insatll`);
  if (!doc.exists()) {
    return res.status(500).send({ error: `${entity}/${repo} does not have the app installed` });
  }

  db.ref(path).set(null);

  res.send({ message: `Unsubbed from ${path}` });
});

/**
 * Subscribes the user to a repo
 */
router.post("/repo/subscribe", async (req: any, res) => {
  const body = req.body;
  const id = req.id;
  const { entity, repo } = body;
  const path = `users/${id}/repos/${entity.toLowerCase()}/${repo.toLowerCase()}`.replaceAll(".", "/").toLowerCase();

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

/**
 * All the repos the current user has subscribed to
 */
router.get("/repos/subscribed", async (req: any, res) => {
  const id = req.id;
  const path = `users/${id}/repos`;

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

/**
 * all the public repos that user can see or has access to
 */
router.get("/repos/all", async (req: any, res) => {
  const path = `users/${req.session.githubUser.id}`;
  const doc = await db.ref(path).once("value");
  const items = doc.val();

  const repos: any[] = [];
  for (const [entity, item] of Object.entries(items)) {
    for (const repo of Object.keys(item as any)) {
      repos.push({ fullName: `${entity}/${repo}` });
    }
  }

  res.json(repos);
});

export default router;
