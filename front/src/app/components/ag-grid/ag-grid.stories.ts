import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGrid} from './ag-grid';
import {gridStabs_1} from './stabs';

const meta: Meta<AgGrid> = {
  component: AgGrid,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div class="ag-grid-container" style="width: 100%; height: 500px;">
          ${story().template}
        </div>
      `,
    }),
  ],
  args: {
  },

};
export default meta;
type Story = StoryObj<AgGrid>;

export const Empty: Story = {};

export const BasicRows: Story = {
  args: {
    rowData: gridStabs_1
  },
};
