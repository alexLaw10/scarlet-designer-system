import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletCheckboxArgs {
  label: string;
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
}

const meta: Meta<ScarletCheckboxArgs> = {
  title: 'Components/Checkbox',
  component: 'scarlet-checkbox',
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Aceito os termos de uso',
    checked: false,
    indeterminate: false,
    disabled: false,
  },
  render: (args) => html`
    <scarlet-checkbox label=${args.label} ?checked=${args.checked} ?indeterminate=${args.indeterminate} ?disabled=${args.disabled}></scarlet-checkbox>
  `,
};

export default meta;
type Story = StoryObj<ScarletCheckboxArgs>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
};
