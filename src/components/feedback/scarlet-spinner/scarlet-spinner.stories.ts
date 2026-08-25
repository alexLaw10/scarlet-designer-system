import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletSpinnerArgs {
  variant: 'circle' | 'logo';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  label: string;
}

const meta: Meta<ScarletSpinnerArgs> = {
  title: 'Components/Feedback/Spinner',
  component: 'scarlet-spinner',
  argTypes: {
    variant: { control: 'select', options: ['circle', 'logo'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    label: { control: 'text' },
  },
  args: {
    variant: 'circle',
    size: 'md',
    label: 'Carregando',
  },
  render: (args) => html`<scarlet-spinner variant=${args.variant} size=${args.size} label=${args.label}></scarlet-spinner>`,
};

export default meta;
type Story = StoryObj<ScarletSpinnerArgs>;

export const Circle: Story = {};

export const Logo: Story = {
  args: { variant: 'logo', size: 'lg' },
};

export const AllSizes: Story = {
  render: (args) => html`
    <div style="display: flex; align-items: center; gap: 16px;">
      <scarlet-spinner variant=${args.variant} size="xs"></scarlet-spinner>
      <scarlet-spinner variant=${args.variant} size="sm"></scarlet-spinner>
      <scarlet-spinner variant=${args.variant} size="md"></scarlet-spinner>
      <scarlet-spinner variant=${args.variant} size="lg"></scarlet-spinner>
      <scarlet-spinner variant=${args.variant} size="xl"></scarlet-spinner>
    </div>
  `,
};

export const FullPageLogo: Story = {
  name: 'Página inteira (logo)',
  render: () => html`
    <div
      style="display: flex; align-items: center; justify-content: center; height: 240px; background: #ec3013; border-radius: 8px;"
    >
      <scarlet-spinner variant="logo" size="xl" label="Carregando aplicação"></scarlet-spinner>
    </div>
  `,
};
