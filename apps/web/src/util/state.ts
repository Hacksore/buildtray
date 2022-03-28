export const saveState = (state: any) => {
  try {
    const serialState = JSON.stringify(state);
    localStorage.setItem("appState", serialState);
  } catch (err) {
    console.log(err);
  }
};

export const loadState = (initialState: any) => {
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
