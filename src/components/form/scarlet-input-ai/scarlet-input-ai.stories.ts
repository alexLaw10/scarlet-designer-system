import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

interface ScarletInputAiArgs {
  label: string;
  value: string;
  placeholder: string;
  helperText: string;
  errorMessage: string;
  invalid: boolean;
  disabled: boolean;
}

// Stands in for the app's own backend call in this story — a real app never
// talks to an AI provider straight from the browser (see the component's own
// doc comment): `improve` here is what `scarlet-input-ai` expects any
// consumer to hand it, wired to whatever endpoint actually holds the API key.
const fakeImprove = (value: string): Promise<string> =>
  new Promise(resolve => {
    setTimeout(() => resolve(`${value.trim().replace(/\.$/, '')}.`), 900);
  });

const meta: Meta<ScarletInputAiArgs> = {
  title: 'Components/Form/Input AI',
  component: 'scarlet-input-ai',
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Título',
    value: 'reuniao com o time as 15h pra ver o q ta faltando no projeto',
    placeholder: '',
    helperText: '',
    errorMessage: '',
    invalid: false,
    disabled: false,
  },
  render: (args) => html`
    <scarlet-input-ai
      label=${args.label}
      value=${args.value}
      placeholder=${args.placeholder}
      helper-text=${args.helperText}
      error-message=${args.errorMessage}
      ?invalid=${args.invalid}
      ?disabled=${args.disabled}
      .improve=${fakeImprove}
    ></scarlet-input-ai>
  `,
};

export default meta;
type Story = StoryObj<ScarletInputAiArgs>;

export const Default: Story = {};

export const WithoutImprove: Story = {
  name: 'Sem improve (campo comum)',
  render: (args) => html`
    <p style="margin: 0 0 12px; font-size: 14px; color: var(--scarlet-color-text-secondary, #64748b);">
      Sem <code>improve</code> setado, o botão some por completo — o campo funciona como um
      <code>scarlet-input</code> normal.
    </p>
    <scarlet-input-ai label=${args.label} value=${args.value}></scarlet-input-ai>
  `,
};

export const AlreadyGood: Story = {
  name: 'Sugestão igual ao valor atual',
  render: (args) => html`
    <p style="margin: 0 0 12px; font-size: 14px; color: var(--scarlet-color-text-secondary, #64748b);">
      Quando a IA devolve o mesmo texto, aparece um aviso "Já está bom 👍" em vez de uma prévia pra
      aplicar/descartar.
    </p>
    <scarlet-input-ai
      label=${args.label}
      value="Texto já revisado."
      .improve=${(value: string) => Promise.resolve(value)}
    ></scarlet-input-ai>
  `,
};

export const ImproveFails: Story = {
  name: 'Erro ao melhorar',
  render: (args) => html`
    <scarlet-input-ai
      label=${args.label}
      value=${args.value}
      .improve=${() => Promise.reject(new Error('Serviço indisponível'))}
    ></scarlet-input-ai>
  `,
};

export const WithHelperText: Story = {
  args: { helperText: 'Use um título curto e direto.' },
};

export const WithError: Story = {
  args: { errorMessage: 'Título é obrigatório.', invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
