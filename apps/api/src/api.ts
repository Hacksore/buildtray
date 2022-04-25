import { db } from "./firebase.js";
import got from "got";
import IBuildInfo from "shared/types/IBuildInfo";
import { encodeRepo } from "shared/utils/naming";

export const createRepoEntry = items => {
  items.forEach(item => {
    db.ref(`repos/${encodeRepo(item.full_name)}`).set({
      installed: true,
      private: true,
    });
  });
};

export const addBuildEntry = item => {
  const fullName = item.repository.full_name;
  const id = item.workflow_run.id;
  db.ref(`repos/${encodeRepo(fullName)}/builds/${id}`).set({
    createdAt: Math.floor(+new Date() / 1000),
    state: item.action,
    status: item.workflow_run.conclusion,
    id,
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
      // TODO: this needs much work
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
 * @param token Github access token
 * @returns
 */
export const getUsersRepos = async token => {
  let index = 1;
  const results: any[] = [];
  const maxPerPage = 100;
  while (true) {
    // TODO: one issue is that this only works for public repos with the token we have
    const res: any = await got(`https://api.github.com/user/repos?per_page=${maxPerPage}&page=${index}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).json();

    res.forEach(item => {
      results.push({
        fullName: item.full_name,
      });
    });

    if (res.length < maxPerPage) {
      break;
    }

    index++;
  }

  return results;
};
