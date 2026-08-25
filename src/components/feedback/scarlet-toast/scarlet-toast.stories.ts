import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletToastArgs {
  status: 'success' | 'warning' | 'error' | 'info';
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  duration: number;
  dismissible: boolean;
  message: string;
}

const meta: Meta<ScarletToastArgs> = {
  title: 'Components/Toast',
  component: 'scarlet-toast',
  argTypes: {
    status: { control: 'select', options: ['success', 'warning', 'error', 'info'] },
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'],
    },
    duration: { control: 'number' },
    dismissible: { control: 'boolean' },
    message: { control: 'text' },
  },
  args: {
    status: 'success',
    position: 'bottom-right',
    duration: 0,
    dismissible: true,
    message: 'Alterações salvas com sucesso.',
  },
  render: (args) => html`
    <div style="position: relative; height: 240px; border: 1px dashed var(--scarlet-color-border-primary, #cbd5e1);">
      <scarlet-toast status=${args.status} position=${args.position} duration=${args.duration} ?dismissible=${args.dismissible}>
        ${args.message}
      </scarlet-toast>
    </div>
  `,
};

export default meta;
type Story = StoryObj<ScarletToastArgs>;

export const Success: Story = {};

export const Error: Story = {
  args: { status: 'error', message: 'Não foi possível salvar as alterações.' },
};

export const AutoDismiss: Story = {
  args: { duration: 3000 },
};
