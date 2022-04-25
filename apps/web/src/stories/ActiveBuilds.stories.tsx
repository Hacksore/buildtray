import { ComponentMeta } from '@storybook/react';
import { ActiveBuilds } from '../components/ActiveBuilds';

export default {
  title: 'Components/ActiveBuilds',
} as ComponentMeta<typeof ActiveBuilds>;

export const Loading = () => {
  const builds = [
    {fullName: "Hacksore/test", status: "queued"},
    {fullName: "Hacksore/bluelinky", status: "queued"},
    {fullName: "Hacksore/react-grid-select", status: "queued"},
  ]
  return <ActiveBuilds builds={builds} />;
};
