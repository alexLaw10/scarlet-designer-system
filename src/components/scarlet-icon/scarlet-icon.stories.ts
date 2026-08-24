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
    <table style="border-collapse: collapse; width: 100%; max-width: 560px; font-family: sans-serif; font-size: 13px;">
      <thead>
        <tr>
          <th style="text-align: left; padding: 8px 16px 8px 4px; border-bottom: 2px solid #e2e8f0; color: #64748b;">Ícone</th>
          <th style="text-align: left; padding: 8px 16px 8px 4px; border-bottom: 2px solid #e2e8f0; color: #64748b;">Nome</th>
          <th style="text-align: left; padding: 8px 4px; border-bottom: 2px solid #e2e8f0; color: #64748b;">Uso</th>
        </tr>
      </thead>
      <tbody>
        ${scarletIconNames.map(
          (name) => html`
            <tr>
              <td style="padding: 8px 16px 8px 4px; border-bottom: 1px solid #e2e8f0; font-size: 20px;">
                <scarlet-icon name=${name}></scarlet-icon>
              </td>
              <td style="padding: 8px 16px 8px 4px; border-bottom: 1px solid #e2e8f0;">
                <code>${name}</code>
              </td>
              <td style="padding: 8px 4px; border-bottom: 1px solid #e2e8f0; color: #64748b; white-space: nowrap;">
                <code>&lt;scarlet-icon name="${name}"&gt;</code>
              </td>
            </tr>
          `,
        )}
      </tbody>
    </table>
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
