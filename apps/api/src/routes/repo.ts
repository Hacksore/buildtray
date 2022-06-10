import express from "express";
import IRepo from "shared/types/IRepo";
import { encodeRepo } from "shared/utils/naming";
import { setUserMetadata } from "../api";
import { db, firestore } from "../firebase";
import { User, userRepository } from "../models/user";
import { getDocRef } from "../util/firebase";

const router = express.Router();

/**
 * Unsubscribes the user to a repo
 * We will check that the repo has the app installed into the Repos/<fullName>
 * The nwe can remove it from Users/<id>/subscriptions/<fullName>
 */
router.delete("/repo/subscribe", async (req: any, res) => {
  const body = req.body;
  const { entity, repo } = body;

  const id = req.session.github.user.id;
  const fullName = encodeRepo(`${entity}/${repo}`);

  const collection = firestore.collection("Users").doc(`${id}`);
  const colloectionRef = await collection.set();

  // const doc = await db.ref(`repos/${fullName}`).once("value");
  // const doc = await db.ref(`repos/${fullName}`).once("value");
  // console.log(`Checking repos/${fullName} for a valid app install`);
  // if (!doc.exists()) {
  //   return res.status(500).send({ error: `${fullName} does not have the app installed` });
  // }

  // // udpate the user subscriptions
  // await db.ref(`users/${id}/subscriptions/${fullName}`).set(null);
  // // update the repo data as well
  // await db.ref(`users/${id}/repos/${fullName}/subscribed`).set(false);

  // res.send({ message: `Unsubscribed from notifications on ${fullName}` });
});

/**
 * Subscribes the user to a repo
 * we will put a record into firestore under the Users/<id>/subscriptions path
 */
router.post("/repo/subscribe", async (req: any, res) => {
  const body = req.body;
  const id = req.session.github.user.id;

  const { entity, repo } = body;
  const fullName = encodeRepo(`${entity}/${repo}`);

  // const docRef = getDocRef("Users/123/metadata/repos");
  const ref = firestore.doc("Users/996134/metadata/repos");
  const snapshot = await ref.get();
  return res.send(snapshot.data());

  // // set ref
  // await SETUSERMETADATA(id, "subscriptions", {
  //   subscribed: true
  // })

  // const doc = await db.ref(`repos/${fullName}`).once("value");
  //

  // console.log(`Checking repos/${fullName} for a valid app install`);
  // if (!doc.exists()) {
  //   return res.status(500).send({ error: `${fullName} does not have the app installed` });
  // }

  // await db.ref(`users/${id}/subscriptions/${fullName}`).set(true);
  // await db.ref(`users/${id}/repos/${fullName}/subscribed`).set(true);

  // console.log("sub to repo");

  res.send({ message: `Subscribed to notifications on ${fullName}` });
});

/**
 * All the repos the current user has subscribed to
 */
router.get("/repos/subscribed", async (req: any, res) => {
  // TODO: error handle
  const id = req.session.github.user.id;
  const usersCollection = firestore.collection("Users");
  const userDoc = usersCollection.doc(`${id}`);
  const userDataCol = userDoc.collection("userdata");
  const reposDocRef = userDataCol.doc("repos");
  const reposDoc = await reposDocRef.get();
  const subscriptions = reposDoc.data();

  const repos: Omit<IRepo, "subscribed" | "installed">[] = [];
  for (const [owner, v] of Object.entries(subscriptions)) {
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
  const id = req.session.github.user.id;
  const collection = firestore.collection("Users").doc(`${id}`);
  const colloectionRef = await collection.get();
  const subscriptions = await colloectionRef.data();

  // const allUserRepos = (await db.ref(`users/${userId}/repos`).once("value")).val();
  // const allInstallRepos = (await db.ref(`repos`).once("value")).val();

  // const repos: any[] = [];
  // for (const [entity, item] of Object.entries(allUserRepos)) {
  //   for (const repo of Object.keys(item as any)) {
  //     const safeEntity = safeName(entity);
  //     const safeRepo = safeName(repo);
  //     const fullName = `${safeEntity}/${safeRepo}`;
  //     const subscribed = item[repo].subscribed;
  //     const installed = isValidRepo(allInstallRepos, fullName);

  //     // only show installed repos
  //     if (!installed) continue;
  //     repos.push({
  //       fullName,
  //       subscribed,
  //       installed
  //     });
  //   }
  // }

  console.log("get all repos");

  const stortedResposne = repos
    .sort((a: IRepo, b: IRepo) => b.fullName.localeCompare(a.fullName))
    .sort((a: IRepo) => (a.installed ? -1 : 1));

  res.json(stortedResposne);
});

export default router;
