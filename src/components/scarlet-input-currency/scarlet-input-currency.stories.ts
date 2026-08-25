import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletInputCurrencyArgs {
  label: string;
  currencySymbol: string;
  helperText: string;
  errorMessage: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
}

const meta: Meta<ScarletInputCurrencyArgs> = {
  title: 'Components/Inputs especiais/Monetário',
  component: 'scarlet-input-currency',
  argTypes: {
    label: { control: 'text' },
    currencySymbol: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Valor',
    currencySymbol: 'R$',
    helperText: '',
    errorMessage: '',
    invalid: false,
    disabled: false,
    required: false,
  },
  render: (args) => html`
    <scarlet-input-currency
      label=${args.label}
      currency-symbol=${args.currencySymbol}
      helper-text=${args.helperText}
      error-message=${args.errorMessage}
      ?invalid=${args.invalid}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></scarlet-input-currency>
  `,
};

export default meta;
type Story = StoryObj<ScarletInputCurrencyArgs>;

export const Default: Story = {
  args: { helperText: 'Digite só números — a formatação preenche da direita pra esquerda.' },
};

export const WithError: Story = {
  args: { errorMessage: 'Valor mínimo de R$ 10,00.', invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
