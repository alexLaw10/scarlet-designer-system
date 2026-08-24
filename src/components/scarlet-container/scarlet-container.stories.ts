import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletContainerArgs {
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding: boolean;
}

const meta: Meta<ScarletContainerArgs> = {
  title: 'Components/Layout/Container',
  component: 'scarlet-container',
  argTypes: {
    maxWidth: { control: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'] },
    padding: { control: 'boolean' },
  },
  args: {
    maxWidth: 'md',
    padding: true,
  },
  render: (args) => html`
    <div style="background: var(--scarlet-color-background-secondary, #f1f5f9);">
      <scarlet-container max-width=${args.maxWidth} ?padding=${args.padding}>
        <div style="background: var(--scarlet-color-primary-100, #e0f2fe); padding: 24px; border-radius: 6px;">
          Conteúdo centralizado, com largura máxima de "${args.maxWidth}".
        </div>
      </scarlet-container>
    </div>
  `,
};

export default meta;
type Story = StoryObj<ScarletContainerArgs>;

export const Default: Story = {};

export const Small: Story = {
  args: { maxWidth: 'sm' },
};

export const Full: Story = {
  args: { maxWidth: 'full' },
};
