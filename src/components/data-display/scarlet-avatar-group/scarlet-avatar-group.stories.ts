import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletAvatarGroupArgs {
  max?: number;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const meta: Meta<ScarletAvatarGroupArgs> = {
  title: 'Components/Data Display/Avatar Group',
  component: 'scarlet-avatar-group',
  argTypes: {
    max: { control: 'number' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
  args: {
    max: undefined,
    size: 'md',
  },
  render: (args) => html`
    <scarlet-avatar-group max=${args.max as unknown as string} size=${args.size}>
      <scarlet-avatar name="Ana Souza"></scarlet-avatar>
      <scarlet-avatar name="Bruno Lima"></scarlet-avatar>
      <scarlet-avatar name="Carla Nunes"></scarlet-avatar>
      <scarlet-avatar name="Diego Alves"></scarlet-avatar>
      <scarlet-avatar name="Elis Farias"></scarlet-avatar>
    </scarlet-avatar-group>
  `,
};

export default meta;
type Story = StoryObj<ScarletAvatarGroupArgs>;

export const AllVisible: Story = {
  name: 'Todos visíveis',
};

export const WithOverflow: Story = {
  name: 'Com overflow (+N)',
  args: { max: 3 },
};
