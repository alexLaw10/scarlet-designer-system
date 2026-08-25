import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletInputCepArgs {
  label: string;
  helperText: string;
  errorMessage: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
}

const meta: Meta<ScarletInputCepArgs> = {
  title: 'Components/Inputs especiais/CEP',
  component: 'scarlet-input-cep',
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'CEP',
    helperText: '',
    errorMessage: '',
    invalid: false,
    disabled: false,
    required: false,
  },
  render: (args) => html`
    <scarlet-input-cep
      label=${args.label}
      helper-text=${args.helperText}
      error-message=${args.errorMessage}
      ?invalid=${args.invalid}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></scarlet-input-cep>
  `,
};

export default meta;
type Story = StoryObj<ScarletInputCepArgs>;

export const Default: Story = {};

export const WithError: Story = {
  args: { errorMessage: 'CEP não encontrado.', invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
