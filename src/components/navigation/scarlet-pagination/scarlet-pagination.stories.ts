import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletPaginationArgs {
  totalPages: number;
  page: number;
  siblingCount: number;
}

const meta: Meta<ScarletPaginationArgs> = {
  title: 'Components/Navigation/Pagination',
  component: 'scarlet-pagination',
  argTypes: {
    totalPages: { control: 'number' },
    page: { control: 'number' },
    siblingCount: { control: 'number' },
  },
  args: {
    totalPages: 20,
    page: 7,
    siblingCount: 1,
  },
  render: (args) => html`
    <scarlet-pagination total-pages=${args.totalPages} page=${args.page} sibling-count=${args.siblingCount}></scarlet-pagination>
  `,
};

export default meta;
type Story = StoryObj<ScarletPaginationArgs>;

export const Default: Story = {};

export const FewPages: Story = {
  name: 'Poucas páginas (sem ellipsis)',
  args: { totalPages: 5, page: 2 },
};

export const FirstPage: Story = {
  name: 'Primeira página',
  args: { page: 1 },
};

export const LastPage: Story = {
  name: 'Última página',
  args: { page: 20 },
};
