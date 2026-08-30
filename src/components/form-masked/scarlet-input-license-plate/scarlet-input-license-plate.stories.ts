import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletInputLicensePlateArgs {
  label: string;
  helperText: string;
  errorMessage: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
}

const meta: Meta<ScarletInputLicensePlateArgs> = {
  title: 'Components/Inputs especiais/Placa de veículo',
  component: 'scarlet-input-license-plate',
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Placa',
    helperText: '',
    errorMessage: '',
    invalid: false,
    disabled: false,
    required: false,
  },
  render: (args) => html`
    <scarlet-input-license-plate
      label=${args.label}
      helper-text=${args.helperText}
      error-message=${args.errorMessage}
      ?invalid=${args.invalid}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></scarlet-input-license-plate>
  `,
};

export default meta;
type Story = StoryObj<ScarletInputLicensePlateArgs>;

export const Default: Story = {
  args: { helperText: 'Aceita formato antigo (ABC-1234) ou Mercosul (ABC1D23).' },
};

export const WithError: Story = {
  args: { errorMessage: 'Placa inválida.', invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
