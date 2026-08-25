<template>
  <div id="app">
    <header class="header">
      <h1>Scarlet Design System - Vue Sandbox</h1>
      <p>Testing Web Components with Vue.js</p>
    </header>

    <main class="main">
      <section class="section">
        <h2>Button</h2>
        <div class="button-group">
          <scarlet-button variant="solid" color="primary" @scarletClick="onButtonClick('Primary')">Primary</scarlet-button>
          <scarlet-button variant="solid" color="secondary" @scarletClick="onButtonClick('Secondary')">Secondary</scarlet-button>
          <scarlet-button variant="outline" @scarletClick="onButtonClick('Outline')">Outline</scarlet-button>
          <scarlet-button variant="ghost" @scarletClick="onButtonClick('Ghost')">Ghost</scarlet-button>
          <scarlet-button variant="link" @scarletClick="onButtonClick('Link')">Link</scarlet-button>
          <scarlet-button variant="solid" disabled>Disabled</scarlet-button>
        </div>
        <p>Último clicado: <strong>{{ lastClicked }}</strong> — Total de cliques: <strong>{{ clickCount }}</strong></p>
      </section>

      <section class="section">
        <h2>Input</h2>
        <div class="input-group">
          <scarlet-input label="Nome" placeholder="Digite seu nome" :value="inputValue" @scarletInput="onInputChange" />
          <scarlet-input type="email" label="E-mail" placeholder="voce@exemplo.com" />
          <scarlet-input type="password" label="Senha" helper-text="Mínimo de 8 caracteres" />
          <scarlet-input label="Com erro" error-message="Este campo é obrigatório" invalid />
        </div>
        <p>Valor digitado: <strong>{{ inputValue || '-' }}</strong></p>
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
          <scarlet-card interactive @scarletClick="onButtonClick('Card interativo')">
            <span slot="header">Card interativo</span>
            <p>Clique em qualquer lugar deste card.</p>
          </scarlet-card>
        </div>
      </section>

      <section class="section">
        <h2>Alert</h2>
        <div class="alert-group">
          <scarlet-alert status="info">Este é um alerta informativo.</scarlet-alert>
          <scarlet-alert status="success">Operação concluída com sucesso.</scarlet-alert>
          <scarlet-alert status="warning">Atenção: revise os dados informados.</scarlet-alert>
          <scarlet-alert v-if="alertVisible" status="error" dismissible @scarletDismiss="alertVisible = false">
            Ocorreu um erro ao processar sua solicitação.
          </scarlet-alert>
        </div>
      </section>

      <section class="section">
        <h2>Formulário de cadastro</h2>
        <p class="section-note">
          Um exemplo mais completo, combinando os componentes de formulário do Scarlet num cadastro real: texto, inputs
          mascarados pt-BR, select, date picker, radio group, textarea, switch e checkbox — cada um ligado a uma chave de
          <code>form</code> via <code>:value</code>/<code>:checked</code> e <code>@scarletInput</code>/<code>@scarletChange</code>.
        </p>
        <div class="form">
          <div class="form-grid">
            <scarlet-input label="Nome completo" placeholder="Seu nome" required :value="form.nome" @scarletInput="setField('nome', $event)" />
            <scarlet-input
              type="email"
              label="E-mail"
              placeholder="voce@exemplo.com"
              required
              :value="form.email"
              @scarletInput="setField('email', $event)"
            />
            <scarlet-input-phone label="Telefone" :value="form.telefone" @scarletInput="setField('telefone', $event)" />
            <scarlet-input-document label="CPF ou CNPJ" :value="form.documento" @scarletInput="setField('documento', $event)" />
            <scarlet-input-cep label="CEP" :value="form.cep" @scarletInput="setField('cep', $event)" />
            <scarlet-select label="Estado" placeholder="Selecione" :options="ufOptions" :value="form.uf" @scarletChange="setField('uf', $event)" />
            <scarlet-date-picker label="Data de nascimento" :value="form.nascimento" @scarletInput="setField('nascimento', $event)" />
          </div>

          <fieldset class="form-fieldset">
            <legend>Tipo de conta</legend>
            <scarlet-radio-group :value="form.tipoConta" horizontal @scarletChange="setField('tipoConta', $event)">
              <scarlet-radio value="pessoal" label="Pessoal" />
              <scarlet-radio value="empresa" label="Empresa" />
            </scarlet-radio-group>
          </fieldset>

          <scarlet-textarea
            label="Mensagem"
            placeholder="Conte um pouco sobre o motivo do contato"
            :rows="4"
            :value="form.mensagem"
            @scarletInput="setField('mensagem', $event)"
          />

          <div class="form-toggles">
            <scarlet-switch
              label="Quero receber novidades por e-mail"
              :checked="form.novidades"
              @scarletChange="setField('novidades', $event)"
            />
            <scarlet-checkbox
              label="Li e aceito os termos de uso"
              required
              :checked="form.aceitaTermos"
              @scarletChange="setField('aceitaTermos', $event)"
            />
          </div>

          <scarlet-alert v-if="submitted" status="success" dismissible @scarletDismiss="submitted = false">
            Cadastro enviado! Confira abaixo os dados coletados pelo formulário.
          </scarlet-alert>

          <div class="form-actions">
            <scarlet-button variant="ghost" color="neutral" @scarletClick="resetForm">Limpar</scarlet-button>
            <scarlet-button variant="solid" color="primary" :disabled="!canSubmit" @scarletClick="submitted = true">
              Enviar cadastro
            </scarlet-button>
          </div>

          <details class="form-preview">
            <summary>Estado atual do formulário (JSON)</summary>
            <pre>{{ JSON.stringify(form, null, 2) }}</pre>
          </details>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
// Vue's SFC template compiler is case-sensitive (it does NOT lowercase
// attribute/directive names the way a browser's native HTML parser would),
// so `@scarletInput` here really does add a listener for the literal
// `scarletInput` CustomEvent Stencil dispatches. It also does NOT
// kebab-case → camelCase these back for native/custom elements the way it
// does for a Vue component's declared `emits` — only camelCase spellings
// match. Writing `@scarlet-input` (kebab, and the tempting look-alike of
// this file's own `helper-text`/`error-message` prop attributes) silently
// listens for an event that's never dispatched, and nothing fires.
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

const initialForm = () => ({
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

export default {
  name: 'App',
  data() {
    return {
      inputValue: '',
      lastClicked: '-',
      clickCount: 0,
      alertVisible: true,
      ufOptions: UF_OPTIONS,
      form: initialForm(),
      submitted: false,
    };
  },
  computed: {
    canSubmit() {
      return this.form.nome.trim() !== '' && this.form.email.trim() !== '' && this.form.aceitaTermos;
    },
  },
  methods: {
    onButtonClick(name) {
      this.lastClicked = name;
      this.clickCount += 1;
    },
    onInputChange(event) {
      this.inputValue = event.detail;
    },
    // Shared by every field in the cadastro form: `event.detail` is the
    // masked/typed string for text-like fields, or the boolean/string
    // value Stencil already computed for select/switch/checkbox/radio-group.
    setField(field, event) {
      this.form[field] = event.detail;
    },
    resetForm() {
      this.form = initialForm();
      this.submitted = false;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.header h1 {
  margin: 0 0 10px 0;
  color: #be123c;
}

.header p {
  margin: 0;
  color: #64748b;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.section h2 {
  margin: 0 0 20px 0;
  color: #1e293b;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
}

.card-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.alert-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 600px;
}

.section-note {
  margin: 0 0 20px 0;
  color: #64748b;
  max-width: 720px;
}

.section-note code {
  padding: 1px 4px;
  border-radius: 4px;
  background: #f1f5f9;
  font-size: 0.9em;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 720px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.form-fieldset {
  padding: 12px 16px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.form-fieldset legend {
  padding: 0 6px;
  color: #1e293b;
  font-weight: 600;
}

.form-toggles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.form-preview {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}

.form-preview summary {
  cursor: pointer;
  font-weight: 600;
  color: #1e293b;
}

.form-preview pre {
  margin: 12px 0 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
