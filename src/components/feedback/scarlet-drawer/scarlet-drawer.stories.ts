import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletDrawerArgs {
  placement: 'left' | 'right' | 'top' | 'bottom';
  size: 'sm' | 'md' | 'lg';
}

const meta: Meta<ScarletDrawerArgs> = {
  title: 'Components/Feedback/Drawer',
  component: 'scarlet-drawer',
  argTypes: {
    placement: { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    placement: 'right',
    size: 'md',
  },
  render: (args) => html`
    <scarlet-button
      @scarletClick=${(event: Event) => {
        const drawer = (event.target as HTMLElement).nextElementSibling as HTMLElement & { show: () => void };
        drawer.show();
      }}
    >
      Abrir drawer
    </scarlet-button>
    <scarlet-drawer placement=${args.placement} size=${args.size}>
      <span slot="header">Filtros</span>
      <p style="margin: 0;">Conteúdo de exemplo dentro do drawer.</p>
      <div slot="footer">
        <scarlet-button
          variant="ghost"
          @scarletClick=${(event: Event) => {
            const drawer = (event.target as HTMLElement).closest('scarlet-drawer') as HTMLElement & { hide: () => void };
            drawer.hide();
          }}
        >
          Cancelar
        </scarlet-button>
        <scarlet-button
          color="primary"
          @scarletClick=${(event: Event) => {
            const drawer = (event.target as HTMLElement).closest('scarlet-drawer') as HTMLElement & { hide: () => void };
            drawer.hide();
          }}
        >
          Aplicar
        </scarlet-button>
      </div>
    </scarlet-drawer>
  `,
};

export default meta;
type Story = StoryObj<ScarletDrawerArgs>;

export const Right: Story = {};

export const Left: Story = {
  args: { placement: 'left' },
};

export const Bottom: Story = {
  args: { placement: 'bottom' },
};
