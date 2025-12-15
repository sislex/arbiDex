import type { Meta, StoryObj } from '@storybook/angular';
// import { fn } from 'storybook/test';
import {Auth} from './auth';


const meta: Meta<Auth> = {
  component: Auth,
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
type Story = StoryObj<Auth>;

// export const Primary: Story = {
//   args: {
//     primary: true,
//     label: 'Button',
//   },
// };

