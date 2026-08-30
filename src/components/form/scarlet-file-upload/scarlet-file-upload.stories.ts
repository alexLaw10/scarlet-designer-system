import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletFileUploadArgs {
  label: string;
  helperText: string;
  errorMessage: string;
  multiple: boolean;
  disabled: boolean;
}

const meta: Meta<ScarletFileUploadArgs> = {
  title: 'Components/Form/File Upload',
  component: 'scarlet-file-upload',
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Currículo',
    helperText: 'PDF ou DOCX, até 5 MB.',
    errorMessage: '',
    multiple: false,
    disabled: false,
  },
  render: (args) => html`
    <scarlet-file-upload
      label=${args.label}
      helper-text=${args.helperText}
      error-message=${args.errorMessage}
      ?multiple=${args.multiple}
      ?disabled=${args.disabled}
    ></scarlet-file-upload>
  `,
};

export default meta;
type Story = StoryObj<ScarletFileUploadArgs>;

export const Default: Story = {};

export const Multiple: Story = {
  args: { label: 'Anexos', multiple: true, helperText: 'Você pode anexar mais de um arquivo.' },
};

export const WithError: Story = {
  args: { errorMessage: 'Arquivo obrigatório.' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
