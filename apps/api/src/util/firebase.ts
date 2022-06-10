import { entityAndRepo } from "shared/utils/naming";

// TODO: reusable somehow?
export const createNestedRepoSet = (items: any[]) => {
  const repos = {};
  items.forEach(item => {
    const [owner, repo] = entityAndRepo(item.fullName);
    if (repos[owner] === undefined) {
      repos[owner] = {
        [repo]: false,
      };
    } else {
      repos[owner] = {
        ...repos[owner],
        [repo]: false,
      };
    }
  });
};
