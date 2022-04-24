import { HashRouter } from "react-router-dom";
import { store } from "./store";
import { Provider } from "react-redux";

const App = () => {
  return (
    <HashRouter>
      <Provider store={store}>
        <div>App</div>
      </Provider>
    </HashRouter>
  );
};

export default App;
