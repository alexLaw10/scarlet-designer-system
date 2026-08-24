import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { scarletIconNames } from './icons';

interface ScarletIconArgs {
  name: string;
  size: string;
  label: string;
}

const meta: Meta<ScarletIconArgs> = {
  title: 'Components/Icon',
  component: 'scarlet-icon',
  argTypes: {
    name: { control: 'select', options: scarletIconNames },
    size: { control: 'text' },
    label: { control: 'text' },
  },
  args: {
    name: 'check',
    size: '24px',
    label: '',
  },
  render: (args) => html` <scarlet-icon name=${args.name} size=${args.size} label=${args.label || undefined}></scarlet-icon> `,
};

export default meta;
type Story = StoryObj<ScarletIconArgs>;

export const Default: Story = {};

export const WithAccessibleLabel: Story = {
  args: { name: 'trash', label: 'Excluir item' },
};

export const AllIcons: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 16px; font-size: 24px; text-align: center;">
      ${scarletIconNames.map(
        (name) => html`
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <scarlet-icon name=${name}></scarlet-icon>
            <span style="font-size: 10px; font-family: sans-serif;">${name}</span>
          </div>
        `,
      )}
    </div>
  `,
};

export const CustomSlotted: Story = {
  render: () => html`
    <scarlet-icon size="32px">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="4" y="4" width="16" height="16" rx="3" />
      </svg>
    </scarlet-icon>
  `,
};
