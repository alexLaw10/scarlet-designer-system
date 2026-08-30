import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletButtonArgs {
  variant: 'solid' | 'outline' | 'ghost' | 'link';
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled: boolean;
  loading: boolean;
  fullWidth: boolean;
  label: string;
}

const colors: ScarletButtonArgs['color'][] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
  'neutral',
];

const meta: Meta<ScarletButtonArgs> = {
  title: 'Components/Button',
  component: 'scarlet-button',
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outline', 'ghost', 'link'] },
    color: { control: 'select', options: colors },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    variant: 'solid',
    color: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    label: 'Clique aqui',
  },
  render: (args) => html`
    <scarlet-button
      variant=${args.variant}
      color=${args.color}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      ?full-width=${args.fullWidth}
    >
      ${args.label}
    </scarlet-button>
  `,
};

export default meta;
type Story = StoryObj<ScarletButtonArgs>;

export const Solid: Story = {};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const Link: Story = {
  args: { variant: 'link', label: 'Saiba mais' },
};

export const Loading: Story = {
  args: { loading: true, label: 'Enviando...' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllColors: Story = {
  render: (args) => html`
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      ${colors.map((color) => html`<scarlet-button color=${color} variant=${args.variant}>${color}</scarlet-button>`)}
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
      <scarlet-button size="xs">xs</scarlet-button>
      <scarlet-button size="sm">sm</scarlet-button>
      <scarlet-button size="md">md</scarlet-button>
      <scarlet-button size="lg">lg</scarlet-button>
      <scarlet-button size="xl">xl</scarlet-button>
    </div>
  `,
};

export const WithIcon: Story = {
  name: 'Com ícone (início e fim)',
  render: () => html`
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <scarlet-button variant="solid" color="primary">
        <scarlet-icon slot="start" name="check"></scarlet-icon>
        Salvar
      </scarlet-button>
      <scarlet-button variant="outline" color="primary">
        Próximo
        <scarlet-icon slot="end" name="arrow-right"></scarlet-icon>
      </scarlet-button>
    </div>
  `,
};

export const IconOnly: Story = {
  name: 'Somente ícone',
  render: () => html`
    <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
      <scarlet-button variant="ghost" color="neutral" size="xs" icon-only aria-label="Fechar">
        <scarlet-icon name="x"></scarlet-icon>
      </scarlet-button>
      <scarlet-button variant="ghost" color="neutral" size="sm" icon-only aria-label="Editar">
        <scarlet-icon name="pencil"></scarlet-icon>
      </scarlet-button>
      <scarlet-button variant="solid" color="primary" size="md" icon-only aria-label="Adicionar">
        <scarlet-icon name="plus"></scarlet-icon>
      </scarlet-button>
      <scarlet-button variant="outline" color="error" size="lg" icon-only aria-label="Excluir">
        <scarlet-icon name="trash"></scarlet-icon>
      </scarlet-button>
    </div>
  `,
};
