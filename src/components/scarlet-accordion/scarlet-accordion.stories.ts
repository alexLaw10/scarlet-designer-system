import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { ScarletAccordionItem } from './scarlet-accordion';

interface ScarletAccordionArgs {
  multiple: boolean;
}

const items: ScarletAccordionItem[] = [
  { value: 'envio', title: 'Qual o prazo de entrega?' },
  { value: 'pagamento', title: 'Quais formas de pagamento vocês aceitam?' },
  { value: 'trocas', title: 'Como funcionam trocas e devoluções?' },
];

const meta: Meta<ScarletAccordionArgs> = {
  title: 'Components/Accordion',
  component: 'scarlet-accordion',
  argTypes: {
    multiple: { control: 'boolean' },
  },
  args: {
    multiple: false,
  },
  render: (args) => html`
    <scarlet-accordion .items=${items} ?multiple=${args.multiple} .expandedValues=${['envio']} style="max-width: 480px;">
      <div slot="envio">O prazo varia de 3 a 7 dias úteis, dependendo da região.</div>
      <div slot="pagamento">Aceitamos cartão de crédito, Pix e boleto bancário.</div>
      <div slot="trocas">Você tem até 30 dias corridos para solicitar troca ou devolução.</div>
    </scarlet-accordion>
  `,
};

export default meta;
type Story = StoryObj<ScarletAccordionArgs>;

export const SingleOpen: Story = {};

export const MultipleOpen: Story = {
  args: { multiple: true },
};
