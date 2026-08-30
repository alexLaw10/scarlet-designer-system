import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletCardArgs {
  variant: 'elevated' | 'outlined' | 'flat';
  padding: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  interactive: boolean;
}

const meta: Meta<ScarletCardArgs> = {
  title: 'Components/Card',
  component: 'scarlet-card',
  argTypes: {
    variant: { control: 'select', options: ['elevated', 'outlined', 'flat'] },
    padding: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    interactive: { control: 'boolean' },
  },
  args: {
    variant: 'elevated',
    padding: 'md',
    interactive: false,
  },
  render: (args) => html`
    <scarlet-card variant=${args.variant} padding=${args.padding} ?interactive=${args.interactive} style="max-width: 320px;">
      <span slot="header" style="font-weight: 600;">Título do card</span>
      <p style="margin: 0;">Conteúdo do card, com qualquer markup que o consumidor quiser passar.</p>
      <span slot="footer">
        <scarlet-button size="sm">Ação</scarlet-button>
      </span>
    </scarlet-card>
  `,
};

export default meta;
type Story = StoryObj<ScarletCardArgs>;

export const Elevated: Story = {};

export const Outlined: Story = {
  args: { variant: 'outlined' },
};

export const Flat: Story = {
  args: { variant: 'flat' },
};

export const Interactive: Story = {
  args: { interactive: true },
};

export const BodyOnly: Story = {
  render: (args) => html`
    <scarlet-card variant=${args.variant} padding=${args.padding} style="max-width: 320px;">
      <p style="margin: 0;">Card sem header nem footer, só o corpo.</p>
    </scarlet-card>
  `,
};
