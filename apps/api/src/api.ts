import { db } from "./firebase.js";
import got from "got";

export const createRepoEntry = items => {
  items.forEach(item => {
    const fullName = item.full_name.replaceAll(".", "-").toLowerCase();
    const [entity, repo] = fullName.split("/");
    db.ref(`repos/${entity}/${repo}`).set({
      installed: true,
      private: true,
    });
  });
};

export const addBuildEntry = item => {
  const fullName = item.repository.full_name.replaceAll(".", "-").toLowerCase();
  const id = item.workflow_run.id;
  db.ref(`repos/${fullName}/builds/${id}`).set({
    createdAt: Math.floor(+new Date() / 1000),
    status: item.action,
    id: item.workflow_run.id,
    branch: item.workflow_run.head_branch,
  });
};

export const removeRepoEntry = items => {
  items.forEach(item => {
    const fullName = item.full_name.replaceAll(".", "-").toLowerCase();
    const [entity, repo] = fullName.split("/");
    db.ref(`repos/${entity}/${repo}`).set(null);
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
