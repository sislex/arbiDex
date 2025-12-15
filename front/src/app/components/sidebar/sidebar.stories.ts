import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {Sidebar} from './sidebar';
import {fn} from 'storybook/test';

const meta: Meta<Sidebar> = {
  component: Sidebar,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
       <div style="border: 2px solid black; height: 400px; width: 700px">
          <app-sidebar [isSidebarOpen]="isSidebarOpen" [sidebarTitle]="sidebarTitle" (emitter)="onClicked($event)">
            <div main>CONTENT</div>
          </app-sidebar>
        </div>
    `,
    }),
  ],
  args: {
    emitter: fn(),
    sidebarTitle: 'sidebarTitle',
  },
};
export default meta;
type Story = StoryObj<Sidebar>;

export const Base: Story = {};

export const SidebarOpen: Story = {
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [
      ],
    }),
  ],
  args: {
    sidebarTitle: 'sidebar title',
    isSidebarOpen: true,
    list: [
      {
        ip: '45.135.182.251',
        port: '1005',
        name: 'UNREAL_SERVER',
      },
    ]
  },
};

export const SidebarClose: Story = {
  args: {
    isSidebarOpen: false,
  },
};
