import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {SelectField} from './select-field';
import {fn} from 'storybook/test';

const meta: Meta<SelectField> = {
  component: SelectField,
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
    // menuData: {
    //   title: 'title',
    //   list: [
    //     {
    //       label: 'element1',
    //     },
    //   ]
    // },
    selected: ''
  },
};
export default meta;
type Story = StoryObj<SelectField>;

export const Base: Story = {};

// export const PreSelect: Story = {
//   args: {
//     menuData: {
//       title: 'Main Title',
//       list: [
//         {
//           label: '1type',
//         },
//         {
//           label: '2type',
//         },
//         {
//           label: '3type',
//         },
//         {
//           label: '4type',
//         },
//       ]
//     },
//     selected: '4type'
//   },
// };
//
// export const NoSelect: Story = {
//   args: {
//     menuData: {
//       title: 'Title',
//       list: [
//         {
//           label: '1type',
//         },
//         {
//           label: '2type',
//         },
//         {
//           label: '3type',
//         },
//         {
//           label: '4type',
//         },
//       ]
//     },
//     selected: ''
//   },
// };
//
// export const NoTitle: Story = {
//   args: {
//     menuData: {
//       title: '',
//       list: [
//         {
//           label: '1type',
//         },
//         {
//           label: '2type',
//         },
//         {
//           label: '3type',
//         },
//         {
//           label: '4type',
//         },
//       ]
//     },
//     selected: '1type'
//   },
// };
