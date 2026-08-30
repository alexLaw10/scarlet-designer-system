import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletDividerArgs {
  orientation: 'horizontal' | 'vertical';
  label: string;
}

const meta: Meta<ScarletDividerArgs> = {
  title: 'Components/Divider',
  component: 'scarlet-divider',
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    label: { control: 'text' },
  },
  args: {
    orientation: 'horizontal',
    label: '',
  },
  render: (args) =>
    args.orientation === 'vertical'
      ? html`
          <div style="display: flex; height: 60px; align-items: center;">
            <span>Esquerda</span>
            <scarlet-divider orientation="vertical"></scarlet-divider>
            <span>Direita</span>
          </div>
        `
      : html` <div style="max-width: 400px;"><scarlet-divider orientation="horizontal" label=${args.label}></scarlet-divider></div> `,
};

export default meta;
type Story = StoryObj<ScarletDividerArgs>;

export const Horizontal: Story = {};

export const WithLabel: Story = {
  args: { label: 'ou' },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};
