import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletAlertArgs {
  status: 'success' | 'warning' | 'error' | 'info';
  variant: 'solid' | 'outline' | 'soft';
  icon: boolean;
  dismissible: boolean;
  title: string;
  message: string;
}

const statuses: ScarletAlertArgs['status'][] = ['success', 'warning', 'error', 'info'];

const meta: Meta<ScarletAlertArgs> = {
  title: 'Components/Alert',
  component: 'scarlet-alert',
  argTypes: {
    status: { control: 'select', options: statuses },
    variant: { control: 'select', options: ['solid', 'outline', 'soft'] },
    icon: { control: 'boolean' },
    dismissible: { control: 'boolean' },
    title: { control: 'text' },
    message: { control: 'text' },
  },
  args: {
    status: 'info',
    variant: 'soft',
    icon: true,
    dismissible: false,
    title: '',
    message: 'Esta é uma mensagem de alerta.',
  },
  render: (args) => html`
    <scarlet-alert status=${args.status} variant=${args.variant} ?icon=${args.icon} ?dismissible=${args.dismissible}>
      ${args.title ? html`<span slot="title">${args.title}</span>` : null}
      ${args.message}
    </scarlet-alert>
  `,
};

export default meta;
type Story = StoryObj<ScarletAlertArgs>;

export const Info: Story = {};

export const Success: Story = {
  args: { status: 'success', title: 'Sucesso', message: 'Sua alteração foi salva.' },
};

export const Warning: Story = {
  args: { status: 'warning', title: 'Atenção', message: 'Confira os dados antes de continuar.' },
};

export const Error: Story = {
  args: { status: 'error', title: 'Erro', message: 'Não foi possível concluir a operação.' },
};

export const Dismissible: Story = {
  args: { dismissible: true },
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 480px;">
      ${statuses.map(
        (status) => html`
          <scarlet-alert status=${status} variant="soft">Alerta ${status} — variant soft</scarlet-alert>
          <scarlet-alert status=${status} variant="outline">Alerta ${status} — variant outline</scarlet-alert>
          <scarlet-alert status=${status} variant="solid">Alerta ${status} — variant solid</scarlet-alert>
        `,
      )}
    </div>
  `,
};
