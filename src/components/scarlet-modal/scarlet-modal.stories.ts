import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletModalArgs {
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  dismissOnBackdropClick: boolean;
  dismissOnEsc: boolean;
}

const meta: Meta<ScarletModalArgs> = {
  title: 'Components/Modal',
  component: 'scarlet-modal',
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] },
    dismissOnBackdropClick: { control: 'boolean' },
    dismissOnEsc: { control: 'boolean' },
  },
  args: {
    size: 'md',
    dismissOnBackdropClick: true,
    dismissOnEsc: true,
  },
  render: (args) => html`
    <scarlet-button
      @scarletClick=${(event: Event) => {
        const modal = (event.target as HTMLElement).nextElementSibling as HTMLElement & { show: () => void };
        modal.show();
      }}
    >
      Abrir modal
    </scarlet-button>
    <scarlet-modal size=${args.size} ?dismiss-on-backdrop-click=${args.dismissOnBackdropClick} ?dismiss-on-esc=${args.dismissOnEsc}>
      <span slot="header">Confirmar ação</span>
      <p style="margin: 0;">Tem certeza que deseja continuar? Essa ação não pode ser desfeita.</p>
      <div slot="footer">
        <scarlet-button
          variant="ghost"
          @scarletClick=${(event: Event) => {
            const modal = (event.target as HTMLElement).closest('scarlet-modal') as HTMLElement & { hide: () => void };
            modal.hide();
          }}
        >
          Cancelar
        </scarlet-button>
        <scarlet-button
          color="error"
          @scarletClick=${(event: Event) => {
            const modal = (event.target as HTMLElement).closest('scarlet-modal') as HTMLElement & { hide: () => void };
            modal.hide();
          }}
        >
          Confirmar
        </scarlet-button>
      </div>
    </scarlet-modal>
  `,
};

export default meta;
type Story = StoryObj<ScarletModalArgs>;

export const Default: Story = {};

export const Large: Story = {
  args: { size: 'lg' },
};

export const NoBackdropDismiss: Story = {
  args: { dismissOnBackdropClick: false },
};
