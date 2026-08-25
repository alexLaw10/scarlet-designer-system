import '@scarlet/design-system/dist/scarlet/scarlet.css';
import { defineCustomElements } from '@scarlet/design-system/loader';
import './style.css';

// Define custom elements
defineCustomElements();

// scarlet-select needs its options as a real array, not an HTML attribute —
// set as a plain JS property after the element exists (see renderFormSection).
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

const emptyForm = () => ({
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
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="app">
      <header class="header">
        <h1>Scarlet Design System - Vanilla JS Sandbox</h1>
        <p>Testing Web Components with Vanilla JavaScript</p>
      </header>

      <main class="main">
        <section class="section">
          <h2>Button</h2>
          <div class="button-group">
            <scarlet-button id="primary-btn" variant="solid" color="primary">Primary</scarlet-button>
            <scarlet-button id="secondary-btn" variant="solid" color="secondary">Secondary</scarlet-button>
            <scarlet-button id="outline-btn" variant="outline">Outline</scarlet-button>
            <scarlet-button id="ghost-btn" variant="ghost">Ghost</scarlet-button>
            <scarlet-button id="link-btn" variant="link">Link</scarlet-button>
          </div>
          <p>Último clicado: <strong id="last-clicked">-</strong> — Total de cliques: <strong id="click-count">0</strong></p>
        </section>

        <section class="section">
          <h2>Input</h2>
          <div class="input-group">
            <scarlet-input id="name-input" label="Nome" placeholder="Digite seu nome"></scarlet-input>
            <scarlet-input id="email-input" type="email" label="E-mail" placeholder="voce@exemplo.com"></scarlet-input>
            <scarlet-input id="password-input" type="password" label="Senha" helper-text="Mínimo de 8 caracteres"></scarlet-input>
          </div>
          <p>Valor digitado: <strong id="input-value">-</strong></p>
        </section>

        <section class="section">
          <h2>Card</h2>
          <div class="card-group">
            <scarlet-card variant="elevated">
              <span slot="header">Card elevado</span>
              <p>Conteúdo de exemplo dentro do card.</p>
            </scarlet-card>
            <scarlet-card variant="outlined">
              <span slot="header">Card com borda</span>
              <p>Conteúdo de exemplo dentro do card.</p>
            </scarlet-card>
          </div>
        </section>

        <section class="section">
          <h2>Alert</h2>
          <div class="alert-group">
            <scarlet-alert id="info-alert" status="info">Este é um alerta informativo.</scarlet-alert>
            <scarlet-alert id="success-alert" status="success">Operação concluída com sucesso.</scarlet-alert>
            <scarlet-alert id="warning-alert" status="warning">Atenção: revise os dados informados.</scarlet-alert>
            <scarlet-alert id="error-alert" status="error" dismissible>Ocorreu um erro ao processar sua solicitação.</scarlet-alert>
          </div>
        </section>

        <section class="section">
          <h2>Formulário de cadastro</h2>
          <p class="section-note">
            Um exemplo mais completo, combinando os componentes de formulário do Scarlet num cadastro real: texto, inputs
            mascarados pt-BR, select, date picker, radio group, textarea, switch e checkbox — cada campo tem um
            <code>id</code> e é lido/escrito via <code>.value</code>/<code>.checked</code> e os eventos
            <code>scarletInput</code>/<code>scarletChange</code>, igual a qualquer outro elemento do DOM.
          </p>
          <div class="form" id="cadastro-form">
            <div class="form-grid">
              <scarlet-input id="f-nome" label="Nome completo" placeholder="Seu nome" required></scarlet-input>
              <scarlet-input id="f-email" type="email" label="E-mail" placeholder="voce@exemplo.com" required></scarlet-input>
              <scarlet-input-phone id="f-telefone" label="Telefone"></scarlet-input-phone>
              <scarlet-input-document id="f-documento" label="CPF ou CNPJ"></scarlet-input-document>
              <scarlet-input-cep id="f-cep" label="CEP"></scarlet-input-cep>
              <scarlet-select id="f-uf" label="Estado" placeholder="Selecione"></scarlet-select>
              <scarlet-date-picker id="f-nascimento" label="Data de nascimento"></scarlet-date-picker>
            </div>

            <fieldset class="form-fieldset">
              <legend>Tipo de conta</legend>
              <scarlet-radio-group id="f-tipo-conta" value="pessoal" horizontal>
                <scarlet-radio value="pessoal" label="Pessoal"></scarlet-radio>
                <scarlet-radio value="empresa" label="Empresa"></scarlet-radio>
              </scarlet-radio-group>
            </fieldset>

            <scarlet-textarea id="f-mensagem" label="Mensagem" placeholder="Conte um pouco sobre o motivo do contato" rows="4"></scarlet-textarea>

            <div class="form-toggles">
              <scarlet-switch id="f-novidades" label="Quero receber novidades por e-mail"></scarlet-switch>
              <scarlet-checkbox id="f-aceita-termos" label="Li e aceito os termos de uso" required></scarlet-checkbox>
            </div>

            <scarlet-alert id="f-success-alert" status="success" dismissible hidden>
              Cadastro enviado! Confira abaixo os dados coletados pelo formulário.
            </scarlet-alert>

            <div class="form-actions">
              <scarlet-button id="f-reset-btn" variant="ghost" color="neutral">Limpar</scarlet-button>
              <scarlet-button id="f-submit-btn" variant="solid" color="primary" disabled>Enviar cadastro</scarlet-button>
            </div>

            <details class="form-preview">
              <summary>Estado atual do formulário (JSON)</summary>
              <pre id="f-preview"></pre>
            </details>
          </div>
        </section>
      </main>
    </div>
  `;

  // Add event listeners
  setupEventListeners();
  setupCadastroForm();
});

function setupEventListeners() {
  let clickCount = 0;

  // Button click handlers
  const buttons = [
    { id: 'primary-btn', name: 'Primary' },
    { id: 'secondary-btn', name: 'Secondary' },
    { id: 'outline-btn', name: 'Outline' },
    { id: 'ghost-btn', name: 'Ghost' },
    { id: 'link-btn', name: 'Link' }
  ];

  buttons.forEach(button => {
    const element = document.getElementById(button.id);
    if (element) {
      element.addEventListener('scarletClick', (event) => {
        clickCount++;
        console.log(`${button.name} button clicked:`, event);

        // Update UI
        document.getElementById('click-count').textContent = clickCount;
        document.getElementById('last-clicked').textContent = button.name;
      });
    }
  });

  // Input change handlers
  const inputs = ['name-input', 'email-input', 'password-input'];

  inputs.forEach(inputId => {
    const element = document.getElementById(inputId);
    if (element) {
      element.addEventListener('scarletInput', (event) => {
        console.log(`${inputId} changed:`, event.detail);

        // Update UI
        document.getElementById('input-value').textContent = event.detail || '-';
      });
    }
  });

  // Alert dismiss handlers
  const alerts = ['info-alert', 'success-alert', 'warning-alert', 'error-alert'];

  alerts.forEach(alertId => {
    const element = document.getElementById(alertId);
    if (element) {
      element.addEventListener('scarletDismiss', (event) => {
        console.log(`${alertId} dismissed:`, event);
      });
    }
  });
}

// Wires the "Formulário de cadastro" section: keeps a plain `formState`
// object as the source of truth, syncs every field's `scarletInput`/
// `scarletChange` event into it, and re-renders the JSON preview + the
// submit button's disabled state whenever anything changes.
function setupCadastroForm() {
  const formEl = document.getElementById('cadastro-form');
  if (!formEl) return;

  const ufSelect = document.getElementById('f-uf');
  ufSelect.options = UF_OPTIONS;

  const fieldElements = {
    nome: document.getElementById('f-nome'),
    email: document.getElementById('f-email'),
    telefone: document.getElementById('f-telefone'),
    documento: document.getElementById('f-documento'),
    cep: document.getElementById('f-cep'),
    uf: ufSelect,
    nascimento: document.getElementById('f-nascimento'),
    tipoConta: document.getElementById('f-tipo-conta'),
    mensagem: document.getElementById('f-mensagem'),
    novidades: document.getElementById('f-novidades'),
    aceitaTermos: document.getElementById('f-aceita-termos'),
  };

  const previewEl = document.getElementById('f-preview');
  const submitBtn = document.getElementById('f-submit-btn');
  const successAlert = document.getElementById('f-success-alert');

  let formState = emptyForm();

  const render = () => {
    previewEl.textContent = JSON.stringify(formState, null, 2);
    submitBtn.disabled = !(formState.nome.trim() !== '' && formState.email.trim() !== '' && formState.aceitaTermos);
  };

  Object.entries(fieldElements).forEach(([field, element]) => {
    if (!element) return;
    const sync = (event) => {
      formState = { ...formState, [field]: event.detail };
      render();
    };
    // Text/masked inputs, textarea and the date picker fire scarletInput on
    // every keystroke; select/switch/checkbox/radio-group only ever fire
    // scarletChange. Listening to both on every field is harmless — a field
    // that never fires one of the two just never triggers that listener.
    element.addEventListener('scarletInput', sync);
    element.addEventListener('scarletChange', sync);
  });

  document.getElementById('f-reset-btn').addEventListener('scarletClick', () => {
    formState = emptyForm();
    Object.entries(fieldElements).forEach(([field, element]) => {
      if (!element) return;
      if (typeof formState[field] === 'boolean') {
        element.checked = formState[field];
      } else {
        element.value = formState[field];
      }
    });
    successAlert.hidden = true;
    render();
  });

  submitBtn.addEventListener('scarletClick', () => {
    successAlert.hidden = false;
  });

  successAlert.addEventListener('scarletDismiss', () => {
    successAlert.hidden = true;
  });

  render();
}
