import express from "express";
import { db } from "../firebase";
import { getUsersRepos } from "../api";
import { userProfile } from "../util/github";

const router = express.Router();

/**
 * When the user first authenticates, we need to create a user entry in the database.
 */
router.post("/login", async (req: any, res) => {
  const { token } = req.body;

  // add gh-token to session
  // TODO: error handle
  req.session.githubToken = token;
  req.session.githubUser = await userProfile(token);

  req.session.save();

  console.log(req.session.githubUser);

  const id = req.session.githubUser.id;
  const path = `users/${id}`;

  const doc = await db.ref(path).once("value");
  if (!doc.exists()) {
    const repos = await getUsersRepos(token);
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

  res.send({ message: "????" });
});

export default router;
