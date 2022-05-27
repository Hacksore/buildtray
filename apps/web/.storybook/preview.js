import { initialize, mswDecorator } from "msw-storybook-addon";

initialize({
  onUnhandledRequest: "bypass",
});

import { firebaseDecorator } from "../__mocks__/firebase";

export const decorators = [mswDecorator, firebaseDecorator];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

//preview.js
