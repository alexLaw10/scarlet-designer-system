import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletCopyArgs {
  value: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled: boolean;
}

const meta: Meta<ScarletCopyArgs> = {
  title: 'Components/Actions/Copy',
  component: 'scarlet-copy',
  argTypes: {
    value: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    disabled: { control: 'boolean' },
  },
  args: {
    value: 'npm install @scarlet/design-system',
    size: 'md',
    disabled: false,
  },
  render: (args) => html`
    <scarlet-copy value=${args.value} size=${args.size} ?disabled=${args.disabled}></scarlet-copy>
  `,
};

export default meta;
type Story = StoryObj<ScarletCopyArgs>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 12px;">
      <scarlet-copy value="xs" size="xs"></scarlet-copy>
      <scarlet-copy value="sm" size="sm"></scarlet-copy>
      <scarlet-copy value="md" size="md"></scarlet-copy>
      <scarlet-copy value="lg" size="lg"></scarlet-copy>
      <scarlet-copy value="xl" size="xl"></scarlet-copy>
    </div>
  `,
};

export const NextToCode: Story = {
  name: 'Ao lado de um bloco de código',
  render: () => html`
    <div
      style="display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: var(--scarlet-color-neutral-900, #171717); border-radius: 8px; font-family: monospace; color: var(--scarlet-color-neutral-50, #fafafa);"
    >
      <code style="flex: 1;">npm install @scarlet/design-system</code>
      <scarlet-copy value="npm install @scarlet/design-system" size="sm"></scarlet-copy>
    </div>
  `,
};

export const Disabled: Story = {
  args: { disabled: true },
};
