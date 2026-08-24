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
          <scarlet-button variant="solid" color="primary" @scarlet-click="onButtonClick('Primary')">Primary</scarlet-button>
          <scarlet-button variant="solid" color="secondary" @scarlet-click="onButtonClick('Secondary')">Secondary</scarlet-button>
          <scarlet-button variant="outline" @scarlet-click="onButtonClick('Outline')">Outline</scarlet-button>
          <scarlet-button variant="ghost" @scarlet-click="onButtonClick('Ghost')">Ghost</scarlet-button>
          <scarlet-button variant="link" @scarlet-click="onButtonClick('Link')">Link</scarlet-button>
          <scarlet-button variant="solid" disabled>Disabled</scarlet-button>
        </div>
        <p>Último clicado: <strong>{{ lastClicked }}</strong> — Total de cliques: <strong>{{ clickCount }}</strong></p>
      </section>

      <section class="section">
        <h2>Input</h2>
        <div class="input-group">
          <scarlet-input label="Nome" placeholder="Digite seu nome" :value="inputValue" @scarlet-input="onInputChange" />
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
          <scarlet-card interactive @scarlet-click="onButtonClick('Card interativo')">
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
          <scarlet-alert v-if="alertVisible" status="error" dismissible @scarlet-dismiss="alertVisible = false">
            Ocorreu um erro ao processar sua solicitação.
          </scarlet-alert>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      inputValue: '',
      lastClicked: '-',
      clickCount: 0,
      alertVisible: true
    };
  },
  methods: {
    onButtonClick(name) {
      this.lastClicked = name;
      this.clickCount += 1;
    },
    onInputChange(event) {
      this.inputValue = event.detail;
    }
  }
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
</style>
