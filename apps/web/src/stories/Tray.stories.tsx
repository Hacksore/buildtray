import { ComponentMeta } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { Tray } from "../containers/Tray";
import { store } from "../store";
import withMock from "storybook-addon-mock";

export default {
  title: "Components/Tray",
  decorators: [withMock],
} as ComponentMeta<typeof Tray>;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Template = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Tray />
      </Provider>
    </QueryClientProvider>
  );
};

export const Default = Template.bind({});
// Default.parameters = {
//   mockData: [
//     {
//       url: "http:///todos/1",
//       method: "GET",
//       status: 200,
//       response: {
//         data: "Hello storybook-addon-mock!",
//       },
//     },
//   ],
// };
