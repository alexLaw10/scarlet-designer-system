import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletRadioArgs {
  label: string;
  checked: boolean;
  disabled: boolean;
}

const meta: Meta<ScarletRadioArgs> = {
  title: 'Components/Radio/Radio (standalone)',
  component: 'scarlet-radio',
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Opção A',
    checked: false,
    disabled: false,
  },
  render: (args) => html`
    <scarlet-radio value="a" label=${args.label} ?checked=${args.checked} ?disabled=${args.disabled}></scarlet-radio>
  `,
};

export default meta;
type Story = StoryObj<ScarletRadioArgs>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
