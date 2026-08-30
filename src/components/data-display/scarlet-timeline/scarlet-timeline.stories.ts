import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { ScarletTimelineItem } from './scarlet-timeline';

interface ScarletTimelineArgs {
  items: ScarletTimelineItem[];
}

const items: ScarletTimelineItem[] = [
  { title: 'Pedido realizado', timestamp: '12/08, 09:14', status: 'success' },
  { title: 'Pagamento aprovado', timestamp: '12/08, 09:15', status: 'success' },
  { title: 'Em separação', description: 'Seu pedido está sendo preparado no centro de distribuição.', timestamp: '13/08, 08:02', status: 'current' },
  { title: 'Enviado' },
  { title: 'Entregue' },
];

const meta: Meta<ScarletTimelineArgs> = {
  title: 'Components/Data Display/Timeline',
  component: 'scarlet-timeline',
  argTypes: {
    // `items` é um array — propriedade JS (`.items=`), não atributo HTML.
    items: { control: 'object' },
  },
  args: { items },
  render: (args) => html`<scarlet-timeline .items=${args.items}></scarlet-timeline>`,
};

export default meta;
type Story = StoryObj<ScarletTimelineArgs>;

export const OrderStatus: Story = {
  name: 'Status de pedido',
};

export const WithError: Story = {
  args: {
    items: [
      { title: 'Pedido realizado', status: 'success', timestamp: '12/08' },
      { title: 'Pagamento recusado', description: 'Cartão sem limite disponível.', status: 'error', timestamp: '12/08' },
    ],
  },
};
