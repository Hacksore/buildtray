import { getAuth } from "firebase/auth";
import { app } from "../main";

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

export const unsubscribeFromRepo = (data: unknown) => {
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

export const subscribeToRepo = (data: unknown) => {
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

export const initialSignin = ({
  githubToken,
  firebaseToken,
}: {
  githubToken: string;
  firebaseToken: string;
}): Promise<unknown> => {
  return _request("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ githubToken, firebaseToken }),
  });
};

export const _request = async (path: string, options: RequestInit = {}) => {
  const auth = getAuth(app);
  const accesstToken = await auth.currentUser?.getIdToken();
  const mergedOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accesstToken}`,
    },
  };

  try {
    const response = fetch("/api/v1" + path, mergedOptions).then(res => res.json());
    return response;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("err", err);
    return Promise.reject("Error");
  }
};
