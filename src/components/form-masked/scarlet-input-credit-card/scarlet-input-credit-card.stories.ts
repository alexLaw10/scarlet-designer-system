import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletInputCreditCardArgs {
  label: string;
  helperText: string;
  errorMessage: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
}

const meta: Meta<ScarletInputCreditCardArgs> = {
  title: 'Components/Inputs especiais/Cartão de crédito',
  component: 'scarlet-input-credit-card',
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Número do cartão',
    helperText: '',
    errorMessage: '',
    invalid: false,
    disabled: false,
    required: false,
  },
  render: (args) => html`
    <scarlet-input-credit-card
      label=${args.label}
      helper-text=${args.helperText}
      error-message=${args.errorMessage}
      ?invalid=${args.invalid}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></scarlet-input-credit-card>
  `,
};

export default meta;
type Story = StoryObj<ScarletInputCreditCardArgs>;

export const Default: Story = {
  render: () => html`
    <scarlet-input-credit-card label="Número do cartão" value="4111 1111 1111" helper-text="Experimente 4... (Visa), 5... (Mastercard) ou 34.../37... (Amex)."></scarlet-input-credit-card>
  `,
};

export const WithError: Story = {
  args: { errorMessage: 'Número de cartão inválido.', invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
