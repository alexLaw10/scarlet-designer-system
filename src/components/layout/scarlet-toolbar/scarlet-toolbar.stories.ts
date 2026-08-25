import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletToolbarArgs {
  justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

const meta: Meta<ScarletToolbarArgs> = {
  title: 'Components/Layout/Toolbar',
  component: 'scarlet-toolbar',
  argTypes: {
    justify: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
  },
  args: {
    justify: 'start',
  },
  render: (args) => html`
    <scarlet-toolbar justify=${args.justify} aria-label="Ações da tabela">
      <scarlet-button variant="ghost" color="neutral" size="sm" icon-only aria-label="Atualizar">
        <scarlet-icon name="arrow-right"></scarlet-icon>
      </scarlet-button>
      <scarlet-divider orientation="vertical"></scarlet-divider>
      <scarlet-input size="sm" placeholder="Buscar..."></scarlet-input>
      <scarlet-button variant="solid" color="primary" size="sm">
        <scarlet-icon slot="start" name="plus"></scarlet-icon>
        Novo
      </scarlet-button>
    </scarlet-toolbar>
  `,
};

export default meta;
type Story = StoryObj<ScarletToolbarArgs>;

export const Default: Story = {};

export const SpaceBetween: Story = {
  args: { justify: 'between' },
};
