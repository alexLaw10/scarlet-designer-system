import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletGridItemArgs {
  colSpan: number;
  rowSpan: number;
}

const cell = (label: string) => html`
  <div style="padding: 16px; background: var(--scarlet-color-primary-100, #ffe4e6); border-radius: 6px; text-align: center; height: 100%; box-sizing: border-box;">
    ${label}
  </div>
`;

const meta: Meta<ScarletGridItemArgs> = {
  title: 'Components/Layout/Grid Item',
  component: 'scarlet-grid-item',
  argTypes: {
    colSpan: { control: 'number' },
    rowSpan: { control: 'number' },
  },
  args: {
    colSpan: 2,
    rowSpan: 1,
  },
  render: (args) => html`
    <scarlet-grid columns="4" gap="md">
      <scarlet-grid-item col-span=${args.colSpan} row-span=${args.rowSpan}>${cell('col-span/row-span')}</scarlet-grid-item>
      ${cell('Item')} ${cell('Item')} ${cell('Item')} ${cell('Item')}
    </scarlet-grid>
  `,
};

export default meta;
type Story = StoryObj<ScarletGridItemArgs>;

export const Default: Story = {};

export const SpansTwoRows: Story = {
  args: { colSpan: 1, rowSpan: 2 },
};
