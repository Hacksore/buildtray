/**
 * Replace all occurrences of url characters that can be encoded with their respective url encoding, including period as well
 * @param string a string to sanitized
 * @returns a string sanitized string
 */
export const safeName = (string: string) => {
  return encodeURIComponent(string).replace(/\./g, "%2e");
};

/**
 * Replace all occurrences characters that are url encoded with their normal values, including %2e
 * @param string a string to desanitized
 * @returns a desanitized string
 */
export const unsafeName = (string: string) => {
  return decodeURIComponent(string).replace(/%2e/g, ".");
};

/**
 * URL encodes a repo name into a ent/repo format to keep friendly to the database
 * Firebase prohibits these characters as keys: $ # [ ] /
 * @param fullName Complete repo name - ex: hacksore/hacksore.com
 * @returns String - ex: hacksore%2fhacksore%2ecom
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

/**
 * Is a string a valid repo
 */
export const isValidRepo = (object: any, fullName: string) => {
  const [entity, repo] = fullName.split("/");

  if (object[entity] && object[entity][repo]) {
    return true;
  }

  return false;
};
