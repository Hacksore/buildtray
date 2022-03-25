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