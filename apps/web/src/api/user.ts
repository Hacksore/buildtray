import { store } from "../store";

export const getUserInfo = async () => {
  try {
    return _request("/api/v1/user");
  } catch (err) {
    return Promise.reject("Error");
  }
};

export const getRepos = () => {
  try {
    return _request("/api/v1/repos");
  } catch (err) {
    return Promise.reject("Error");
  }
};

export const subscribeToRepo = (data: any) => {
  try {
    return _request("/api/v1/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    return Promise.reject("Error");
  }
};

export const getAllUserRepos = () => {
  try {
    return _request("/api/v1/repos/user", {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return Promise.reject("Error");
  }
};

export const _request = async (path: string, options = {} as any) => {
  const state = store.getState();
  const mergedOptions = {
    ...options,
    headers: {
      ...(options?.headers || {}),
      Authorization: `Bearer ${state.auth.authToken}`,
      "X-Github-Auth": state.auth.githubAccessToken,
    },
  };
  
  try {
    const repsonse = fetch(path, mergedOptions).then(res => res.json());
    return repsonse;
  } catch (err) {
    return Promise.reject("Error");
  }
};
