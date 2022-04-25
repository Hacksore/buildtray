import { ComponentMeta } from "@storybook/react";
import { HistoricBuilds } from "../components/HistoricBuilds";

export default {
  title: "Components/HistoricBuilds",
} as ComponentMeta<typeof HistoricBuilds>;

const HISTORIC_DATA = [
  {
    id: "123",
    org: "Hacksore",
    repo: "test",
    actor: "Hacksore",
    commit: { sha: "123", message: "Storybook is cool" },
    branch: "master",
    fullName: "Hacksore/test",
    status: "failed",
  },
  {
    id: "124",
    org: "Hacksore",
    repo: "bluelinky",
    actor: "Hacksore",
    commit: { sha: "123", message: "Doing tests" },
    branch: "master",
    fullName: "Hacksore/test",
    status: "completed",
  },
];

export const Basic = () => {
  return <HistoricBuilds builds={HISTORIC_DATA} />;
};
