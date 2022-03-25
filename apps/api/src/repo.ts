import { db } from "./firebase";

export const createRepoEntry = items => {
  items.forEach(item => {
    const fullName = item.full_name.replaceAll(".", "-");
    const [entity, repo] = fullName.split("/");
    db.ref(`repos/${entity}/${repo}`).set({
      installed: true,
    });
  });
};
