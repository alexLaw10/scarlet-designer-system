import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletEmptyStateArgs {
  icon: string;
  heading: string;
  description: string;
}

const meta: Meta<ScarletEmptyStateArgs> = {
  title: 'Components/Data Display/Empty State',
  component: 'scarlet-empty-state',
  argTypes: {
    icon: { control: 'text' },
    heading: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    icon: 'search',
    heading: 'Nenhum resultado encontrado.',
    description: 'Tente ajustar os filtros ou buscar por outro termo.',
  },
  render: (args) => html`
    <scarlet-empty-state icon=${args.icon} heading=${args.heading} description=${args.description}>
      <scarlet-button slot="action" variant="solid" color="primary">Limpar filtros</scarlet-button>
    </scarlet-empty-state>
  `,
};

export default meta;
type Story = StoryObj<ScarletEmptyStateArgs>;

export const Default: Story = {};

export const WithoutAction: Story = {
  render: (args) => html`<scarlet-empty-state icon=${args.icon} heading=${args.heading} description=${args.description}></scarlet-empty-state>`,
};

export const MinimalNoIcon: Story = {
  name: 'Sem ícone',
  render: () => html`<scarlet-empty-state heading="Nenhum registro encontrado."></scarlet-empty-state>`,
};
