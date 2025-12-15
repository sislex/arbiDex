import type { Meta, StoryObj } from '@storybook/angular';
import {Dashboard} from './dashboard';
// import { fn } from 'storybook/test';


const meta: Meta<Dashboard> = {
  component: Dashboard,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: {
      control: 'color',
    },
  },
  args: {
    // onClick: fn()
  },
};

export default meta;
type Story = StoryObj<Dashboard>;

// export const Primary: Story = {
//   args: {
//     primary: true,
//     label: 'Button',
//   },
// };

