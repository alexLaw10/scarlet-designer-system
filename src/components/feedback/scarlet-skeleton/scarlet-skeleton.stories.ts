import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletSkeletonArgs {
  variant: 'text' | 'circle' | 'rect';
  lines: number;
  width: string;
  height: string;
}

const meta: Meta<ScarletSkeletonArgs> = {
  title: 'Components/Feedback/Skeleton',
  component: 'scarlet-skeleton',
  argTypes: {
    variant: { control: 'select', options: ['text', 'circle', 'rect'] },
    lines: { control: 'number' },
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: {
    variant: 'text',
    lines: 3,
    width: '',
    height: '',
  },
  render: (args) => html`
    <div style="max-width: 320px;">
      <scarlet-skeleton variant=${args.variant} lines=${args.lines} width=${args.width || undefined} height=${args.height || undefined}></scarlet-skeleton>
    </div>
  `,
};

export default meta;
type Story = StoryObj<ScarletSkeletonArgs>;

export const Text: Story = {};

export const Circle: Story = {
  args: { variant: 'circle' },
};

export const Rect: Story = {
  args: { variant: 'rect' },
};

export const CardExample: Story = {
  name: 'Exemplo: card carregando',
  render: () => html`
    <div style="display: flex; gap: 12px; max-width: 320px; align-items: flex-start;">
      <scarlet-skeleton variant="circle"></scarlet-skeleton>
      <div style="flex: 1;">
        <scarlet-skeleton variant="text" lines="3"></scarlet-skeleton>
      </div>
    </div>
  `,
};
