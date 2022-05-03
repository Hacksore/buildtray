/**
 * URL encodes a repo name into a ent/repo format to keep firendly to the database
 * Firebase prohibits these chareters as keys: $ # [ ] /
 * @param fullName Complete repo name - ex: hacksore.com/my-repo
 * @returns String - ex: hacksore%2fcom%2fmy-repo
 */
export const encodeRepo = (fullName: string) => {
  const safeName = (name: string) => {
    return encodeURIComponent(name.toLocaleLowerCase()).replace(/\./g, "%2e");
  };

  const [owner, repo] = entityAndRepo(fullName);
  return `${safeName(owner)}/${safeName(repo)}`;
};

/**
 * Get the ent and repo from a full name
 */
export const entityAndRepo = (fullName: string) => {
  const [owner, repo] = fullName.split("/");
  return [owner, repo];
};
