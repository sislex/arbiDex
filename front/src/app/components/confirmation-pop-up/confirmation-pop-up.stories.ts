import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {fn} from 'storybook/test';
import {ConfirmationPopUp} from './confirmation-pop-up';

const meta: Meta<ConfirmationPopUp> = {
  component: ConfirmationPopUp,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div style="width: 900px; height: 500px; background-color: bisque">
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
type Story = StoryObj<ConfirmationPopUp>;

export const Base: Story = {};

export const Primary: Story = {
  args: {
    title: 'Standard title',
    buttons: ['yes', 'no'],
  },
};

export const WithoutButtons: Story = {
  args: {
    title: 'Standard title',
  },
};
