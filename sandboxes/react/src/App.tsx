import React, { useEffect, useRef, useState } from 'react';
import './App.css';

// Declare custom elements for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'scarlet-button': any;
      'scarlet-input': any;
      'scarlet-card': any;
      'scarlet-alert': any;
      'scarlet-input-phone': any;
      'scarlet-input-document': any;
      'scarlet-input-cep': any;
      'scarlet-select': any;
      'scarlet-date-picker': any;
      'scarlet-radio-group': any;
      'scarlet-radio': any;
      'scarlet-textarea': any;
      'scarlet-switch': any;
      'scarlet-checkbox': any;
    }
  }
}

// scarlet-select takes its options as a JS property (an array), not an HTML
// attribute — a plain string couldn't carry structured data. React assigns
// non-string/non-boolean props on hyphenated tag names as DOM properties
// (not attributes), so passing this straight as `options={UF_OPTIONS}` in
// JSX below is enough; no ref/imperative assignment needed.
const UF_OPTIONS = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

interface CadastroForm {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  cep: string;
  uf: string;
  nascimento: string;
  tipoConta: string;
  mensagem: string;
  novidades: boolean;
  aceitaTermos: boolean;
}

const initialForm: CadastroForm = {
  nome: '',
  email: '',
  telefone: '',
  documento: '',
  cep: '',
  uf: '',
  nascimento: '',
  tipoConta: 'pessoal',
  mensagem: '',
  novidades: false,
  aceitaTermos: false,
};

function App() {
  const [inputValue, setInputValue] = useState('');
  const [lastClicked, setLastClicked] = useState('-');
  const [clickCount, setClickCount] = useState(0);
  const [alertVisible, setAlertVisible] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  const [form, setForm] = useState<CadastroForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // React 18 does not auto-wire `onScarletClick`-style props to custom
  // element events (that lands in React 19). Until this sandbox upgrades,
  // listen with a plain DOM listener instead — Stencil events bubble and
  // are composed by default, so one delegated listener on a container works.
  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const name = target.getAttribute('data-name') ?? target.tagName.toLowerCase();
      setLastClicked(name);
      setClickCount((count) => count + 1);
    };

    const handleInput = (event: Event) => {
      setInputValue((event as CustomEvent<string>).detail);
    };

    const handleDismiss = () => setAlertVisible(false);

    container.addEventListener('scarletClick', handleClick);
    container.addEventListener('scarletInput', handleInput);
    container.addEventListener('scarletDismiss', handleDismiss);

    return () => {
      container.removeEventListener('scarletClick', handleClick);
      container.removeEventListener('scarletInput', handleInput);
      container.removeEventListener('scarletDismiss', handleDismiss);
    };
  }, []);

  // Form example: every field below carries a `data-field` attribute
  // matching a key of `CadastroForm`. One delegated `scarletInput` listener
  // (fires on every keystroke — text/masked inputs, textarea, date picker)
  // and one delegated `scarletChange` listener (fires on commit — those
  // same fields on blur, plus select/checkbox/switch/radio-group, which
  // only ever emit scarletChange) keep the whole form's state in sync
  // without a handler per field.
  useEffect(() => {
    const container = formRef.current;
    if (!container) return;

    const syncField = (event: Event) => {
      const field = (event.target as HTMLElement).dataset.field as keyof CadastroForm | undefined;
      if (!field) return;
      setForm((prev) => ({ ...prev, [field]: (event as CustomEvent).detail }));
    };

    // Both stop propagation before the event reaches mainRef above: without
    // that, this section's own scarletDismiss/scarletClick would also
    // trigger the unrelated Button/Alert demo sections' listeners up there
    // (dismissing this success alert would hide the Alert demo's error
    // alert too; clicking Enviar/Limpar would bump the Button demo's click
    // counter).
    const handleDismiss = (event: Event) => {
      event.stopPropagation();
      setSubmitted(false);
    };

    const handleAction = (event: Event) => {
      event.stopPropagation();
      const action = (event.target as HTMLElement).dataset.action;
      if (action === 'submit') setSubmitted(true);
      if (action === 'reset') {
        setForm(initialForm);
        setSubmitted(false);
      }
    };

    container.addEventListener('scarletInput', syncField);
    container.addEventListener('scarletChange', syncField);
    container.addEventListener('scarletDismiss', handleDismiss);
    container.addEventListener('scarletClick', handleAction);

    return () => {
      container.removeEventListener('scarletInput', syncField);
      container.removeEventListener('scarletChange', syncField);
      container.removeEventListener('scarletDismiss', handleDismiss);
      container.removeEventListener('scarletClick', handleAction);
    };
  }, []);

  const canSubmit = form.nome.trim() !== '' && form.email.trim() !== '' && form.aceitaTermos;

  return (
    <div className="app">
      <header className="header">
        <h1>Scarlet Design System - React Sandbox</h1>
        <p>Testing Web Components with React</p>
      </header>

      <main className="main" ref={mainRef}>
        <section className="section">
          <h2>Button</h2>
          <div className="button-group">
            <scarlet-button data-name="Primary" variant="solid" color="primary">
              Primary
            </scarlet-button>
            <scarlet-button data-name="Secondary" variant="solid" color="secondary">
              Secondary
            </scarlet-button>
            <scarlet-button data-name="Outline" variant="outline">
              Outline
            </scarlet-button>
            <scarlet-button data-name="Ghost" variant="ghost">
              Ghost
            </scarlet-button>
            <scarlet-button data-name="Link" variant="link">
              Link
            </scarlet-button>
            <scarlet-button variant="solid" disabled>
              Disabled
            </scarlet-button>
          </div>
          <p>
            Último clicado: <strong>{lastClicked}</strong> — Total de cliques: <strong>{clickCount}</strong>
          </p>
        </section>

        <section className="section">
          <h2>Input</h2>
          <div className="input-group">
            <scarlet-input label="Nome" placeholder="Digite seu nome" value={inputValue} />
            <scarlet-input type="email" label="E-mail" placeholder="voce@exemplo.com" />
            <scarlet-input type="password" label="Senha" helper-text="Mínimo de 8 caracteres" />
            <scarlet-input label="Com erro" error-message="Este campo é obrigatório" invalid />
          </div>
          <p>
            Valor digitado: <strong>{inputValue || '-'}</strong>
          </p>
        </section>

        <section className="section">
          <h2>Card</h2>
          <div className="card-group">
            <scarlet-card variant="elevated">
              <span slot="header">Card elevado</span>
              <p>Conteúdo de exemplo dentro do card.</p>
            </scarlet-card>
            <scarlet-card variant="outlined">
              <span slot="header">Card com borda</span>
              <p>Conteúdo de exemplo dentro do card.</p>
            </scarlet-card>
            <scarlet-card data-name="Card interativo" interactive>
              <span slot="header">Card interativo</span>
              <p>Clique em qualquer lugar deste card.</p>
            </scarlet-card>
          </div>
        </section>

        <section className="section">
          <h2>Alert</h2>
          <div className="alert-group">
            <scarlet-alert status="info">Este é um alerta informativo.</scarlet-alert>
            <scarlet-alert status="success">Operação concluída com sucesso.</scarlet-alert>
            <scarlet-alert status="warning">Atenção: revise os dados informados.</scarlet-alert>
            {alertVisible && (
              <scarlet-alert status="error" dismissible>
                Ocorreu um erro ao processar sua solicitação.
              </scarlet-alert>
            )}
          </div>
        </section>

        <section className="section">
          <h2>Formulário de cadastro</h2>
          <p className="section-note">
            Um exemplo mais completo, combinando os componentes de formulário do Scarlet num cadastro real: texto, inputs
            mascarados pt-BR, select, date picker, radio group, textarea, switch e checkbox — todos controlados pelo mesmo
            objeto de estado <code>form</code> via os eventos <code>scarletInput</code>/<code>scarletChange</code>.
          </p>
          <div className="form" ref={formRef}>
            <div className="form-grid">
              <scarlet-input
                data-field="nome"
                label="Nome completo"
                placeholder="Seu nome"
                required
                value={form.nome}
              />
              <scarlet-input data-field="email" type="email" label="E-mail" placeholder="voce@exemplo.com" required value={form.email} />
              <scarlet-input-phone data-field="telefone" label="Telefone" value={form.telefone} />
              <scarlet-input-document data-field="documento" label="CPF ou CNPJ" value={form.documento} />
              <scarlet-input-cep data-field="cep" label="CEP" value={form.cep} />
              <scarlet-select data-field="uf" label="Estado" placeholder="Selecione" options={UF_OPTIONS} value={form.uf} />
              <scarlet-date-picker data-field="nascimento" label="Data de nascimento" value={form.nascimento} />
            </div>

            <fieldset className="form-fieldset">
              <legend>Tipo de conta</legend>
              <scarlet-radio-group data-field="tipoConta" value={form.tipoConta} horizontal>
                <scarlet-radio value="pessoal" label="Pessoal" />
                <scarlet-radio value="empresa" label="Empresa" />
              </scarlet-radio-group>
            </fieldset>

            <scarlet-textarea
              data-field="mensagem"
              label="Mensagem"
              placeholder="Conte um pouco sobre o motivo do contato"
              rows={4}
              value={form.mensagem}
            />

            <div className="form-toggles">
              <scarlet-switch data-field="novidades" label="Quero receber novidades por e-mail" checked={form.novidades} />
              <scarlet-checkbox
                data-field="aceitaTermos"
                label="Li e aceito os termos de uso"
                required
                checked={form.aceitaTermos}
              />
            </div>

            {submitted && (
              <scarlet-alert status="success" dismissible>
                Cadastro enviado! Confira abaixo os dados coletados pelo formulário.
              </scarlet-alert>
            )}

            <div className="form-actions">
              <scarlet-button variant="ghost" color="neutral" data-action="reset">
                Limpar
              </scarlet-button>
              <scarlet-button variant="solid" color="primary" disabled={!canSubmit} data-action="submit">
                Enviar cadastro
              </scarlet-button>
            </div>

            <details className="form-preview">
              <summary>Estado atual do formulário (JSON)</summary>
              <pre>{JSON.stringify(form, null, 2)}</pre>
            </details>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
