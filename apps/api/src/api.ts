import { db } from "./firebase.js";
import IBuildInfo from "shared/types/IBuildInfo";
import { encodeRepo, entityAndRepo } from "shared/utils/naming";
import { getAllUsersRepos } from "./util/github.js";

/**
 * Create a new repo entry in the database for each item
 * @param items list of repos from github
 */
export const createOrUpdateRepoEntry = items => {
  items.forEach(item => {
    db.ref(`repos/${item.id}`).set({
      metadata: {
        fullName: item.full_name,
        private: item.private
      },
    });
  });
};

/**
 * When a new webhook build is sent it this will add the build to the repo build list
 * @param item
 */
export const addBuildEntry = item => {
  const fullName = item.repository.full_name;
  const id = item.workflow_run.id;
  db.ref(`repos/${item.repository.id}/builds/${id}`).set({
    createdAt: Math.floor(+new Date() / 1000),
    status: item.workflow_run.status,
    branch: item.workflow_run.head_branch,
    commit: {
      sha: item.workflow_run.head_sha,
      message: item.workflow_run.head_commit.message,
      author: item.workflow_run.head_commit.author.name,
    },
    fullName,
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
export const updateAllUsersRepos = async (id, token) => {
  const path = `users/${id}/repos`;
  const doc = await db.ref(path).once("value");
  if (!doc.exists()) {
    const repos = await getAllUsersRepos(token);
    const dict = {};

    repos.forEach(item => {
      dict[item.id] = true;
    });

    db.ref(path).set(dict);
  }
};
