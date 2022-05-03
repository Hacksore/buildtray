import express from "express";
import { encodeRepo, safeName } from "shared/utils/naming";
import { db } from "../firebase";

const router = express.Router();

/**
 * Unsubscribes the user to a repo
 */
router.delete("/repo/subscribe", async (req: any, res) => {
  const body = req.body;
  const { entity, repo } = body;
  
  const fullName = encodeRepo(`${entity}/${repo}`);

  const doc = await db.ref(`repos/${fullName}`).once("value");
  console.log(`Checking repos/${fullName} for a valid app install`);
  if (!doc.exists()) {
    return res.status(500).send({ error: `${fullName} does not have the app installed` });
  }

  const id = req.session.github.user.id;
  const path = `users/${id}/subscriptions/${fullName}`;
  db.ref(path).set(null);

  res.send({ message: `Unsubbed from ${path}` });
});

/**
 * Subscribes the user to a repo
 */
router.post("/repo/subscribe", async (req: any, res) => {
  const body = req.body;
  const id = req.session.github.user.id;
  const { entity, repo } = body;
  const fullName = encodeRepo(`${entity}/${repo}`);
  const doc = await db.ref(`repos/${fullName}`).once("value");

  console.log(`Checking repos/${fullName} for a valid app install`);
  if (!doc.exists()) {
    return res.status(500).send({ error: `${fullName} does not have the app installed` });
  }

  db.ref(`users/${id}/subscriptions/${fullName}`).set(true);

  res.send({ message: `Enabled notifications to ${fullName}` });
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
  const userId = req.session.github.user.id;
  const doc = await db.ref(`users/${userId}/repos`).once("value");
  const items = doc.val();

  const repos: any[] = [];
  for (const [entity, item] of Object.entries(items)) {
    for (const repo of Object.keys(item as any)) {
      const fullName = `${safeName(entity)}/${safeName(repo)}`;
      const subRef = await db.ref(`users/${userId}/subscriptions/${fullName}`).once("value");
      repos.push({ 
        fullName: `${entity}/${repo}`,
        isSubscribed: subRef.exists(),
       });
    }
  }

  res.json(repos);
});

export default router;
