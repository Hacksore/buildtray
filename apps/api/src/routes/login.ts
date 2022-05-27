import express from "express";
import { updateAllUsersRepos } from "../api";
import { userProfile } from "../util/github";

const router = express.Router();

/**
 * When the user first authenticates, we need to create a user entry in the database.
 */
router.post("/login", async (req: any, res) => {
  const { githubToken, firebaseToken } = req.body;

  try {
    // TODO: error handle
    req.session.github = {
      token: githubToken,
      user: await userProfile(githubToken)
    };

    req.session.firebase = {
      token: firebaseToken,
    };

    // pull all users repos in from github on login
    await updateAllUsersRepos(req.session.github.user.id, req.session.github.token);

    console.log("Created user session and updated all repos");
    res.send({ message: "Logged in to the API" });
  } catch(err) { 
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

export default router;
