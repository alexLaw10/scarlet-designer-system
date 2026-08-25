import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletGridArgs {
  columns: number;
  gap: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const cell = (label: string) => html`
  <div style="padding: 16px; background: var(--scarlet-color-primary-100, #ffe4e6); border-radius: 6px; text-align: center;">${label}</div>
`;

const meta: Meta<ScarletGridArgs> = {
  title: 'Components/Layout/Grid',
  component: 'scarlet-grid',
  argTypes: {
    columns: { control: 'number' },
    gap: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
  args: {
    columns: 4,
    gap: 'md',
  },
  render: (args) => html`
    <scarlet-grid columns=${args.columns} gap=${args.gap}>
      ${[1, 2, 3, 4, 5, 6, 7, 8].map((n) => cell(`Item ${n}`))}
    </scarlet-grid>
  `,
};

export default meta;
type Story = StoryObj<ScarletGridArgs>;

export const FourColumns: Story = {};

export const WithSpanningItems: Story = {
  render: () => html`
    <scarlet-grid columns="4" gap="md">
      <scarlet-grid-item col-span="2">${cell('Ocupa 2 colunas')}</scarlet-grid-item>
      ${cell('Item')} ${cell('Item')}
      <scarlet-grid-item col-span="4">${cell('Ocupa a linha inteira')}</scarlet-grid-item>
    </scarlet-grid>
  `,
};
