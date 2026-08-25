import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletInputPhoneArgs {
  label: string;
  helperText: string;
  errorMessage: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
}

const meta: Meta<ScarletInputPhoneArgs> = {
  title: 'Components/Inputs especiais/Telefone',
  component: 'scarlet-input-phone',
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Telefone',
    helperText: '',
    errorMessage: '',
    invalid: false,
    disabled: false,
    required: false,
  },
  render: (args) => html`
    <scarlet-input-phone
      label=${args.label}
      helper-text=${args.helperText}
      error-message=${args.errorMessage}
      ?invalid=${args.invalid}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></scarlet-input-phone>
  `,
};

export default meta;
type Story = StoryObj<ScarletInputPhoneArgs>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: { helperText: 'Informe o DDD junto com o número.' },
};

export const WithError: Story = {
  args: { errorMessage: 'Telefone inválido.', invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
