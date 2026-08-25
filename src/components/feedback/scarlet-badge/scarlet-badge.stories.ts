import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletBadgeArgs {
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  variant: 'solid' | 'outline' | 'soft';
  size: 'xs' | 'sm' | 'md';
  dot: boolean;
  label: string;
}

const colors: ScarletBadgeArgs['color'][] = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'];

const meta: Meta<ScarletBadgeArgs> = {
  title: 'Components/Badge',
  component: 'scarlet-badge',
  argTypes: {
    color: { control: 'select', options: colors },
    variant: { control: 'select', options: ['solid', 'outline', 'soft'] },
    size: { control: 'select', options: ['xs', 'sm', 'md'] },
    dot: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    color: 'primary',
    variant: 'solid',
    size: 'sm',
    dot: false,
    label: 'Novo',
  },
  render: (args) => html`
    <scarlet-badge color=${args.color} variant=${args.variant} size=${args.size} ?dot=${args.dot}>${args.label}</scarlet-badge>
  `,
};

export default meta;
type Story = StoryObj<ScarletBadgeArgs>;

export const Solid: Story = {};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const Soft: Story = {
  args: { variant: 'soft' },
};

export const Dot: Story = {
  args: { dot: true, color: 'error' },
};

export const AllColors: Story = {
  render: (args) => html`
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      ${colors.map((color) => html`<scarlet-badge color=${color} variant=${args.variant}>${color}</scarlet-badge>`)}
    </div>
  `,
};
