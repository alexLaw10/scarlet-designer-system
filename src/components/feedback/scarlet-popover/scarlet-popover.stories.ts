import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletPopoverArgs {
  placement: 'top' | 'bottom' | 'left' | 'right';
  triggerMode: 'click' | 'hover';
}

const meta: Meta<ScarletPopoverArgs> = {
  title: 'Components/Feedback/Popover',
  component: 'scarlet-popover',
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    triggerMode: { control: 'select', options: ['click', 'hover'] },
  },
  args: {
    placement: 'bottom',
    triggerMode: 'click',
  },
  render: (args) => html`
    <scarlet-popover placement=${args.placement} trigger-mode=${args.triggerMode} aria-label="Detalhes">
      <scarlet-button slot="trigger" variant="outline">Mostrar detalhes</scarlet-button>
      <div style="max-width: 240px;">
        <p style="margin: 0 0 8px; font-weight: 600;">Detalhes do pedido</p>
        <p style="margin: 0;">Conteúdo de exemplo dentro do popover — pode ser qualquer coisa, texto, formulário, lista.</p>
      </div>
    </scarlet-popover>
  `,
};

export default meta;
type Story = StoryObj<ScarletPopoverArgs>;

export const Click: Story = {};

export const Hover: Story = {
  args: { triggerMode: 'hover' },
};

export const RightPlacement: Story = {
  args: { placement: 'right' },
};
