import got from "got";

export const userProfile = async accessToken => {
  try {
    const res = got("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).json();
    return res;
  } catch (error) {
    return null;
  }
};
