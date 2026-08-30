import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletStackArgs {
  direction: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  gap: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align: 'start' | 'center' | 'end' | 'stretch';
  justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap: 'nowrap' | 'wrap' | 'wrap-reverse';
}

const box = (label: string) => html`
  <div style="padding: 12px 16px; background: var(--scarlet-color-primary-100, #ffe4e6); border-radius: 6px;">${label}</div>
`;

const meta: Meta<ScarletStackArgs> = {
  title: 'Components/Layout/Stack',
  component: 'scarlet-stack',
  argTypes: {
    direction: { control: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
    gap: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
    wrap: { control: 'select', options: ['nowrap', 'wrap', 'wrap-reverse'] },
  },
  args: {
    direction: 'row',
    gap: 'md',
    align: 'center',
    justify: 'start',
    wrap: 'nowrap',
  },
  render: (args) => html`
    <div style="border: 1px dashed var(--scarlet-color-border-primary, #cbd5e1); padding: 12px;">
      <scarlet-stack direction=${args.direction} gap=${args.gap} align=${args.align} justify=${args.justify} wrap=${args.wrap}>
        ${box('Item 1')} ${box('Item 2')} ${box('Item 3')}
      </scarlet-stack>
    </div>
  `,
};

export default meta;
type Story = StoryObj<ScarletStackArgs>;

export const Row: Story = {};

export const Column: Story = {
  args: { direction: 'column' },
};

export const SpaceBetween: Story = {
  args: { justify: 'between' },
};

export const Responsive: Story = {
  name: 'Responsivo (direction por breakpoint)',
  render: () => html`
    <p style="margin: 0 0 12px; font-size: 14px; color: var(--scarlet-color-text-secondary, #64748b);">
      Empilhado (<code>column</code>) abaixo de 768px, em linha (<code>row</code>) a partir de 768px (<code>md</code>) —
      o padrão clássico de uma barra de ações ou navegação que vira lista no celular. Troque o viewport na barra de
      ferramentas do Storybook pra ver mudar.
    </p>
    <div style="border: 1px dashed var(--scarlet-color-border-primary, #cbd5e1); padding: 12px;">
      <scarlet-stack direction="column" direction-md="row" gap="md">${box('Item 1')} ${box('Item 2')} ${box('Item 3')}</scarlet-stack>
    </div>
  `,
};
