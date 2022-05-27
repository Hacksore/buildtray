import express from "express";
import { encodeRepo, isValidRepo, safeName } from "shared/utils/naming";
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

  // udpate the user subscriptions
  await db.ref(`users/${id}/subscriptions/${fullName}`).set(null);
  // update the repo data as well
  await db.ref(`users/${id}/repos/${fullName}/subscribed`).set(false);

  res.send({ message: `Unsubscribed from notifications on ${fullName}` });
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

  await db.ref(`users/${id}/subscriptions/${fullName}`).set(true);
  await db.ref(`users/${id}/repos/${fullName}/subscribed`).set(true);

  console.log("sub to repo");

  res.send({ message: `Subscribed to notifications on ${fullName}` });
});

/**
 * All the repos the current user has subscribed to
 */
router.get("/repos/subscribed", async (req: any, res) => {
  const id = req.session.github.user.id;
  const path = `users/${id}/subscriptions`;
  const doc = await db.ref(path).once("value");

  if (!doc.exists()) {
    return res.status(200).json([]);
  }

  const repos: any[] = [];
  for (const [owner, v] of Object.entries(doc.val())) {
    for (const [repo] of Object.entries(v)) {
      repos.push({ fullName: `${owner}/${repo}` });
    }
  }

  return res.json(repos);
});

/**
 * all the public repos that user can see or has access to
 */
router.get("/repos/all", async (req: any, res) => {
  const userId = req.session.github.user.id;

  const allUserRepos = (await db.ref(`users/${userId}/repos`).once("value")).val();
  const allInstallRepos = (await db.ref(`repos`).once("value")).val();

  const repos: any[] = [];
  for (const [entity, item] of Object.entries(allUserRepos)) {
    for (const repo of Object.keys(item as any)) {
      const safeEntity = safeName(entity);
      const safeRepo = safeName(repo);
      const fullName = `${safeEntity}/${safeRepo}`;
      const subscribed = item[repo].subscribed;

      repos.push({
        fullName,
        subscribed,
        installed: isValidRepo(allInstallRepos, fullName),
      });
    }
  }

  console.log("get all repos");
  
  res.json(repos);
});

export default router;
