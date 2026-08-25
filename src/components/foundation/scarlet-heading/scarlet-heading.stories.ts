import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletHeadingArgs {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  variant: string;
  color: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'disabled';
  align: 'left' | 'center' | 'right';
  text: string;
}

const meta: Meta<ScarletHeadingArgs> = {
  title: 'Components/Typography/Heading',
  component: 'scarlet-heading',
  argTypes: {
    level: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
    variant: {
      control: 'select',
      options: [
        '',
        'display-2xl',
        'display-xl',
        'display-lg',
        'display-md',
        'display-sm',
        'heading-xl',
        'heading-lg',
        'heading-md',
        'heading-sm',
      ],
    },
    color: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'inverse', 'disabled'] },
    align: { control: 'select', options: ['left', 'center', 'right'] },
    text: { control: 'text' },
  },
  args: {
    level: 2,
    variant: '',
    color: 'primary',
    align: 'left',
    text: 'Título de exemplo',
  },
  render: (args) => html`
    <scarlet-heading level=${args.level} variant=${args.variant || undefined} color=${args.color} align=${args.align}>
      ${args.text}
    </scarlet-heading>
  `,
};

export default meta;
type Story = StoryObj<ScarletHeadingArgs>;

export const Default: Story = {};

export const AllLevels: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <scarlet-heading level="1">Heading nível 1</scarlet-heading>
      <scarlet-heading level="2">Heading nível 2</scarlet-heading>
      <scarlet-heading level="3">Heading nível 3</scarlet-heading>
      <scarlet-heading level="4">Heading nível 4</scarlet-heading>
      <scarlet-heading level="5">Heading nível 5</scarlet-heading>
      <scarlet-heading level="6">Heading nível 6</scarlet-heading>
    </div>
  `,
};

export const VisualSizeIndependentOfLevel: Story = {
  render: () => html`
    <!-- h1 semântico, mas com o tamanho visual de um heading-sm -->
    <scarlet-heading level="1" variant="heading-sm">Título de seção pequeno, mas ainda h1</scarlet-heading>
  `,
};
