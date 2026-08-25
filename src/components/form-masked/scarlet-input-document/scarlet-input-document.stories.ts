import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletInputDocumentArgs {
  label: string;
  helperText: string;
  errorMessage: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
  validate: boolean;
}

const meta: Meta<ScarletInputDocumentArgs> = {
  title: 'Components/Inputs especiais/Documento (CPF ou CNPJ)',
  component: 'scarlet-input-document',
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    validate: { control: 'boolean' },
  },
  args: {
    label: 'CPF ou CNPJ',
    helperText: '',
    errorMessage: '',
    invalid: false,
    disabled: false,
    required: false,
    validate: true,
  },
  render: (args) => html`
    <scarlet-input-document
      label=${args.label}
      helper-text=${args.helperText}
      error-message=${args.errorMessage}
      ?invalid=${args.invalid}
      ?disabled=${args.disabled}
      ?required=${args.required}
      ?validate=${args.validate}
    ></scarlet-input-document>
  `,
};

export default meta;
type Story = StoryObj<ScarletInputDocumentArgs>;

export const Default: Story = {
  render: (args) => html`
    <div>
      <scarlet-input-document
        label=${args.label}
        helper-text="Digite um CPF (11) ou CNPJ (14) — a máscara troca sozinha, e sai do campo pra ver a validação do dígito verificador."
        ?validate=${args.validate}
      ></scarlet-input-document>
    </div>
  `,
};

export const InvalidExample: Story = {
  args: { errorMessage: 'CPF inválido.', invalid: true },
};

export const WithoutValidation: Story = {
  args: { validate: false, helperText: 'Só formata, não valida o dígito verificador.' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
