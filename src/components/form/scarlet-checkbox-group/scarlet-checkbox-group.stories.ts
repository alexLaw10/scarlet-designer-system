import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletCheckboxGroupArgs {
  value: string[];
  horizontal: boolean;
  disabled: boolean;
}

const meta: Meta<ScarletCheckboxGroupArgs> = {
  title: 'Components/Checkbox/Checkbox Group',
  component: 'scarlet-checkbox-group',
  argTypes: {
    // `value` is an array — scarlet-checkbox-group takes it as a JS
    // property, not an HTML attribute (Stencil doesn't auto-parse array
    // props from a string attribute), hence `.value=${args.value}` below
    // instead of `value=${args.value}`.
    value: { control: 'object' },
    horizontal: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    value: ['tomate'],
    horizontal: false,
    disabled: false,
  },
  render: (args) => html`
    <scarlet-checkbox-group name="ingredientes" .value=${args.value} ?horizontal=${args.horizontal} ?disabled=${args.disabled} aria-label="Ingredientes">
      <scarlet-checkbox value="tomate" label="Tomate"></scarlet-checkbox>
      <scarlet-checkbox value="queijo" label="Queijo"></scarlet-checkbox>
      <scarlet-checkbox value="cebola" label="Cebola"></scarlet-checkbox>
    </scarlet-checkbox-group>
  `,
};

export default meta;
type Story = StoryObj<ScarletCheckboxGroupArgs>;

export const Vertical: Story = {};

export const Horizontal: Story = {
  args: { horizontal: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
