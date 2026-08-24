import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletTextArgs {
  as: 'p' | 'span' | 'div' | 'label';
  variant: 'body-lg' | 'body-md' | 'body-sm' | 'caption';
  color: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'disabled';
  align: 'left' | 'center' | 'right';
  weight: string;
  truncate: boolean;
  text: string;
}

const meta: Meta<ScarletTextArgs> = {
  title: 'Components/Typography/Text',
  component: 'scarlet-text',
  argTypes: {
    as: { control: 'select', options: ['p', 'span', 'div', 'label'] },
    variant: { control: 'select', options: ['body-lg', 'body-md', 'body-sm', 'caption'] },
    color: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'inverse', 'disabled'] },
    align: { control: 'select', options: ['left', 'center', 'right'] },
    weight: { control: 'select', options: ['', 'normal', 'medium', 'semibold', 'bold'] },
    truncate: { control: 'boolean' },
    text: { control: 'text' },
  },
  args: {
    as: 'p',
    variant: 'body-md',
    color: 'primary',
    align: 'left',
    weight: '',
    truncate: false,
    text: 'Este é um texto de exemplo do design system, usando a escala tipográfica de tokens.',
  },
  render: (args) => html`
    <div style="max-width: ${args.truncate ? '240px' : 'none'};">
      <scarlet-text as=${args.as} variant=${args.variant} color=${args.color} align=${args.align} weight=${args.weight || undefined} ?truncate=${args.truncate}>
        ${args.text}
      </scarlet-text>
    </div>
  `,
};

export default meta;
type Story = StoryObj<ScarletTextArgs>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <scarlet-text variant="body-lg">Body large</scarlet-text>
      <scarlet-text variant="body-md">Body medium</scarlet-text>
      <scarlet-text variant="body-sm">Body small</scarlet-text>
      <scarlet-text variant="caption">Caption</scarlet-text>
    </div>
  `,
};

export const Truncated: Story = {
  args: { truncate: true, text: 'Um texto bem longo que certamente não vai caber no espaço disponível e vai truncar.' },
};
