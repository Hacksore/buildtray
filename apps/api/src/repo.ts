import { db } from "./firebase";

export const createRepoEntry = items => {
  items.forEach(item => {
    const fullName = item.full_name.replaceAll(".", "-").toLowerCase();
    const [entity, repo] = fullName.split("/");
    db.ref(`repos/${entity}/${repo}`).set({
      installed: true,
    });
  });
};

export const addBuildEntry = item => {
  const fullName = item.repository.full_name.replaceAll(".", "-").toLowerCase();

  db.ref(`repos/${fullName}/builds`).push({
    status: item.action,
  });
};

export const removeRepoEntry = items => {
  items.forEach(item => {
    const fullName = item.full_name.replaceAll(".", "-").toLowerCase();
    const [entity, repo] = fullName.split("/");
    db.ref(`repos/${entity}/${repo}`).set(null);
  });
};
