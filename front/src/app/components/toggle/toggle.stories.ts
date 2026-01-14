import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {Toggle} from './toggle';
import {fn} from 'storybook/test';

const meta: Meta<Toggle> = {
  component: Toggle,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div class="custom-toggle" style="width: 300px; height: 500px; background-color: bisque">
          ${story().template}
        </div>
      `,
    }),
  ],
  args: {
    emitter: fn(),
  },
};
export default meta;
type Story = StoryObj<Toggle>;

export const Base: Story = {};

export const Active: Story = {
  args: {
    title: 'Custom Toggle Title',
    isChecked: true,
    description: 'Toggle is active'
  },
};

export const NoActive: Story = {
  args: {
    title: 'Custom Toggle Title',
    isChecked: false,
    description: 'Toggle is inactive'
  },
};

export const WIthOutTitle: Story = {
  args: {
    isChecked: false,
    description: 'Toggle is inactive'
  },
};
