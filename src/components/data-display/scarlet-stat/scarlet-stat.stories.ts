import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletStatArgs {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

const meta: Meta<ScarletStatArgs> = {
  title: 'Components/Data Display/Stat',
  component: 'scarlet-stat',
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    change: { control: 'text' },
    trend: { control: 'select', options: ['up', 'down', 'neutral'] },
  },
  args: {
    label: 'Receita total',
    value: 'R$ 42.900',
    change: '+12% vs. mês anterior',
    trend: 'up',
  },
  render: (args) => html`<scarlet-stat label=${args.label} value=${args.value} change=${args.change} trend=${args.trend}></scarlet-stat>`,
};

export default meta;
type Story = StoryObj<ScarletStatArgs>;

export const Up: Story = {};

export const Down: Story = {
  args: { change: '-4% vs. mês anterior', trend: 'down', value: 'R$ 31.200' },
};

export const NoChange: Story = {
  args: { change: '' },
};

export const Group: Story = {
  render: () => html`
    <div style="display: flex; gap: 32px;">
      <scarlet-stat label="Receita total" value="R$ 42.900" change="+12%" trend="up"></scarlet-stat>
      <scarlet-stat label="Novos clientes" value="128" change="-4%" trend="down"></scarlet-stat>
      <scarlet-stat label="Ticket médio" value="R$ 335" change="Estável" trend="neutral"></scarlet-stat>
    </div>
  `,
};
