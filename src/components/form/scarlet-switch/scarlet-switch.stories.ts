import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletSwitchArgs {
  label: string;
  checked: boolean;
  disabled: boolean;
}

const meta: Meta<ScarletSwitchArgs> = {
  title: 'Components/Switch',
  component: 'scarlet-switch',
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Notificações por e-mail',
    checked: false,
    disabled: false,
  },
  render: (args) => html`
    <scarlet-switch label=${args.label} ?checked=${args.checked} ?disabled=${args.disabled}></scarlet-switch>
  `,
};

export default meta;
type Story = StoryObj<ScarletSwitchArgs>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
