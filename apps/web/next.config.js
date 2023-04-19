
const withTM = require("next-transpile-modules")(["shared"]);

const nextConfig = withTM({
  reactStrictMode: true,
  swcMinify: true,
});

module.exports = nextConfig;
