import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { ScarletTableColumn, ScarletTableRow } from './scarlet-table';

interface ScarletTableArgs {
  columns: ScarletTableColumn[];
  rows: ScarletTableRow[];
  selectable: boolean;
  clickableRows: boolean;
  loading: boolean;
}

const columns: ScarletTableColumn[] = [
  { key: 'name', label: 'Nome', sortable: true },
  { key: 'role', label: 'Cargo', sortable: true },
  { key: 'city', label: 'Cidade', sortable: true },
  { key: 'salary', label: 'Salário', sortable: true, align: 'right' },
];

const rows: ScarletTableRow[] = [
  { id: 1, name: 'Ana Souza', role: 'Engenheira', city: 'São Paulo', salary: 12500 },
  { id: 2, name: 'Bruno Lima', role: 'Designer', city: 'Curitiba', salary: 8900 },
  { id: 3, name: 'Carla Nunes', role: 'Product Manager', city: 'Belo Horizonte', salary: 14200 },
  { id: 4, name: 'Diego Alves', role: 'Engenheiro', city: 'São Paulo', salary: 11800 },
];

const meta: Meta<ScarletTableArgs> = {
  title: 'Components/Data Display/Table',
  component: 'scarlet-table',
  argTypes: {
    // `columns`/`rows` são arrays — propriedades JS (`.columns=`/`.rows=`), não atributos HTML.
    columns: { control: 'object' },
    rows: { control: 'object' },
    selectable: { control: 'boolean' },
    clickableRows: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    columns,
    rows,
    selectable: false,
    clickableRows: false,
    loading: false,
  },
  render: (args) => html`
    <scarlet-table
      .columns=${args.columns}
      .rows=${args.rows}
      ?selectable=${args.selectable}
      ?clickable-rows=${args.clickableRows}
      ?loading=${args.loading}
      aria-label="Funcionários"
    ></scarlet-table>
  `,
};

export default meta;
type Story = StoryObj<ScarletTableArgs>;

export const Default: Story = {};

export const Selectable: Story = {
  args: { selectable: true },
};

export const ClickableRows: Story = {
  name: 'Linhas clicáveis',
  args: { clickableRows: true },
};

export const Empty: Story = {
  name: 'Vazia',
  args: { rows: [] },
};

export const Loading: Story = {
  name: 'Carregando',
  args: { loading: true },
};
