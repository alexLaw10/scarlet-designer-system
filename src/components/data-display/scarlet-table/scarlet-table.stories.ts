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

export const StickyHeader: Story = {
  name: 'Cabeçalho fixo',
  render: (args) => html`
    <p style="margin: 0 0 12px; font-size: 14px; color: var(--scarlet-color-text-secondary, #64748b);">
      Com <code>stickyHeader</code> e <code>maxHeight</code>, o cabeçalho fica visível enquanto o corpo rola.
    </p>
    <scarlet-table
      .columns=${args.columns}
      .rows=${[...args.rows, ...args.rows, ...args.rows]}
      sticky-header
      max-height="220px"
      aria-label="Funcionários"
    ></scarlet-table>
  `,
};

export const MultiSort: Story = {
  name: 'Sort em várias colunas (shift+clique)',
  render: (args) => html`
    <p style="margin: 0 0 12px; font-size: 14px; color: var(--scarlet-color-text-secondary, #64748b);">
      Clique em um cabeçalho pra ordenar por ele. Segure Shift e clique em outro pra adicioná-lo como critério de
      desempate — um numerinho mostra a prioridade. Shift+clique de novo no mesmo cicla asc → desc → remove.
    </p>
    <scarlet-table
      .columns=${args.columns}
      .rows=${args.rows}
      multi-sort
      aria-label="Funcionários"
    ></scarlet-table>
  `,
};

export const ReorderableColumns: Story = {
  name: 'Reordenar colunas (arrastar)',
  render: (args) => html`
    <p style="margin: 0 0 12px; font-size: 14px; color: var(--scarlet-color-text-secondary, #64748b);">
      Arraste o ícone de alça em cada cabeçalho pra mudar a ordem das colunas.
    </p>
    <scarlet-table
      .columns=${args.columns}
      .rows=${args.rows}
      reorderable-columns
      aria-label="Funcionários"
    ></scarlet-table>
  `,
};

export const ReorderableRows: Story = {
  name: 'Reordenar linhas (arrastar)',
  render: (args) => html`
    <p style="margin: 0 0 12px; font-size: 14px; color: var(--scarlet-color-text-secondary, #64748b);">
      Arraste o ícone de alça em cada linha pra reordenar — desativado enquanto algum sort estiver ativo.
    </p>
    <scarlet-table
      .columns=${args.columns}
      .rows=${args.rows}
      reorderable-rows
      aria-label="Funcionários"
    ></scarlet-table>
  `,
};
