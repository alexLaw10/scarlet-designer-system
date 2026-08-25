import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletInputDateArgs {
  label: string;
  helperText: string;
  errorMessage: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
  validate: boolean;
}

const meta: Meta<ScarletInputDateArgs> = {
  title: 'Components/Inputs especiais/Data',
  component: 'scarlet-input-date',
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
    label: 'Data de nascimento',
    helperText: '',
    errorMessage: '',
    invalid: false,
    disabled: false,
    required: false,
    validate: true,
  },
  render: (args) => html`
    <scarlet-input-date
      label=${args.label}
      helper-text=${args.helperText}
      error-message=${args.errorMessage}
      ?invalid=${args.invalid}
      ?disabled=${args.disabled}
      ?required=${args.required}
      ?validate=${args.validate}
    ></scarlet-input-date>
  `,
};

export default meta;
type Story = StoryObj<ScarletInputDateArgs>;

export const Default: Story = {};

export const WithError: Story = {
  args: { errorMessage: 'Data inválida.', invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
