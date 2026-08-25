import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { ScarletBreadcrumbItem } from './scarlet-breadcrumb';

interface ScarletBreadcrumbArgs {
  items: ScarletBreadcrumbItem[];
  separator: string;
}

const defaultItems: ScarletBreadcrumbItem[] = [
  { label: 'Início', href: '/' },
  { label: 'Produtos', href: '/produtos' },
  { label: 'Eletrônicos', href: '/produtos/eletronicos' },
  { label: 'Fones de ouvido' },
];

const meta: Meta<ScarletBreadcrumbArgs> = {
  title: 'Components/Navigation/Breadcrumb',
  component: 'scarlet-breadcrumb',
  argTypes: {
    // `items` é um array — passado como propriedade JS (`.items=`), não
    // atributo HTML, igual a scarlet-tabs/scarlet-accordion.
    items: { control: 'object' },
    separator: { control: 'text' },
  },
  args: {
    items: defaultItems,
    separator: '›',
  },
  render: (args) => html`<scarlet-breadcrumb .items=${args.items} separator=${args.separator}></scarlet-breadcrumb>`,
};

export default meta;
type Story = StoryObj<ScarletBreadcrumbArgs>;

export const Default: Story = {};

export const TwoLevels: Story = {
  args: { items: [{ label: 'Início', href: '/' }, { label: 'Configurações' }] },
};

export const SlashSeparator: Story = {
  args: { separator: '/' },
};
