import express from "express";
import { db } from "../firebase";
import { getUsersRepos } from "../api";
import { userProfile } from "../util/github";

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

  const id = req.session.github.user.id;
  const path = `users/${id}`;

  // TODO: move this to a func and call here
  const doc = await db.ref(path).once("value");
  if (!doc.exists()) {
    const repos = await getUsersRepos(req.session.github.token);
    const dict = {};

    repos.forEach(item => {
      const fullName = item.fullName.replaceAll(".", "-").toLowerCase();
      const [entity, repo] = fullName.split("/");

      if (dict[entity] === undefined) {
        dict[entity] = {
          [repo]: true,
        };
      } else {
        dict[entity] = {
          ...dict[entity],
          [repo]: true,
        };
      }
    });
    db.ref(path).set(dict);

    return res.send({ message: `User has been setup` });
  }

  res.send({ message: "Logged in to the API" });
});

export default router;
