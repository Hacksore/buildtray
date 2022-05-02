export const saveState = (state: unknown) => {
  try {
    const serialState = JSON.stringify(state);
    localStorage.setItem("appState", serialState);
  } catch (err) {
    console.log(err);
  }
};

export const loadState = (initialState: unknown) => {
  try {
    const serialState = localStorage.getItem("appState");
    if (serialState === null) {
      return initialState;
    }
    return JSON.parse(serialState);
  } catch (err) {
    return initialState;
  }
};
