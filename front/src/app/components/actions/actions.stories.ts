import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {Actions} from './actions';
import {fn} from 'storybook/test';

const meta: Meta<Actions> = {
  component: Actions,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div style="width: 300px; height: 500px; background-color: bisque">
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
type Story = StoryObj<Actions>;

export const Base: Story = {};

export const Edit: Story = {
  args: {
    icon: 'edit',
    type: 'default',
  },
};

export const Delete: Story = {
  args: {
    icon: 'delete',
    type: 'red',
  },
};

export const Stop: Story = {
  args: {
    icon: 'stop',
    type: 'red',
  },
};

export const Start: Story = {
  args: {
    icon: 'play_arrow',
    type: 'green',
  },
};
