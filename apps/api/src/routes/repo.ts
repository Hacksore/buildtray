import express from "express";
import { encodeRepo } from "shared/utils/naming";
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
  const id = req.session.github.user.id;
  const { entity, repo } = body;
  const repoPath = encodeRepo(`${entity}/${repo}`);
  const path = `users/${id}/repos/${repoPath}`;
  const doc = await db.ref(`repos/${repoPath}`).once("value");

  console.log(`Checking repos/${repoPath} for a valid app install`);
  if (!doc.exists()) {
    return res.status(500).send({ error: `${repoPath} does not have the app installed` });
  }

  const currentRepos = doc.val();

  db.ref(path).set({
    repos: {
      ...currentRepos.repos,
      repoPath,
    },
    notifications: true,
  });

  res.send({ message: `Enabled notifications to ${repoPath}` });
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
  for (const [id] of Object.entries(items)) {
    const metadata = await db.ref(`repos/${id}/metadata`).once("value");
    const isSubscribed = await db.ref(`users/${userId}/subscriptions/${id}`).once("value");
    repos.push({
      ...metadata.val(),
      id,
      isSubscribed: isSubscribed.exists(),
    });
  }

  res.json(repos);
});

export default router;
