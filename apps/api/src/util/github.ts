import got from "got";

const GITHUB_API_V3_URL = "https://api.github.com";

export const userProfile = async accessToken => {
  try {
    return got(`${GITHUB_API_V3_URL}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).json();
  } catch (error) {
    return null;
  }
};

/**
 *
 * @param token Github access token
 * @returns {Promise<Array<{fullName: string, owner: string, repo: string}>>}
 */
 export const getAllUsersRepos = async token => {
  let index = 1;
  const results: any[] = [];
  const maxPerPage = 100;
  while (true) {
    const res: any = await got(`${GITHUB_API_V3_URL}/user/repos?per_page=${maxPerPage}&page=${index}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).json();

    res.forEach(item => {
      results.push({
        id: item.id,
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

export const getRepoInfo = async ({
  entity,
  repo,
  accessToken,
}) => {
  try {
    return got(`${GITHUB_API_V3_URL}/repos/${entity}/${repo}}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).json();
  } catch (error) {
    return null;
  }
};
