import express from "express";
import { db } from "../firebase";
import { getUsersRepos } from "../api";
import { userProfile } from "../util/github";
import { encodeRepo } from "shared/utils/naming";

const router = express.Router();

/**
 * When the user first authenticates, we need to create a user entry in the database.
 */
router.post("/login", async (req: any, res) => {
  const { githubToken, firebaseToken } = req.body;

  // TODO: error handle
  req.session.github = {
    token: githubToken,
    user: await userProfile(githubToken)
  };

  req.session.firebase = {
    token: firebaseToken,
  };

  // TODO: pull users repos

  res.send({ message: "Logged in to the API" });
});

export default router;
