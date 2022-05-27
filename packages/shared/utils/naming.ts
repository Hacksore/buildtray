/**
 * Replace all occurrences of url characters that can be encoded with their spective url encoding, inlcuding period as well
 * @param string a string to santize
 * @returns a string santized string
 */
export const safeName = (string: string) => {
  return encodeURIComponent(string.toLocaleLowerCase()).replace(/\./g, "%2e");
};

/**
 * Replace all occurrences characters that are url encoded with their normal values, inlcuding %2e
 * @param string a string to desantize
 * @returns a desantized string
 */
export const unsafeName = (string: string) => {
  return decodeURIComponent(string.toLocaleLowerCase()).replace(/%2e/g, ".");
};

/**
 * URL encodes a repo name into a ent/repo format to keep firendly to the database
 * Firebase prohibits these chareters as keys: $ # [ ] /
 * @param fullName Complete repo name - ex: hacksore.com/my-repo
 * @returns String - ex: hacksore%2fcom%/my-repo
 */
export const encodeRepo = (fullName: string) => {
  const [owner, repo] = entityAndRepo(fullName);
  return `${safeName(owner)}/${safeName(repo)}`;
};

/**
 * Get the ent and repo from a full name
 */
export const entityAndRepo = (fullName: string) => {
  const [owner, repo] = fullName.split("/");
  return [safeName(owner), safeName(repo)];
};

/**
 * Convert a owner/repo to a safe name
 */
export const entityAndRepoToSafeName = (owner: string, repo: string) => {
  return `${safeName(owner)}/${safeName(repo)}`;
};
