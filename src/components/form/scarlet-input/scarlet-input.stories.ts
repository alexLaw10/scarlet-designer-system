import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletInputArgs {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  label: string;
  placeholder: string;
  helperText: string;
  errorMessage: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const meta: Meta<ScarletInputArgs> = {
  title: 'Components/Input',
  component: 'scarlet-input',
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    type: 'text',
    label: 'Nome completo',
    placeholder: 'Digite seu nome',
    helperText: '',
    errorMessage: '',
    invalid: false,
    disabled: false,
    required: false,
    size: 'md',
  },
  render: (args) => html`
    <scarlet-input
      type=${args.type}
      label=${args.label}
      placeholder=${args.placeholder}
      helper-text=${args.helperText}
      error-message=${args.errorMessage}
      size=${args.size}
      ?invalid=${args.invalid}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></scarlet-input>
  `,
};

export default meta;
type Story = StoryObj<ScarletInputArgs>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: { helperText: 'Como aparece no seu documento.' },
};

export const WithError: Story = {
  args: { errorMessage: 'Este campo é obrigatório.', invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Required: Story = {
  args: { required: true },
};
