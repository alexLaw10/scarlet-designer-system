import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletNumberInputArgs {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
}

const meta: Meta<ScarletNumberInputArgs> = {
  title: 'Components/Form/Number Input',
  component: 'scarlet-number-input',
  argTypes: {
    label: { control: 'text' },
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Quantidade',
    value: 1,
    min: 0,
    max: 10,
    step: 1,
    disabled: false,
  },
  render: (args) => html`
    <scarlet-number-input
      label=${args.label}
      value=${args.value}
      min=${args.min}
      max=${args.max}
      step=${args.step}
      ?disabled=${args.disabled}
    ></scarlet-number-input>
  `,
};

export default meta;
type Story = StoryObj<ScarletNumberInputArgs>;

export const Default: Story = {};

export const AtMinimum: Story = {
  args: { value: 0 },
};

export const Disabled: Story = {
  args: { disabled: true },
};
