import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { ScarletTabItem } from './scarlet-tabs';

interface ScarletTabsArgs {
  value: string;
}

const items: ScarletTabItem[] = [
  { value: 'perfil', label: 'Perfil' },
  { value: 'seguranca', label: 'Segurança' },
  { value: 'notificacoes', label: 'Notificações' },
  { value: 'faturamento', label: 'Faturamento', disabled: true },
];

const meta: Meta<ScarletTabsArgs> = {
  title: 'Components/Tabs',
  component: 'scarlet-tabs',
  argTypes: {
    value: { control: 'select', options: items.map((item) => item.value) },
  },
  args: {
    value: 'perfil',
  },
  render: (args) => html`
    <scarlet-tabs .items=${items} value=${args.value} style="max-width: 480px;">
      <div slot="perfil">Formulário de edição de perfil.</div>
      <div slot="seguranca">Configurações de senha e autenticação em duas etapas.</div>
      <div slot="notificacoes">Preferências de e-mail e push.</div>
      <div slot="faturamento">Histórico de faturas (indisponível no plano atual).</div>
    </scarlet-tabs>
  `,
};

export default meta;
type Story = StoryObj<ScarletTabsArgs>;

export const Default: Story = {};
