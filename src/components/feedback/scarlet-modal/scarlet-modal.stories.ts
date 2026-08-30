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
      <scarlet-button
        slot="footer-start"
        variant="ghost"
        @scarletClick=${(event: Event) => {
          const modal = (event.target as HTMLElement).closest('scarlet-modal') as HTMLElement & { hide: () => void };
          modal.hide();
        }}
      >
        Cancelar
      </scarlet-button>
      <scarlet-button
        slot="footer-end"
        color="error"
        @scarletClick=${(event: Event) => {
          const modal = (event.target as HTMLElement).closest('scarlet-modal') as HTMLElement & { hide: () => void };
          modal.hide();
        }}
      >
        Confirmar
      </scarlet-button>
    </scarlet-modal>
  `,
};

const closeOnClick = (event: Event) => {
  const modal = (event.target as HTMLElement).closest('scarlet-modal') as HTMLElement & { hide: () => void };
  modal.hide();
};

const openTrigger = (label: string) => html`
  <scarlet-button
    @scarletClick=${(event: Event) => {
      const modal = (event.target as HTMLElement).nextElementSibling as HTMLElement & { show: () => void };
      modal.show();
    }}
  >
    ${label}
  </scarlet-button>
`;

export default meta;
type Story = StoryObj<ScarletModalArgs>;

export const Default: Story = {};

export const Large: Story = {
  args: { size: 'lg' },
};

export const NoBackdropDismiss: Story = {
  args: { dismissOnBackdropClick: false },
};

export const FooterLayouts: Story = {
  name: 'Combinações de rodapé',
  render: () => html`
    <p style="margin: 0 0 12px; font-size: 14px; color: var(--scarlet-color-text-secondary, #64748b);">
      O rodapé tem dois grupos independentes — <code>slot="footer-start"</code> (esquerda) e
      <code>slot="footer-end"</code> (direita) — cada um aceitando 1, 2 ou 3 botões, em qualquer combinação.
    </p>
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      ${openTrigger('1 à direita')}
      <scarlet-modal>
        <span slot="header">Só um botão, à direita</span>
        <p style="margin: 0;">Conteúdo do modal.</p>
        <scarlet-button slot="footer-end" @scarletClick=${closeOnClick}>Ok</scarlet-button>
      </scarlet-modal>

      ${openTrigger('1 à esquerda')}
      <scarlet-modal>
        <span slot="header">Só um botão, à esquerda</span>
        <p style="margin: 0;">Conteúdo do modal.</p>
        <scarlet-button slot="footer-start" variant="ghost" @scarletClick=${closeOnClick}>Voltar</scarlet-button>
      </scarlet-modal>

      ${openTrigger('2 à direita')}
      <scarlet-modal>
        <span slot="header">Dois botões, à direita</span>
        <p style="margin: 0;">Conteúdo do modal.</p>
        <scarlet-button slot="footer-end" variant="ghost" @scarletClick=${closeOnClick}>Cancelar</scarlet-button>
        <scarlet-button slot="footer-end" @scarletClick=${closeOnClick}>Confirmar</scarlet-button>
      </scarlet-modal>

      ${openTrigger('3 à direita')}
      <scarlet-modal>
        <span slot="header">Três botões, à direita</span>
        <p style="margin: 0;">Conteúdo do modal.</p>
        <scarlet-button slot="footer-end" variant="ghost" @scarletClick=${closeOnClick}>Cancelar</scarlet-button>
        <scarlet-button slot="footer-end" variant="outline" @scarletClick=${closeOnClick}>Salvar rascunho</scarlet-button>
        <scarlet-button slot="footer-end" @scarletClick=${closeOnClick}>Publicar</scarlet-button>
      </scarlet-modal>

      ${openTrigger('1 esq. + 2 dir.')}
      <scarlet-modal>
        <span slot="header">1 à esquerda, 2 à direita</span>
        <p style="margin: 0;">Conteúdo do modal.</p>
        <scarlet-button slot="footer-start" variant="ghost" @scarletClick=${closeOnClick}>Cancelar</scarlet-button>
        <scarlet-button slot="footer-end" variant="outline" @scarletClick=${closeOnClick}>Voltar</scarlet-button>
        <scarlet-button slot="footer-end" @scarletClick=${closeOnClick}>Continuar</scarlet-button>
      </scarlet-modal>

      ${openTrigger('2 esq. + 1 dir.')}
      <scarlet-modal>
        <span slot="header">2 à esquerda, 1 à direita</span>
        <p style="margin: 0;">Conteúdo do modal.</p>
        <scarlet-button slot="footer-start" variant="ghost" @scarletClick=${closeOnClick}>Excluir</scarlet-button>
        <scarlet-button slot="footer-start" variant="outline" @scarletClick=${closeOnClick}>Duplicar</scarlet-button>
        <scarlet-button slot="footer-end" @scarletClick=${closeOnClick}>Salvar</scarlet-button>
      </scarlet-modal>

      ${openTrigger('3 esq. + 3 dir.')}
      <scarlet-modal size="lg">
        <span slot="header">Três de cada lado</span>
        <p style="margin: 0;">Conteúdo do modal.</p>
        <scarlet-button slot="footer-start" variant="ghost" @scarletClick=${closeOnClick}>Excluir</scarlet-button>
        <scarlet-button slot="footer-start" variant="ghost" @scarletClick=${closeOnClick}>Duplicar</scarlet-button>
        <scarlet-button slot="footer-start" variant="ghost" @scarletClick=${closeOnClick}>Arquivar</scarlet-button>
        <scarlet-button slot="footer-end" variant="outline" @scarletClick=${closeOnClick}>Voltar</scarlet-button>
        <scarlet-button slot="footer-end" variant="outline" @scarletClick=${closeOnClick}>Salvar rascunho</scarlet-button>
        <scarlet-button slot="footer-end" @scarletClick=${closeOnClick}>Publicar</scarlet-button>
      </scarlet-modal>
    </div>
  `,
};
