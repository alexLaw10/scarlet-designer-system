import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletDateRangePickerArgs {
  label: string;
  helperText: string;
  errorMessage: string;
  invalid: boolean;
  disabled: boolean;
  min: string;
  max: string;
}

const meta: Meta<ScarletDateRangePickerArgs> = {
  title: 'Components/Inputs especiais/Seletor de intervalo de datas',
  component: 'scarlet-date-range-picker',
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    min: { control: 'text' },
    max: { control: 'text' },
  },
  args: {
    label: 'Período da reserva',
    helperText: '',
    errorMessage: '',
    invalid: false,
    disabled: false,
    min: '',
    max: '',
  },
  render: (args) => html`
    <scarlet-date-range-picker
      label=${args.label}
      helper-text=${args.helperText}
      error-message=${args.errorMessage}
      ?invalid=${args.invalid}
      ?disabled=${args.disabled}
      min=${args.min}
      max=${args.max}
    ></scarlet-date-range-picker>
  `,
};

export default meta;
type Story = StoryObj<ScarletDateRangePickerArgs>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: { helperText: 'Selecione a data de check-in e check-out.' },
};

export const WithError: Story = {
  args: { errorMessage: 'Período inválido.', invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
