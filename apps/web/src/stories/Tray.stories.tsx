import { ComponentMeta } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { Tray } from "../containers/Tray";
import { store } from "../store";
import withMock from "storybook-addon-mock";
import { rest } from "msw";

export default {
  title: "Components/Tray",
  decorators: [withMock],
} as ComponentMeta<typeof Tray>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const Template = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Tray />
      </Provider>
    </QueryClientProvider>
  );
};

Template.parameters = {
  msw: {
    handlers: [
      rest.get("/api/v1/repos/subscribed", (req, res, ctx) => {
        return res(ctx.json(["hacksore/test"]));
      }),
  
      rest.get("/api/v1/repos/ge", (req, res, ctx) => {
        return res(
          ctx.json([
            {
              commit: {
                sha: "test",
                message: "test",
                author: "test",
              },
              id: "test",
              status: "queued",
              branch: "test",
              createdAt: 1300000,
              fullName: "test",
              org: "test",
              repo: "test",
              url: "test",
              user: {
                sender: "test",
                avatarUrl: "test",
              },
            },
          ])
        );
      }),
    ],
  },
};
