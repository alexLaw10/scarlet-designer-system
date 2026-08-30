import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletDatePickerArgs {
  label: string;
  helperText: string;
  errorMessage: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
  validate: boolean;
  min: string;
  max: string;
}

const meta: Meta<ScarletDatePickerArgs> = {
  title: 'Components/Inputs especiais/Seletor de data',
  component: 'scarlet-date-picker',
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    validate: { control: 'boolean' },
    min: { control: 'text' },
    max: { control: 'text' },
  },
  args: {
    label: 'Data de nascimento',
    helperText: '',
    errorMessage: '',
    invalid: false,
    disabled: false,
    required: false,
    validate: true,
    min: '',
    max: '',
  },
  render: (args) => html`
    <scarlet-date-picker
      label=${args.label}
      helper-text=${args.helperText}
      error-message=${args.errorMessage}
      ?invalid=${args.invalid}
      ?disabled=${args.disabled}
      ?required=${args.required}
      ?validate=${args.validate}
      min=${args.min}
      max=${args.max}
    ></scarlet-date-picker>
  `,
};

export default meta;
type Story = StoryObj<ScarletDatePickerArgs>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: { helperText: 'Use o ícone de calendário ou digite no formato DD/MM/AAAA.' },
};

export const WithMinMax: Story = {
  name: 'Com intervalo permitido',
  args: {
    label: 'Data da consulta',
    min: '01/01/2026',
    max: '31/12/2026',
    helperText: 'Apenas datas de 2026 podem ser selecionadas.',
  },
};

export const WithError: Story = {
  args: { errorMessage: 'Data inválida.', invalid: true },
};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
