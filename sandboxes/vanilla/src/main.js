import '@scarlet/design-system/dist/scarlet/scarlet.css';
import { defineCustomElements } from '@scarlet/design-system/loader';
import './style.css';

// Define custom elements
defineCustomElements();

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
      </main>
    </div>
  `;

  // Add event listeners
  setupEventListeners();
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
