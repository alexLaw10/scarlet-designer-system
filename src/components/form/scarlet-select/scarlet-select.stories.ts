import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { ScarletSelectOption } from './scarlet-select';

interface ScarletSelectArgs {
  label: string;
  placeholder: string;
  helperText: string;
  errorMessage: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
}

const options: ScarletSelectOption[] = [
  { label: 'São Paulo', value: 'sp' },
  { label: 'Rio de Janeiro', value: 'rj' },
  { label: 'Minas Gerais', value: 'mg' },
  { label: 'Indisponível', value: 'xx', disabled: true },
];

const meta: Meta<ScarletSelectArgs> = {
  title: 'Components/Select',
  component: 'scarlet-select',
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Estado',
    placeholder: 'Selecione um estado',
    helperText: '',
    errorMessage: '',
    invalid: false,
    disabled: false,
    required: false,
  },
  render: (args) => html`
    <scarlet-select
      label=${args.label}
      placeholder=${args.placeholder}
      helper-text=${args.helperText}
      error-message=${args.errorMessage}
      .options=${options}
      ?invalid=${args.invalid}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></scarlet-select>
  `,
};

export default meta;
type Story = StoryObj<ScarletSelectArgs>;

export const Default: Story = {};

export const WithError: Story = {
  args: { errorMessage: 'Selecione um estado.', invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
