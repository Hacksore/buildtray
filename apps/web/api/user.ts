import { store } from "../store";

export const getUserInfo = async () => {
  try {
    return _request("/api/v1/user");
  } catch (err) {
    return Promise.reject("Error");
  }
};

export const getRepos = async token => {
  try {
    return _request("/api/v1/repos");
  } catch (err) {
    return Promise.reject("Error");
  }
};

export const subscribeToRepo = async data => {
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

export const _request = async (path, options = {} as any) => {
  const state = store.getState();

  const mergedOptions = {
    ...options,
    headers: {
      ...(options?.headers || {}),
      Authorization: `Bearer ${state.root.authToken}`,
    },
  };
  try {
    const repsonse = fetch(path, mergedOptions).then(res => res.json());
    return repsonse;
  } catch (err) {
    return Promise.reject("Error");
  }
};
