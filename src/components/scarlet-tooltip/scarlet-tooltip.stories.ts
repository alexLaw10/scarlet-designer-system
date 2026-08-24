import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletTooltipArgs {
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  disabled: boolean;
}

const meta: Meta<ScarletTooltipArgs> = {
  title: 'Components/Tooltip',
  component: 'scarlet-tooltip',
  argTypes: {
    content: { control: 'text' },
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    disabled: { control: 'boolean' },
  },
  args: {
    content: 'Essa é uma dica contextual',
    placement: 'top',
    disabled: false,
  },
  render: (args) => html`
    <div style="padding: 80px; display: flex; justify-content: center;">
      <scarlet-tooltip content=${args.content} placement=${args.placement} ?disabled=${args.disabled}>
        <scarlet-button variant="outline">Passe o mouse aqui</scarlet-button>
      </scarlet-tooltip>
    </div>
  `,
};

export default meta;
type Story = StoryObj<ScarletTooltipArgs>;

export const Top: Story = {};

export const Bottom: Story = {
  args: { placement: 'bottom' },
};

export const Left: Story = {
  args: { placement: 'left' },
};

export const Right: Story = {
  args: { placement: 'right' },
};
