const config = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: "@storybook/react",
  webpackFinal: async config => {
    config.resolve.alias["service/firebase"] = require.resolve("../__mocks__/firebase.ts");
    return config;
  },
};

module.exports = config;
