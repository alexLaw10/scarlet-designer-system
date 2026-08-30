import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { ScarletMenuItem } from './scarlet-menu';

interface ScarletMenuArgs {
  items: ScarletMenuItem[];
  placement: 'start' | 'end';
}

const defaultItems: ScarletMenuItem[] = [
  { value: 'edit', label: 'Editar' },
  { value: 'duplicate', label: 'Duplicar' },
  { value: 'archive', label: 'Arquivar', disabled: true },
  { value: 'delete', label: 'Excluir', danger: true },
];

const meta: Meta<ScarletMenuArgs> = {
  title: 'Components/Navigation/Menu',
  component: 'scarlet-menu',
  argTypes: {
    // `items` é um array — propriedade JS (`.items=`), não atributo HTML.
    items: { control: 'object' },
    placement: { control: 'select', options: ['start', 'end'] },
  },
  args: {
    items: defaultItems,
    placement: 'start',
  },
  render: (args) => html`
    <scarlet-menu .items=${args.items} placement=${args.placement}>
      <scarlet-button slot="trigger" variant="ghost" aria-label="Mais ações">⋮</scarlet-button>
    </scarlet-menu>
  `,
};

export default meta;
type Story = StoryObj<ScarletMenuArgs>;

export const Default: Story = {};

export const AlignedToEnd: Story = {
  name: 'Alinhado à direita',
  args: { placement: 'end' },
};
