// TODO: figure out how to make token auto passed? maybe need some global state like three ducks

export const getUserInfo = async (token) => {

  try {
    const repsonse = fetch("/api/v1/user", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then(res => res.json());

    return repsonse;

  } catch (err) {
    return Promise.reject("Error");
  }
  
}
export const subscribeToRepo = async (token, data) => {

  try {
    const repsonse = fetch("/api/v1/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(res => res.json());

    return repsonse;

  } catch (err) {
    return Promise.reject("Error");
  }
  
}