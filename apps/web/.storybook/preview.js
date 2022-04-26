import { rest } from 'msw'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  msw: {
    handlers: [
      rest.get('/api/v1/repos/subscribed', (req, res, ctx) => {
        console.log("mock")
        return res(
          ctx.json([])
        )
      }),
    ],

  }
};

//preview.js
