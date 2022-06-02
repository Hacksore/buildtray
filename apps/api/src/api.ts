import { firestore, db } from "./firebase.js";
import IBuildInfo from "shared/types/IBuildInfo";
import { encodeRepo, entityAndRepo } from "shared/utils/naming";
import { getAllUsersRepos } from "./util/github.js";
import { doc, setDoc } from "firebase/firestore";

/**
 * Create a new repo entry in the database for each item
 * @param items list of repos from github
 */
export const createOrUpdateRepoEntry = items => {
  items.forEach(item => {
    const fullName = encodeRepo(item.full_name);
    db.ref(`repos/${fullName}`).set({
      metadata: {
        fullName: item.full_name,
        private: item.private,
      },
    });
  });
};

/**
 * When a new webhook build is sent it this will add the build to the repo build list
 * @param item
 */
export const addBuildEntry = item => {
  const fullName = encodeRepo(item.repository.full_name);
  const id = item.workflow_run.id;
  db.ref(`repos/${fullName}/builds/${id}`).set({
    id,
    createdAt: Math.floor(+new Date() / 1000),
    status: item.workflow_run.status,
    conclusion: item.workflow_run.conclusion,
    branch: item.workflow_run.head_branch,
    commit: {
      sha: item.workflow_run.head_sha,
      message: item.workflow_run.head_commit.message,
      author: item.workflow_run.head_commit.author.name,
    },
    fullName: item.repository.full_name,
    org: item.repository.owner.login,
    repo: item.repository.name,
    url: item.workflow_run.html_url,
    user: {
      sender: item.sender.login,
      avatarUrl: item?.sender?.avatar_url,
    },
  } as IBuildInfo);
};

export const removeRepoEntry = items => {
  items.forEach(item => {
    const fullName = item.full_name;
    db.ref(`repos/${encodeRepo(fullName)}`).set(null);
  });
};

/**
 *
 * @param id github user id
 * @param token github access token
 */
// TODO: handle errors for this?
export const updateAllUsersRepos = async (id: number, token: string) => {
  const allRepos = await getAllUsersRepos(token);
  const repos = {};

  // this is not pretty to look at :)
  allRepos.forEach(item => {
    const [owner, repo] = entityAndRepo(item.fullName);
    if (repos[owner] === undefined) {
      repos[owner] = {
        [repo]: {
          subscribed: false,
        },
      };
    } else {
      repos[owner] = {
        ...repos[owner],
        [repo]: {
          subscribed: false,
        },
      };
    }
  });

  // set doc with user data
  await firestore.collection("Users").doc(`${id}`).set({
    repos
  });

};
