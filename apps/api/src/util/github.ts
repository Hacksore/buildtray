import got  from 'got';

export const userProfile = async (accessToken) => {
  return got("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  }).json();
}