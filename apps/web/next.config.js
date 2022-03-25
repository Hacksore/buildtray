module.exports = {
  async rewrites() {
    // only in dev go local
    if (process.env.NODE_ENV === "development") {
      return {
        fallback: [
          {
            source: '/api/:path*',
            destination: "http://localhost:5001/buildtray/us-central1/api/:path*",
          },
        ],
      }
    }
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: "https://us-central1-buildtray.cloudfunctions.net/api/:path*",
        },
      ],
    }
  }
};
