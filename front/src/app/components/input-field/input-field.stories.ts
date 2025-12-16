import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {fn} from 'storybook/test';
import {InputField} from './input-field';

const meta: Meta<InputField> = {
  component: InputField,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div style="width: 100%; height: 500px; background-color: bisque">
          ${story().template}
        </div>
      `,
    }),
  ],
  args: {
    emitter: fn(),
    label: '',
    placeholder: '',
    inputValue: '',
  },
};
export default meta;
type Story = StoryObj<InputField>;

export const Base: Story = {};

export const EmptyField: Story = {
  args: {
    title: 'Title text',
    label: 'LABEL text',
    placeholder: 'PLACEHOLDER text',
    inputValue: '',

  },
};

export const WithContent: Story = {
  args: {
    title: 'Title text',
    label: 'LABEL text',
    placeholder: 'PLACEHOLDER text',
    inputValue: 'InputText',
  },
};

export const WithoutTitle: Story = {
  args: {
    title: '',
    label: 'LABEL text',
    placeholder: 'PLACEHOLDER text',
    inputValue: 'InputText',
  },
};
