import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {Loader} from './loader';

const meta: Meta<Loader> = {
  component: Loader,
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
  },
};
export default meta;
type Story = StoryObj<Loader>;

export const Base: Story = {};
