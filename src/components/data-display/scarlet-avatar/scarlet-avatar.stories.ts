import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletAvatarArgs {
  src: string;
  name: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape: 'circle' | 'square';
}

const meta: Meta<ScarletAvatarArgs> = {
  title: 'Components/Avatar',
  component: 'scarlet-avatar',
  argTypes: {
    src: { control: 'text' },
    name: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'select', options: ['circle', 'square'] },
  },
  args: {
    src: '',
    name: 'Ana Souza',
    size: 'md',
    shape: 'circle',
  },
  render: (args) => html` <scarlet-avatar src=${args.src || undefined} name=${args.name} size=${args.size} shape=${args.shape}></scarlet-avatar> `,
};

export default meta;
type Story = StoryObj<ScarletAvatarArgs>;

export const Initials: Story = {};

export const Placeholder: Story = {
  args: { name: '' },
};

export const Square: Story = {
  args: { shape: 'square' },
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 12px;">
      <scarlet-avatar name="Ana Souza" size="xs"></scarlet-avatar>
      <scarlet-avatar name="Ana Souza" size="sm"></scarlet-avatar>
      <scarlet-avatar name="Ana Souza" size="md"></scarlet-avatar>
      <scarlet-avatar name="Ana Souza" size="lg"></scarlet-avatar>
      <scarlet-avatar name="Ana Souza" size="xl"></scarlet-avatar>
    </div>
  `,
};
