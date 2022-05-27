import { ComponentMeta } from "@storybook/react";
import { BuildsList } from "../components/BuildsList";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { store } from "../store";
import { rest } from "msw";

export default {
  title: "Components/BuiildsList",
} as ComponentMeta<typeof BuildsList>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const Basic = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BuildsList />
      </Provider>
    </QueryClientProvider>
  );
};

Basic.parameters = {
  msw: {
    handlers: [
      rest.get("/api/v1/repos/subscribed", (req, res, ctx) => {
        ctx.set("Content-Type", "application/json");
        return res(ctx.json(["hacksore/test"]));
      }),

      rest.get("/api/v1/repos/ge", (req, res, ctx) => {
        return res(ctx.json([]));
      }),
    ],
  },
  firebase: {
    getMostRecentBuilds: () => [],
  },
};
