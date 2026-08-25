import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletTextareaArgs {
  label: string;
  placeholder: string;
  helperText: string;
  errorMessage: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
  rows: number;
  resize: 'none' | 'vertical' | 'horizontal' | 'both';
}

const meta: Meta<ScarletTextareaArgs> = {
  title: 'Components/Textarea',
  component: 'scarlet-textarea',
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    rows: { control: 'number' },
    resize: { control: 'select', options: ['none', 'vertical', 'horizontal', 'both'] },
  },
  args: {
    label: 'Comentário',
    placeholder: 'Escreva aqui...',
    helperText: '',
    errorMessage: '',
    invalid: false,
    disabled: false,
    required: false,
    rows: 4,
    resize: 'vertical',
  },
  render: (args) => html`
    <scarlet-textarea
      label=${args.label}
      placeholder=${args.placeholder}
      helper-text=${args.helperText}
      error-message=${args.errorMessage}
      rows=${args.rows}
      resize=${args.resize}
      ?invalid=${args.invalid}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></scarlet-textarea>
  `,
};

export default meta;
type Story = StoryObj<ScarletTextareaArgs>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: { helperText: 'Máximo de 500 caracteres.' },
};

export const WithError: Story = {
  args: { errorMessage: 'Este campo é obrigatório.', invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
