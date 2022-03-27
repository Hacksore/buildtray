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
  const id = item.workflow_run.id;
  db.ref(`repos/${fullName}/builds/${id}`).set({
    createdAt: Math.floor(+new Date()/1000),
    status: item.action,
    id: item.workflow_run.id,
    branch: item.workflow_run.head_branch
  });
};

export const removeRepoEntry = items => {
  items.forEach(item => {
    const fullName = item.full_name.replaceAll(".", "-").toLowerCase();
    const [entity, repo] = fullName.split("/");
    db.ref(`repos/${entity}/${repo}`).set(null);
  });
};
