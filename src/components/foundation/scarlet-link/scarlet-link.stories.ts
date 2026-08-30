import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletLinkArgs {
  href: string;
  target: string;
  underline: 'always' | 'hover' | 'none';
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  disabled: boolean;
}

const meta: Meta<ScarletLinkArgs> = {
  title: 'Components/Foundation/Link',
  component: 'scarlet-link',
  argTypes: {
    href: { control: 'text' },
    target: { control: 'text' },
    underline: { control: 'select', options: ['always', 'hover', 'none'] },
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
    disabled: { control: 'boolean' },
  },
  args: {
    href: '#',
    target: '',
    underline: 'hover',
    color: 'primary',
    disabled: false,
  },
  render: (args) => html`
    <p>
      Este é um parágrafo de exemplo com um
      <scarlet-link href=${args.href} target=${args.target || undefined} underline=${args.underline} color=${args.color} ?disabled=${args.disabled}
        >link inline</scarlet-link
      >
      no meio do texto.
    </p>
  `,
};

export default meta;
type Story = StoryObj<ScarletLinkArgs>;

export const Default: Story = {};

export const External: Story = {
  args: { target: '_blank', href: 'https://example.com' },
};

export const AlwaysUnderlined: Story = {
  args: { underline: 'always' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
