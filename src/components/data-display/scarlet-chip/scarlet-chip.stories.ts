import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletChipArgs {
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  variant: 'solid' | 'outline' | 'soft';
  removable: boolean;
  disabled: boolean;
}

const meta: Meta<ScarletChipArgs> = {
  title: 'Components/Data Display/Chip',
  component: 'scarlet-chip',
  argTypes: {
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
    variant: { control: 'select', options: ['solid', 'outline', 'soft'] },
    removable: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    color: 'primary',
    variant: 'soft',
    removable: true,
    disabled: false,
  },
  render: (args) => html`
    <scarlet-chip color=${args.color} variant=${args.variant} ?removable=${args.removable} ?disabled=${args.disabled}>Etiqueta</scarlet-chip>
  `,
};

export default meta;
type Story = StoryObj<ScarletChipArgs>;

export const Default: Story = {};

export const AllColors: Story = {
  name: 'Todas as cores',
  render: () => html`
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      ${(['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] as const).map(
        (color) => html`<scarlet-chip color=${color} removable>${color}</scarlet-chip>`,
      )}
    </div>
  `,
};

export const NotRemovable: Story = {
  args: { removable: false },
};

export const Disabled: Story = {
  args: { disabled: true },
};
