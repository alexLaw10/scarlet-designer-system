import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletInputPercentageArgs {
  label: string;
  helperText: string;
  errorMessage: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
}

const meta: Meta<ScarletInputPercentageArgs> = {
  title: 'Components/Inputs especiais/Porcentagem',
  component: 'scarlet-input-percentage',
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Desconto',
    helperText: '',
    errorMessage: '',
    invalid: false,
    disabled: false,
    required: false,
  },
  render: (args) => html`
    <scarlet-input-percentage
      label=${args.label}
      helper-text=${args.helperText}
      error-message=${args.errorMessage}
      ?invalid=${args.invalid}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></scarlet-input-percentage>
  `,
};

export default meta;
type Story = StoryObj<ScarletInputPercentageArgs>;

export const Default: Story = {};

export const WithError: Story = {
  args: { errorMessage: 'O desconto máximo é 50%.', invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
