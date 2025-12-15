import {Toolbar} from './toolbar';
import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import { fn } from 'storybook/test';

const meta: Meta<Toolbar> = {
  component: Toolbar,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
  ],
  args: {
    emitter: fn(),
    header: 'Header',
  },
};
export default meta;
type Story = StoryObj<Toolbar>;

export const Base: Story = {};

export const WithCustomProvider: Story = {
  args: {
    header: 'Header TOOlBAR ex',
    menuItemList: [
      {
        title: 'firstItem',
        url: '/firstUrl'
      },
      {
        title: 'secondItem',
        url: '/secondUrl'
      },
      {
        title: 'thirdItem',
        url: '/thirdUrl'
      },
    ]
  },
};
