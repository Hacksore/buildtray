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
  try {
    const response: any = await got("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).json();
    
    return response.map(item => ({
      fullName: item.full_name,
    }));
  } catch (err) {
    console.log(err);
    return null;
  }
};
