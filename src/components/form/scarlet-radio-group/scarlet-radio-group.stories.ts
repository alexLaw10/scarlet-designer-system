import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletRadioGroupArgs {
  value: string;
  horizontal: boolean;
  disabled: boolean;
}

const meta: Meta<ScarletRadioGroupArgs> = {
  title: 'Components/Radio/Radio Group',
  component: 'scarlet-radio-group',
  argTypes: {
    value: { control: 'select', options: ['pequeno', 'medio', 'grande'] },
    horizontal: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    value: 'medio',
    horizontal: false,
    disabled: false,
  },
  render: (args) => html`
    <scarlet-radio-group name="tamanho" value=${args.value} ?horizontal=${args.horizontal} ?disabled=${args.disabled} aria-label="Tamanho">
      <scarlet-radio value="pequeno" label="Pequeno"></scarlet-radio>
      <scarlet-radio value="medio" label="Médio"></scarlet-radio>
      <scarlet-radio value="grande" label="Grande"></scarlet-radio>
    </scarlet-radio-group>
  `,
};

export default meta;
type Story = StoryObj<ScarletRadioGroupArgs>;

export const Vertical: Story = {};

export const Horizontal: Story = {
  args: { horizontal: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
