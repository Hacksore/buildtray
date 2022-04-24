import { store } from "../store";

/**
 * All the user repos that have been subbed
 * @returns 
 */
export const getSubscribedRepos = () => {
  try {
    return _request("/repos/subscribed");
  } catch (err) {
    return Promise.reject("Error");
  }
};

export const unsubscribeToRepo = (data: any) => {
  try {
    return _request("/repo/subscribe", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    return Promise.reject("Error");
  }
};

export const subscribeToRepo = (data: any) => {
  try {
    return _request("/repo/subscribe", {
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

/**
 * All repos the users can see
 * @returns 
 */
export const getAllUserRepos = () => {
  try {
    return _request("/repos/all", {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return Promise.reject("Error");
  }
};

export const initialSignin = (token: string) => {
  _request("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
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
    const repsonse = fetch("/api/v1" + path, mergedOptions).then(res => res.json());
    return repsonse;
  } catch (err) {
    return Promise.reject("Error");
  }
};
