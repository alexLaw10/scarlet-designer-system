import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletProgressArgs {
  value: number;
  max: number;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size: 'sm' | 'md' | 'lg';
  showLabel: boolean;
}

const meta: Meta<ScarletProgressArgs> = {
  title: 'Components/Feedback/Progress',
  component: 'scarlet-progress',
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    max: { control: 'number' },
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    showLabel: { control: 'boolean' },
  },
  args: {
    value: 62,
    max: 100,
    color: 'primary',
    size: 'md',
    showLabel: true,
  },
  render: (args) => html`
    <div style="max-width: 320px;">
      <scarlet-progress value=${args.value} max=${args.max} color=${args.color} size=${args.size} ?show-label=${args.showLabel}></scarlet-progress>
    </div>
  `,
};

export default meta;
type Story = StoryObj<ScarletProgressArgs>;

export const Default: Story = {};

export const Complete: Story = {
  args: { value: 100 },
};

export const NoLabel: Story = {
  args: { showLabel: false },
};
